import { describe, expect, it } from "vitest"
import {
  ENDPOINTS,
  type HttpRequest,
  type HttpResponse,
  type TransportAdapter,
  ValorantApi,
  ValorantConfigurationError,
} from "../src/index.ts"

class EndpointTransport implements TransportAdapter {
  readonly requests: HttpRequest[] = []

  async send(request: HttpRequest): Promise<HttpResponse> {
    this.requests.push(request)
    return {
      status: 200,
      statusText: "OK",
      headers: new Headers({ "content-type": "application/json" }),
      body: {},
    }
  }
}

describe("endpoint families", () => {
  it("constructs every PC VAL endpoint", async () => {
    // Given
    const transport = new EndpointTransport()
    const api = new ValorantApi({ apiKey: "key", transport, defaultPlatform: "na" })

    // When
    await api.match.getMatch("match/id")
    await api.match.getMatchlist("player/id")
    await api.match.getRecent("competitive")
    await api.content.getContents({ locale: "pl-PL" })
    await api.ranked.getLeaderboard("act/id", { size: 50, startIndex: 10 })
    await api.status.getPlatformData()

    // Then
    expect(transport.requests.map((request) => request.url.toString())).toEqual([
      "https://na.api.riotgames.com/val/match/v1/matches/match%2Fid",
      "https://na.api.riotgames.com/val/match/v1/matchlists/by-puuid/player%2Fid",
      "https://na.api.riotgames.com/val/match/v1/recent-matches/by-queue/competitive",
      "https://na.api.riotgames.com/val/content/v1/contents?locale=pl-PL",
      "https://na.api.riotgames.com/val/ranked/v1/leaderboards/by-act/act%2Fid?size=50&startIndex=10",
      "https://na.api.riotgames.com/val/status/v1/platform-data",
    ])
  })

  it("constructs every console endpoint", async () => {
    // Given
    const transport = new EndpointTransport()
    const api = new ValorantApi({ apiKey: "key", transport, defaultPlatform: "eu" })

    // When
    await api.consoleMatch.getMatch("match-id")
    await api.consoleMatch.getMatchlist("puuid")
    await api.consoleMatch.getRecent("competitive")
    await api.consoleRanked.getLeaderboard("act-id")

    // Then
    expect(transport.requests.map((request) => request.url.pathname)).toEqual([
      "/val/match/console/v1/matches/match-id",
      "/val/match/console/v1/matchlists/by-puuid/puuid",
      "/val/match/console/v1/recent-matches/by-queue/competitive",
      "/val/console/ranked/v1/leaderboards/by-act/act-id",
    ])
  })

  it("maps a platform default to the matching account Regional Route", async () => {
    // Given
    const transport = new EndpointTransport()
    const api = new ValorantApi({ apiKey: "key", transport, defaultPlatform: "kr" })

    // When
    await api.account.getByPuuid("puuid")
    await api.account.getActiveShard("puuid")

    // Then
    expect(transport.requests.map((request) => request.url.toString())).toEqual([
      "https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/puuid",
      "https://asia.api.riotgames.com/riot/account/v1/active-shards/by-game/val/by-puuid/puuid",
    ])
  })

  it("routes Account esports variants through the esports host", async () => {
    // Given
    const transport = new EndpointTransport()
    const api = new ValorantApi({ apiKey: "key", transport })

    // When
    await api.account.getByRiotId("name", "tag", { region: "esports" })

    // Then
    expect(transport.requests[0]?.url.host).toBe("esports.api.riotgames.com")
    expect(ENDPOINTS.account.getByRiotId.esportsRateLimits).toEqual([
      { requests: 20_000, windowMs: 10_000 },
      { requests: 1_200_000, windowMs: 600_000 },
    ])
  })

  it("rejects leaderboard pagination outside the documented range", () => {
    // Given
    const api = new ValorantApi({ apiKey: "key", transport: new EndpointTransport() })

    // When
    const action = () => api.ranked.getLeaderboard("act", { size: 201 })

    // Then
    expect(action).toThrow(ValorantConfigurationError)
  })

  it("exposes rate-limit metadata for integrations", () => {
    // Given
    const recentMatchLimits = ENDPOINTS.match.getRecent.rateLimits

    // When
    const firstLimit = recentMatchLimits[0]

    // Then
    expect(firstLimit).toEqual({ requests: 60, windowMs: 60_000 })
  })

  it("publishes deeply immutable endpoint metadata", () => {
    // Given
    const endpoint = ENDPOINTS.account.getMe

    // When
    const mutationSucceeded = Reflect.set(endpoint, "cacheable", true)

    // Then
    expect(mutationSucceeded).toBe(false)
    expect(endpoint.cacheable).toBe(false)
    expect(Object.isFrozen(endpoint)).toBe(true)
    expect(Object.isFrozen(endpoint.rateLimits)).toBe(true)
  })
})
