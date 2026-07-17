import type { EndpointMetadata } from "../core/endpoints.ts"
import { ENDPOINTS } from "../core/endpoints.ts"
import { ValorantConfigurationError } from "../core/errors.ts"
import type {
  JsonDecoder,
  PlatformRequestOptions,
  RequestExecutor,
} from "../core/request-executor.ts"
import type { PlatformRoute } from "../core/routing.ts"
import type { ConsoleLeaderboardDto, LeaderboardDto } from "../types/ranked.ts"

export type LeaderboardRequestOptions = PlatformRequestOptions & {
  readonly size?: number
  readonly startIndex?: number
}

export type DecodedLeaderboardRequestOptions<T> = LeaderboardRequestOptions & {
  readonly decode: JsonDecoder<T>
}

class RankedFamily<TLeaderboard> {
  readonly #executor: RequestExecutor
  readonly #defaultPlatform: PlatformRoute
  readonly #endpoint: EndpointMetadata
  readonly #basePath: string

  constructor(
    executor: RequestExecutor,
    defaultPlatform: PlatformRoute,
    endpoint: EndpointMetadata,
    basePath: string,
  ) {
    this.#executor = executor
    this.#defaultPlatform = defaultPlatform
    this.#endpoint = endpoint
    this.#basePath = basePath
  }

  /** Returns a paginated competitive leaderboard for an act. */
  getLeaderboard(actId: string, options?: LeaderboardRequestOptions): Promise<TLeaderboard>
  getLeaderboard<T>(actId: string, options: DecodedLeaderboardRequestOptions<T>): Promise<T>
  getLeaderboard<T>(
    actId: string,
    options: LeaderboardRequestOptions | DecodedLeaderboardRequestOptions<T> = {},
  ): Promise<TLeaderboard | T> {
    validateLeaderboardOptions(options.size, options.startIndex)
    return this.#executor.request<TLeaderboard | T>({
      endpoint: this.#endpoint,
      route: { kind: "platform", platform: options.platform ?? this.#defaultPlatform },
      path: `${this.#basePath}/leaderboards/by-act/${encodeURIComponent(actId)}`,
      query: { size: options.size, startIndex: options.startIndex },
      auth: { kind: "api-key" },
      options,
    })
  }
}

export class RankedApi extends RankedFamily<LeaderboardDto> {
  constructor(executor: RequestExecutor, defaultPlatform: PlatformRoute) {
    super(executor, defaultPlatform, ENDPOINTS.ranked.getLeaderboard, "/val/ranked/v1")
  }
}

export class ConsoleRankedApi extends RankedFamily<ConsoleLeaderboardDto> {
  constructor(executor: RequestExecutor, defaultPlatform: PlatformRoute) {
    super(
      executor,
      defaultPlatform,
      ENDPOINTS.consoleRanked.getLeaderboard,
      "/val/console/ranked/v1",
    )
  }
}

function validateLeaderboardOptions(
  size: number | undefined,
  startIndex: number | undefined,
): void {
  if (size !== undefined && (!Number.isInteger(size) || size < 1 || size > 200)) {
    throw new ValorantConfigurationError("Leaderboard size must be an integer from 1 to 200")
  }
  if (startIndex !== undefined && (!Number.isInteger(startIndex) || startIndex < 0)) {
    throw new ValorantConfigurationError("Leaderboard startIndex must be a non-negative integer")
  }
}
