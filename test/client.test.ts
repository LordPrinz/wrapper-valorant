import { describe, expect, it } from "vitest"
import {
  HookExecutionError,
  type HttpRequest,
  type HttpResponse,
  MemoryCache,
  RequestCancelledError,
  RequestTimeoutError,
  RiotApiError,
  type TransportAdapter,
  ValorantApi,
  ValorantConfigurationError,
} from "../src/index.ts"

class RecordingTransport implements TransportAdapter {
  readonly requests: HttpRequest[] = []
  response: HttpResponse = {
    status: 200,
    statusText: "OK",
    headers: new Headers({ "content-type": "application/json" }),
    body: { ok: true },
  }

  async send(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    return this.response
  }
}

describe("ValorantApi", () => {
  it("encodes Riot ID path segments and keeps the API key out of the URL", async () => {
    // Given
    const transport = new RecordingTransport()
    const api = new ValorantApi({ apiKey: "secret-key", transport })

    // When
    await api.account.getByRiotId("A name/with spaces", "EU#1")

    // Then
    expect(transport.requests).toHaveLength(1)
    const request = transport.requests[0]
    expect(request?.url.pathname).toBe(
      "/riot/account/v1/accounts/by-riot-id/A%20name%2Fwith%20spaces/EU%231",
    )
    expect(request?.url.toString()).not.toContain("secret-key")
    expect(request?.headers["X-Riot-Token"]).toBe("secret-key")
  })

  it("uses bearer authorization for the RSO current-account endpoint", async () => {
    // Given
    const transport = new RecordingTransport()
    const api = new ValorantApi({ apiKey: "api-key", transport })

    // When
    await api.account.getMe("access-token")

    // Then
    const request = transport.requests[0]
    expect(request?.headers.Authorization).toBe("Bearer access-token")
    expect(request?.headers["X-Riot-Token"]).toBeUndefined()
  })

  it("throws a typed Riot error for a non-success response", async () => {
    // Given
    const transport = new RecordingTransport()
    transport.response = {
      status: 429,
      statusText: "Too Many Requests",
      headers: new Headers({ "retry-after": "2" }),
      body: { status: { message: "rate limited", status_code: 429 } },
    }
    const api = new ValorantApi({ apiKey: "api-key", transport })

    // When
    const action = api.status.getPlatformData()

    // Then
    await expect(action).rejects.toEqual(
      expect.objectContaining({
        name: "RiotApiError",
        status: 429,
        retryAfterMs: 2_000,
      }),
    )
  })

  it("reuses cached raw responses and decodes them for every caller", async () => {
    // Given
    const transport = new RecordingTransport()
    const api = new ValorantApi({
      apiKey: "api-key",
      transport,
      cache: new MemoryCache(),
      cacheTtlMs: 60_000,
    })

    // When
    const first = await api.content.getContents({
      decode: (value) => ({ source: "first", value }),
    })
    const second = await api.content.getContents({
      decode: (value) => ({ source: "second", value }),
    })

    // Then
    expect(transport.requests).toHaveLength(1)
    expect(first.source).toBe("first")
    expect(second.source).toBe("second")
  })

  it("passes cancellation to the transport and returns a typed cancellation error", async () => {
    // Given
    const transport: TransportAdapter = {
      send: (request) =>
        new Promise((_resolve, reject) => {
          request.signal.addEventListener("abort", () => {
            reject(new DOMException("aborted", "AbortError"))
          })
        }),
    }
    const api = new ValorantApi({ apiKey: "api-key", transport, timeoutMs: 30_000 })
    const controller = new AbortController()

    // When
    const action = api.match.getMatch("match-id", { signal: controller.signal })
    controller.abort("test cancellation")

    // Then
    await expect(action).rejects.toBeInstanceOf(RequestCancelledError)
  })

  it("does not return cached data to an already cancelled caller", async () => {
    // Given
    const transport = new RecordingTransport()
    const api = new ValorantApi({
      apiKey: "api-key",
      transport,
      cache: new MemoryCache(),
      cacheTtlMs: 60_000,
    })
    await api.content.getContents()
    const controller = new AbortController()
    controller.abort("cancelled before cache lookup")

    // When
    const action = api.content.getContents({ signal: controller.signal })

    // Then
    await expect(action).rejects.toBeInstanceOf(RequestCancelledError)
  })

  it("cancels an asynchronous cache lookup", async () => {
    // Given
    const api = new ValorantApi({
      apiKey: "api-key",
      cacheTtlMs: 60_000,
      cache: {
        get: () => new Promise((resolve) => setTimeout(() => resolve({ cached: true }), 30)),
        set: async () => undefined,
      },
      transport: new RecordingTransport(),
    })
    const controller = new AbortController()

    // When
    const action = api.content.getContents({ signal: controller.signal })
    setTimeout(() => controller.abort("cancel cache"), 5)

    // Then
    await expect(action).rejects.toBeInstanceOf(RequestCancelledError)
  })

  it("applies the client timeout to cache adapters", async () => {
    // Given
    const api = new ValorantApi({
      apiKey: "api-key",
      timeoutMs: 5,
      cacheTtlMs: 60_000,
      cache: {
        get: () => new Promise((resolve) => setTimeout(() => resolve(undefined), 30)),
        set: async () => undefined,
      },
      transport: new RecordingTransport(),
    })

    // When
    const action = api.content.getContents()

    // Then
    await expect(action).rejects.toBeInstanceOf(RequestTimeoutError)
  })

  it("rejects non-finite timeout configuration", () => {
    // Given
    const config = { apiKey: "api-key", timeoutMs: Number.POSITIVE_INFINITY }

    // When
    const action = () => new ValorantApi(config)

    // Then
    expect(action).toThrow(ValorantConfigurationError)
  })

  it("never caches bearer-authenticated account responses", async () => {
    // Given
    const transport = new RecordingTransport()
    const api = new ValorantApi({
      apiKey: "api-key",
      transport,
      cache: new MemoryCache(),
      cacheTtlMs: 60_000,
    })

    // When
    await api.account.getMe("first-token")
    await api.account.getMe("second-token")

    // Then
    expect(transport.requests).toHaveLength(2)
  })

  it("exposes response rate-limit headers to integrations", async () => {
    // Given
    const transport = new RecordingTransport()
    transport.response = {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "x-app-rate-limit": "20:1",
        "x-method-rate-limit-count": "1:1",
        "x-rate-limit-type": "method",
      }),
      body: {},
    }
    let limitType: string | undefined
    const api = new ValorantApi({
      apiKey: "api-key",
      transport,
      hooks: {
        onResponse: ({ rateLimit }) => {
          limitType = rateLimit.limitType
        },
      },
    })

    // When
    await api.status.getPlatformData()

    // Then
    expect(limitType).toBe("method")
  })

  it("preserves both the request error and a failing error hook", async () => {
    // Given
    const transport = new RecordingTransport()
    transport.response = {
      status: 500,
      statusText: "Server Error",
      headers: new Headers(),
      body: {},
    }
    const api = new ValorantApi({
      apiKey: "api-key",
      transport,
      hooks: {
        onError: () => {
          throw new Error("telemetry unavailable")
        },
      },
    })

    // When
    const error = await api.status.getPlatformData().catch((value) => value)

    // Then
    expect(error).toBeInstanceOf(HookExecutionError)
    expect(error.requestError).toBeInstanceOf(RiotApiError)
    expect(error.hookError.message).toBe("telemetry unavailable")
  })
})
