import { RiotApiError, type RiotRateLimitHeaders } from "./errors.ts"
import { type RiotRoute, resolveHost } from "./routing.ts"
import type { HttpHeaders, HttpRequest, HttpResponse } from "./transport.ts"

export type RequestAuth =
  | { readonly kind: "api-key" }
  | { readonly kind: "bearer"; readonly accessToken: string }

export function buildUrl(
  route: RiotRoute,
  path: string,
  query: Readonly<Record<string, string | number | undefined>> | undefined,
): URL {
  const url = new URL(path, `https://${resolveHost(route)}`)
  if (query !== undefined) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url
}

export function createHttpRequest(
  url: URL,
  auth: RequestAuth,
  apiKey: string,
  signal: AbortSignal,
): HttpRequest {
  const headers: HttpHeaders =
    auth.kind === "api-key"
      ? { Accept: "application/json", "X-Riot-Token": apiKey }
      : { Accept: "application/json", Authorization: `Bearer ${auth.accessToken}` }

  return { method: "GET", url, headers, signal }
}

export function assertSuccessful(response: HttpResponse, url: string): void {
  if (response.status >= 200 && response.status < 300) {
    return
  }

  const retryAfter = response.headers.get("retry-after")
  const retryAfterSeconds = retryAfter === null ? Number.NaN : Number(retryAfter)
  const retryAfterMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1_000 : undefined
  throw new RiotApiError({
    status: response.status,
    statusText: response.statusText,
    url,
    body: response.body,
    rateLimit: readRateLimitHeaders(response.headers),
    ...(retryAfterMs === undefined ? {} : { retryAfterMs }),
  })
}

export function readRateLimitHeaders(headers: Headers): RiotRateLimitHeaders {
  return {
    applicationLimit: headers.get("x-app-rate-limit") ?? undefined,
    applicationCount: headers.get("x-app-rate-limit-count") ?? undefined,
    methodLimit: headers.get("x-method-rate-limit") ?? undefined,
    methodCount: headers.get("x-method-rate-limit-count") ?? undefined,
    limitType: headers.get("x-rate-limit-type") ?? undefined,
  }
}
