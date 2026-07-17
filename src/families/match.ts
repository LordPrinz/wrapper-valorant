import type { EndpointMetadata } from "../core/endpoints.ts"
import { ENDPOINTS } from "../core/endpoints.ts"
import type {
  PlatformDecodedRequestOptions,
  PlatformRequestOptions,
  RequestExecutor,
} from "../core/request-executor.ts"
import type { PlatformRoute } from "../core/routing.ts"
import type { ConsoleMatchDto, MatchDto, MatchlistDto, RecentMatchesDto } from "../types/match.ts"

type MatchEndpoints = {
  readonly getMatch: EndpointMetadata
  readonly getMatchlist: EndpointMetadata
  readonly getRecent: EndpointMetadata
}

class MatchFamily<TMatch> {
  readonly #executor: RequestExecutor
  readonly #defaultPlatform: PlatformRoute
  readonly #endpoints: MatchEndpoints
  readonly #basePath: string

  constructor(
    executor: RequestExecutor,
    defaultPlatform: PlatformRoute,
    endpoints: MatchEndpoints,
    basePath: string,
  ) {
    this.#executor = executor
    this.#defaultPlatform = defaultPlatform
    this.#endpoints = endpoints
    this.#basePath = basePath
  }

  /** Returns a match by its Riot match ID. */
  getMatch(matchId: string, options?: PlatformRequestOptions): Promise<TMatch>
  getMatch<T>(matchId: string, options: PlatformDecodedRequestOptions<T>): Promise<T>
  getMatch<T>(
    matchId: string,
    options: PlatformRequestOptions | PlatformDecodedRequestOptions<T> = {},
  ): Promise<TMatch | T> {
    return this.#executor.request<TMatch | T>({
      endpoint: this.#endpoints.getMatch,
      route: { kind: "platform", platform: options.platform ?? this.#defaultPlatform },
      path: `${this.#basePath}/matches/${encodeURIComponent(matchId)}`,
      auth: { kind: "api-key" },
      options,
    })
  }

  /** Returns the match history for a PUUID. */
  getMatchlist(puuid: string, options?: PlatformRequestOptions): Promise<MatchlistDto>
  getMatchlist<T>(puuid: string, options: PlatformDecodedRequestOptions<T>): Promise<T>
  getMatchlist<T>(
    puuid: string,
    options: PlatformRequestOptions | PlatformDecodedRequestOptions<T> = {},
  ): Promise<MatchlistDto | T> {
    return this.#executor.request<MatchlistDto | T>({
      endpoint: this.#endpoints.getMatchlist,
      route: { kind: "platform", platform: options.platform ?? this.#defaultPlatform },
      path: `${this.#basePath}/matchlists/by-puuid/${encodeURIComponent(puuid)}`,
      auth: { kind: "api-key" },
      options,
    })
  }

  /** Returns recent matches for a queue. */
  getRecent(queue: string, options?: PlatformRequestOptions): Promise<RecentMatchesDto>
  getRecent<T>(queue: string, options: PlatformDecodedRequestOptions<T>): Promise<T>
  getRecent<T>(
    queue: string,
    options: PlatformRequestOptions | PlatformDecodedRequestOptions<T> = {},
  ): Promise<RecentMatchesDto | T> {
    return this.#executor.request<RecentMatchesDto | T>({
      endpoint: this.#endpoints.getRecent,
      route: { kind: "platform", platform: options.platform ?? this.#defaultPlatform },
      path: `${this.#basePath}/recent-matches/by-queue/${encodeURIComponent(queue)}`,
      auth: { kind: "api-key" },
      options,
    })
  }
}

export class MatchApi extends MatchFamily<MatchDto> {
  constructor(executor: RequestExecutor, defaultPlatform: PlatformRoute) {
    super(executor, defaultPlatform, ENDPOINTS.match, "/val/match/v1")
  }
}

export class ConsoleMatchApi extends MatchFamily<ConsoleMatchDto> {
  constructor(executor: RequestExecutor, defaultPlatform: PlatformRoute) {
    super(executor, defaultPlatform, ENDPOINTS.consoleMatch, "/val/match/console/v1")
  }
}
