import type { CacheAdapter } from "./cache.ts"
import type { EndpointMetadata, RateLimit } from "./endpoints.ts"
import { HookExecutionError, ValorantConfigurationError } from "./errors.ts"
import {
  assertSuccessful,
  buildUrl,
  createHttpRequest,
  type RequestAuth,
  readRateLimitHeaders,
} from "./http.ts"
import { createOperationSignals, normalizeOperationError, waitForOperation } from "./operation.ts"
import type { PlatformRoute, RegionalRoute, RiotRoute } from "./routing.ts"
import { FetchTransport, type TransportAdapter } from "./transport.ts"

/** Runtime decoder compatible with schema libraries such as Zod and Valibot. */
export type JsonDecoder<T> = (value: unknown) => T

/** Per-request cache override. `false` bypasses caching. */
export type CachePolicy = false | { readonly ttlMs: number }

type BaseRequestOptions = {
  readonly signal?: AbortSignal
  readonly cache?: CachePolicy
}

type RequestOptions<T> = BaseRequestOptions & {
  readonly decode?: JsonDecoder<T>
}

export type PlatformRequestOptions = BaseRequestOptions & {
  readonly platform?: PlatformRoute
}

export type PlatformDecodedRequestOptions<T> = PlatformRequestOptions & {
  readonly decode: JsonDecoder<T>
}

export type RegionalRequestOptions = BaseRequestOptions & {
  readonly region?: RegionalRoute
}

export type RegionalDecodedRequestOptions<T> = RegionalRequestOptions & {
  readonly decode: JsonDecoder<T>
}

export type RequestHookContext = {
  readonly endpoint: EndpointMetadata
  readonly url: string
  readonly rateLimits: readonly RateLimit[]
  readonly signal: AbortSignal
}

export type ResponseHookContext = RequestHookContext & {
  readonly status: number
  readonly durationMs: number
  readonly rateLimit: ReturnType<typeof readRateLimitHeaders>
}

/** Lifecycle hooks suitable for logging, metrics, tracing, and rate limiting. */
export interface ClientHooks {
  onRequest?(context: RequestHookContext): void | Promise<void>
  onResponse?(context: ResponseHookContext): void | Promise<void>
  onCacheHit?(context: RequestHookContext): void | Promise<void>
  onError?(error: Error, context: RequestHookContext): void | Promise<void>
}

export type RequestExecutorConfig = {
  /** Riot development or production API key. Never use this in browser code. */
  readonly apiKey: string
  /** Custom HTTP transport. Defaults to the native Fetch API. */
  readonly transport?: TransportAdapter
  /** Optional cache adapter; caching remains disabled without an adapter and positive TTL. */
  readonly cache?: CacheAdapter
  /** Default cache TTL for cacheable endpoints. Defaults to `0`. */
  readonly cacheTtlMs?: number
  /** Namespace prepended to cache keys. Defaults to `wrapper-valorant-api:`. */
  readonly cacheKeyPrefix?: string
  /** Request timeout in milliseconds. Defaults to `10000`. */
  readonly timeoutMs?: number
  /** Optional request lifecycle hooks. */
  readonly hooks?: ClientHooks
}

type RequestInput<T> = {
  readonly endpoint: EndpointMetadata
  readonly route: RiotRoute
  readonly path: string
  readonly query?: Readonly<Record<string, string | number | undefined>>
  readonly auth: RequestAuth
  readonly options?: RequestOptions<T>
}

export class RequestExecutor {
  readonly #apiKey: string
  readonly #transport: TransportAdapter
  readonly #cache: CacheAdapter | undefined
  readonly #cacheTtlMs: number
  readonly #cacheKeyPrefix: string
  readonly #timeoutMs: number
  readonly #hooks: ClientHooks | undefined

  constructor(config: RequestExecutorConfig) {
    if (config.apiKey.trim().length === 0) {
      throw new ValorantConfigurationError("A Riot API key is required")
    }
    validateTimeout(config.timeoutMs ?? 10_000)
    validateCacheTtl(config.cacheTtlMs ?? 0)

    this.#apiKey = config.apiKey
    this.#transport = config.transport ?? new FetchTransport()
    this.#cache = config.cache
    this.#cacheTtlMs = config.cacheTtlMs ?? 0
    this.#cacheKeyPrefix = config.cacheKeyPrefix ?? "wrapper-valorant-api:"
    this.#timeoutMs = config.timeoutMs ?? 10_000
    this.#hooks = config.hooks
  }

  async request<T>(input: RequestInput<T>): Promise<T> {
    const operation = createOperationSignals(input.options?.signal, this.#timeoutMs)
    const url = buildUrl(input.route, input.path, input.query)
    const context: RequestHookContext = {
      endpoint: input.endpoint,
      url: url.toString(),
      rateLimits: resolveRateLimits(input.endpoint, input.route),
      signal: operation.signal,
    }
    const decoder = input.options?.decode ?? decodeJson<T>
    const cacheTtlMs = resolveCacheTtl(
      input.endpoint,
      input.auth,
      input.options?.cache,
      this.#cacheTtlMs,
    )
    const cacheKey = `${this.#cacheKeyPrefix}${context.url}`
    const startedAt = performance.now()

    try {
      operation.signal.throwIfAborted()
      if (this.#cache !== undefined && cacheTtlMs > 0) {
        const cached = await waitForOperation(
          this.#cache.get(cacheKey, operation.signal),
          operation,
        )
        if (cached !== undefined) {
          await this.#runHook(this.#hooks?.onCacheHit, context, operation)
          return decoder(cached)
        }
      }

      await this.#runHook(this.#hooks?.onRequest, context, operation)
      const request = createHttpRequest(url, input.auth, this.#apiKey, operation.signal)
      const response = await waitForOperation(this.#transport.send(request), operation)
      await this.#runHook(
        this.#hooks?.onResponse,
        {
          ...context,
          status: response.status,
          durationMs: performance.now() - startedAt,
          rateLimit: readRateLimitHeaders(response.headers),
        },
        operation,
      )
      assertSuccessful(response, context.url)

      if (this.#cache !== undefined && cacheTtlMs > 0) {
        await waitForOperation(
          this.#cache.set(cacheKey, response.body, cacheTtlMs, operation.signal),
          operation,
        )
      }
      return decoder(response.body)
    } catch (error) {
      const requestError = normalizeOperationError(error, operation)
      const errorHook = this.#hooks?.onError
      if (errorHook === undefined) {
        throw requestError
      }

      let hookResult: void | Promise<void>
      try {
        hookResult = errorHook(requestError, context)
      } catch (hookError) {
        throw new HookExecutionError(requestError, normalizeOperationError(hookError, operation))
      }
      try {
        await waitForOperation(Promise.resolve(hookResult), operation)
      } catch (hookError) {
        if (operation.signal.aborted) {
          throw requestError
        }
        throw new HookExecutionError(requestError, normalizeOperationError(hookError, operation))
      }
      throw requestError
    }
  }

  async #runHook<TContext>(
    hook: ((context: TContext) => void | Promise<void>) | undefined,
    context: TContext,
    operation: ReturnType<typeof createOperationSignals>,
  ): Promise<void> {
    if (hook !== undefined) {
      await waitForOperation(Promise.resolve(hook(context)), operation)
    }
  }
}

function resolveRateLimits(endpoint: EndpointMetadata, route: RiotRoute): readonly RateLimit[] {
  if (route.kind === "regional" && route.region === "esports") {
    return endpoint.esportsRateLimits ?? endpoint.rateLimits
  }
  return endpoint.rateLimits
}

function resolveCacheTtl(
  endpoint: EndpointMetadata,
  auth: RequestAuth,
  policy: CachePolicy | undefined,
  defaultTtlMs: number,
): number {
  if (auth.kind === "bearer" || !endpoint.cacheable || policy === false) {
    return 0
  }
  const ttlMs = policy?.ttlMs ?? defaultTtlMs
  validateCacheTtl(ttlMs)
  return ttlMs
}

function validateTimeout(timeoutMs: number): void {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new ValorantConfigurationError("timeoutMs must be a finite number greater than zero")
  }
}

function validateCacheTtl(ttlMs: number): void {
  if (!Number.isFinite(ttlMs) || ttlMs < 0) {
    throw new ValorantConfigurationError("cache TTL must be a finite non-negative number")
  }
}

function decodeJson<T>(value: unknown): T {
  return value as T
}
