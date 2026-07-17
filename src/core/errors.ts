export class ValorantConfigurationError extends Error {
  override readonly name = "ValorantConfigurationError"
}

export class RequestCancelledError extends Error {
  override readonly name = "RequestCancelledError"
  readonly reason: unknown

  constructor(reason: unknown, options?: ErrorOptions) {
    super("The Riot request was cancelled", options)
    this.reason = reason
  }
}

export class RequestTimeoutError extends Error {
  override readonly name = "RequestTimeoutError"
  readonly timeoutMs: number

  constructor(timeoutMs: number, options?: ErrorOptions) {
    super(`The Riot request timed out after ${timeoutMs}ms`, options)
    this.timeoutMs = timeoutMs
  }
}

export type RiotRateLimitHeaders = {
  readonly applicationLimit: string | undefined
  readonly applicationCount: string | undefined
  readonly methodLimit: string | undefined
  readonly methodCount: string | undefined
  readonly limitType: string | undefined
}

export class HookExecutionError extends Error {
  override readonly name = "HookExecutionError"
  readonly requestError: Error
  readonly hookError: Error

  constructor(requestError: Error, hookError: Error) {
    super("A client error hook failed while handling a Riot request error", {
      cause: requestError,
    })
    this.requestError = requestError
    this.hookError = hookError
  }
}

export class TransportError extends Error {
  override readonly name = "TransportError"

  constructor(options?: ErrorOptions) {
    super("The Riot transport failed with a non-Error value", options)
  }
}

export class RiotApiError extends Error {
  override readonly name = "RiotApiError"
  readonly status: number
  readonly statusText: string
  readonly url: string
  readonly body: unknown
  readonly retryAfterMs: number | undefined
  readonly rateLimit: RiotRateLimitHeaders

  constructor(input: {
    readonly status: number
    readonly statusText: string
    readonly url: string
    readonly body: unknown
    readonly retryAfterMs?: number
    readonly rateLimit: RiotRateLimitHeaders
  }) {
    super(`Riot API request failed with ${input.status} ${input.statusText}`)
    this.status = input.status
    this.statusText = input.statusText
    this.url = input.url
    this.body = input.body
    this.retryAfterMs = input.retryAfterMs
    this.rateLimit = input.rateLimit
  }
}
