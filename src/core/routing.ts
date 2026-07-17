/** A VALORANT platform deployment used by VAL endpoints. */
export const PLATFORM_ROUTES = ["ap", "br", "eu", "kr", "latam", "na"] as const

export type PlatformRoute = (typeof PLATFORM_ROUTES)[number]

/** A regional Riot Account deployment. */
export const REGIONAL_ROUTES = ["americas", "asia", "europe", "esports"] as const

export type RegionalRoute = (typeof REGIONAL_ROUTES)[number]

export type RiotRoute =
  | { readonly kind: "platform"; readonly platform: PlatformRoute }
  | { readonly kind: "regional"; readonly region: RegionalRoute }

export function resolveHost(route: RiotRoute): string {
  switch (route.kind) {
    case "platform": {
      assertPlatformRoute(route.platform)
      return `${route.platform}.api.riotgames.com`
    }
    case "regional": {
      assertRegionalRoute(route.region)
      return `${route.region}.api.riotgames.com`
    }
  }
}

export function defaultRegionalRoute(platform: PlatformRoute): RegionalRoute {
  assertPlatformRoute(platform)
  switch (platform) {
    case "na":
    case "br":
    case "latam":
      return "americas"
    case "ap":
    case "kr":
      return "asia"
    case "eu":
      return "europe"
  }
}

export function assertPlatformRoute(value: unknown): asserts value is PlatformRoute {
  if (!PLATFORM_ROUTES.some((route) => route === value)) {
    throw new ValorantConfigurationError(`Unsupported VAL platform route: ${String(value)}`)
  }
}

export function assertRegionalRoute(value: unknown): asserts value is RegionalRoute {
  if (!REGIONAL_ROUTES.some((route) => route === value)) {
    throw new ValorantConfigurationError(`Unsupported Account regional route: ${String(value)}`)
  }
}

import { ValorantConfigurationError } from "./errors.ts"
