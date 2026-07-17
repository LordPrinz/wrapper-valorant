import { ENDPOINTS } from "./core/endpoints.ts"
import { RequestExecutor, type RequestExecutorConfig } from "./core/request-executor.ts"
import {
  assertPlatformRoute,
  assertRegionalRoute,
  defaultRegionalRoute,
  type PlatformRoute,
  type RegionalRoute,
} from "./core/routing.ts"
import { AccountApi } from "./families/account.ts"
import { ContentApi } from "./families/content.ts"
import { ConsoleMatchApi, MatchApi } from "./families/match.ts"
import { ConsoleRankedApi, RankedApi } from "./families/ranked.ts"
import { StatusApi } from "./families/status.ts"

export type ValorantApiConfig = RequestExecutorConfig & {
  /** Default VAL platform route. Defaults to `eu`. */
  readonly defaultPlatform?: PlatformRoute
  /** Default Account regional route inferred from the platform when omitted. */
  readonly defaultRegion?: RegionalRoute
}

/** Typed client for the official Riot VALORANT and Account APIs. */
export class ValorantApi {
  readonly account: AccountApi
  readonly consoleMatch: ConsoleMatchApi
  readonly consoleRanked: ConsoleRankedApi
  readonly content: ContentApi
  readonly match: MatchApi
  readonly ranked: RankedApi
  readonly status: StatusApi
  readonly endpoints = ENDPOINTS

  /** Creates an isolated client with injectable transport, cache, and lifecycle hooks. */
  constructor(config: ValorantApiConfig) {
    const defaultPlatform = config.defaultPlatform ?? "eu"
    const defaultRegion = config.defaultRegion ?? defaultRegionalRoute(defaultPlatform)
    assertPlatformRoute(defaultPlatform)
    assertRegionalRoute(defaultRegion)
    const executor = new RequestExecutor(config)

    this.account = new AccountApi(executor, defaultRegion)
    this.consoleMatch = new ConsoleMatchApi(executor, defaultPlatform)
    this.consoleRanked = new ConsoleRankedApi(executor, defaultPlatform)
    this.content = new ContentApi(executor, defaultPlatform)
    this.match = new MatchApi(executor, defaultPlatform)
    this.ranked = new RankedApi(executor, defaultPlatform)
    this.status = new StatusApi(executor, defaultPlatform)
  }
}

export { type CacheAdapter, MemoryCache, type MemoryCacheOptions } from "./core/cache.ts"
export { ENDPOINTS, type EndpointMetadata, type RateLimit } from "./core/endpoints.ts"
export {
  HookExecutionError,
  RequestCancelledError,
  RequestTimeoutError,
  RiotApiError,
  type RiotRateLimitHeaders,
  TransportError,
  ValorantConfigurationError,
} from "./core/errors.ts"
export type {
  CachePolicy,
  ClientHooks,
  JsonDecoder,
  PlatformDecodedRequestOptions,
  PlatformRequestOptions,
  RegionalDecodedRequestOptions,
  RegionalRequestOptions,
  RequestHookContext,
  ResponseHookContext,
} from "./core/request-executor.ts"
export type { PlatformRoute, RegionalRoute, RiotRoute } from "./core/routing.ts"
export { PLATFORM_ROUTES, REGIONAL_ROUTES } from "./core/routing.ts"
export type { HttpHeaders, HttpRequest, HttpResponse, TransportAdapter } from "./core/transport.ts"
export { FetchTransport } from "./core/transport.ts"
export type { ContentRequestOptions, DecodedContentRequestOptions } from "./families/content.ts"
export type {
  DecodedLeaderboardRequestOptions,
  LeaderboardRequestOptions,
} from "./families/ranked.ts"
export type * from "./types/account.ts"
export type * from "./types/content.ts"
export type * from "./types/match.ts"
export type * from "./types/ranked.ts"
export type * from "./types/status.ts"
