export type HttpMethod = "GET"

export type HttpHeaders = {
  readonly Accept: "application/json"
  readonly Authorization?: string
  readonly "X-Riot-Token"?: string
}

/** A complete transport request with secrets carried only in headers. */
export type HttpRequest = {
  readonly method: HttpMethod
  readonly url: URL
  readonly headers: HttpHeaders
  readonly signal: AbortSignal
}

/** Normalized response returned by a custom transport adapter. */
export type HttpResponse = {
  readonly status: number
  readonly statusText: string
  readonly headers: Headers
  readonly body: unknown
}

/** Minimal adapter contract for fetch, Undici, proxies, mocks, and tracing. */
export interface TransportAdapter {
  send(request: HttpRequest): Promise<HttpResponse>
}

/** Fetch-based transport used by default in Node.js 22+ and modern runtimes. */
export class FetchTransport implements TransportAdapter {
  readonly #fetch: typeof globalThis.fetch

  constructor(fetchImplementation: typeof globalThis.fetch = globalThis.fetch) {
    this.#fetch = fetchImplementation
  }

  async send(request: HttpRequest): Promise<HttpResponse> {
    const response = await this.#fetch(request.url, {
      method: request.method,
      headers: request.headers,
      signal: request.signal,
      redirect: "error",
    })
    const body = await readBody(response)

    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body,
    }
  }
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const body: unknown = await response.json()
    return body
  }

  return response.text()
}
