export type RateLimit = {
  readonly requests: number
  readonly windowMs: number
}

export type EndpointMetadata = {
  readonly id: string
  readonly method: "GET"
  readonly routeKind: "platform" | "regional"
  readonly rateLimits: readonly RateLimit[]
  readonly esportsRateLimits?: readonly RateLimit[]
  readonly cacheable: boolean
}

const TEN_SECONDS = 10_000
const ONE_MINUTE = 60_000
const TEN_MINUTES = 600_000

const HIGH_CAPACITY_LIMITS = [
  { requests: 20_000, windowMs: TEN_SECONDS },
  { requests: 1_200_000, windowMs: TEN_MINUTES },
] as const

const endpointCatalog = {
  account: {
    getByRiotId: {
      id: "account-v1.getByRiotId",
      method: "GET",
      routeKind: "regional",
      rateLimits: [{ requests: 1_000, windowMs: ONE_MINUTE }],
      esportsRateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: true,
    },
    getByPuuid: {
      id: "account-v1.getByPuuid",
      method: "GET",
      routeKind: "regional",
      rateLimits: [{ requests: 1_000, windowMs: ONE_MINUTE }],
      esportsRateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: true,
    },
    getMe: {
      id: "account-v1.getMe",
      method: "GET",
      routeKind: "regional",
      rateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: false,
    },
    getActiveShard: {
      id: "account-v1.getActiveShard",
      method: "GET",
      routeKind: "regional",
      rateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: true,
    },
  },
  content: {
    getContents: {
      id: "val-content-v1.getContent",
      method: "GET",
      routeKind: "platform",
      rateLimits: [{ requests: 250, windowMs: TEN_SECONDS }],
      cacheable: true,
    },
  },
  match: {
    getMatch: {
      id: "val-match-v1.getMatch",
      method: "GET",
      routeKind: "platform",
      rateLimits: [{ requests: 800, windowMs: TEN_SECONDS }],
      cacheable: true,
    },
    getMatchlist: {
      id: "val-match-v1.getMatchlist",
      method: "GET",
      routeKind: "platform",
      rateLimits: [{ requests: 800, windowMs: TEN_SECONDS }],
      cacheable: true,
    },
    getRecent: {
      id: "val-match-v1.getRecent",
      method: "GET",
      routeKind: "platform",
      rateLimits: [{ requests: 60, windowMs: ONE_MINUTE }],
      cacheable: false,
    },
  },
  ranked: {
    getLeaderboard: {
      id: "val-ranked-v1.getLeaderboard",
      method: "GET",
      routeKind: "platform",
      rateLimits: [{ requests: 10, windowMs: TEN_SECONDS }],
      cacheable: false,
    },
  },
  status: {
    getPlatformData: {
      id: "val-status-v1.getPlatformData",
      method: "GET",
      routeKind: "platform",
      rateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: false,
    },
  },
  consoleMatch: {
    getMatch: {
      id: "val-console-match-v1.getMatch",
      method: "GET",
      routeKind: "platform",
      rateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: true,
    },
    getMatchlist: {
      id: "val-console-match-v1.getMatchlist",
      method: "GET",
      routeKind: "platform",
      rateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: true,
    },
    getRecent: {
      id: "val-console-match-v1.getRecent",
      method: "GET",
      routeKind: "platform",
      rateLimits: HIGH_CAPACITY_LIMITS,
      cacheable: false,
    },
  },
  consoleRanked: {
    getLeaderboard: {
      id: "val-console-ranked-v1.getLeaderboard",
      method: "GET",
      routeKind: "platform",
      rateLimits: [],
      cacheable: false,
    },
  },
} as const satisfies Record<string, Record<string, EndpointMetadata>>

for (const family of Object.values(endpointCatalog)) {
  for (const endpoint of Object.values(family)) {
    for (const limit of endpoint.rateLimits) {
      Object.freeze(limit)
    }
    Object.freeze(endpoint.rateLimits)
    if ("esportsRateLimits" in endpoint) {
      for (const limit of endpoint.esportsRateLimits) {
        Object.freeze(limit)
      }
      Object.freeze(endpoint.esportsRateLimits)
    }
    Object.freeze(endpoint)
  }
  Object.freeze(family)
}

export const ENDPOINTS = Object.freeze(endpointCatalog)
