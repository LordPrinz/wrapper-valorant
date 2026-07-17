import { describe, expect, it } from "vitest"
import { FetchTransport, type HttpRequest } from "../src/index.ts"

describe("FetchTransport", () => {
  it("rejects redirects so credentials cannot cross origins", async () => {
    // Given
    let redirect: RequestRedirect | undefined
    const fetchImplementation: typeof fetch = async (_input, init) => {
      redirect = init?.redirect
      return new Response("{}", {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    }
    const transport = new FetchTransport(fetchImplementation)
    const request: HttpRequest = {
      method: "GET",
      url: new URL("https://eu.api.riotgames.com/val/status/v1/platform-data"),
      headers: { Accept: "application/json", "X-Riot-Token": "secret" },
      signal: new AbortController().signal,
    }

    // When
    await transport.send(request)

    // Then
    expect(redirect).toBe("error")
  })
})
