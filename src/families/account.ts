import { ENDPOINTS } from "../core/endpoints.ts"
import type {
  RegionalDecodedRequestOptions,
  RegionalRequestOptions,
  RequestExecutor,
} from "../core/request-executor.ts"
import type { RegionalRoute } from "../core/routing.ts"
import type { AccountDto, ActiveShardDto } from "../types/account.ts"

export class AccountApi {
  readonly #executor: RequestExecutor
  readonly #defaultRegion: RegionalRoute

  constructor(executor: RequestExecutor, defaultRegion: RegionalRoute) {
    this.#executor = executor
    this.#defaultRegion = defaultRegion
  }

  /** Resolves an account from its player-facing Riot ID. */
  getByRiotId(
    gameName: string,
    tagLine: string,
    options?: RegionalRequestOptions,
  ): Promise<AccountDto>
  getByRiotId<T = AccountDto>(
    gameName: string,
    tagLine: string,
    options: RegionalDecodedRequestOptions<T>,
  ): Promise<T>
  getByRiotId<T>(
    gameName: string,
    tagLine: string,
    options: RegionalRequestOptions | RegionalDecodedRequestOptions<T> = {},
  ): Promise<AccountDto | T> {
    return this.#executor.request<AccountDto | T>({
      endpoint: ENDPOINTS.account.getByRiotId,
      route: { kind: "regional", region: options.region ?? this.#defaultRegion },
      path: `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      auth: { kind: "api-key" },
      options,
    })
  }

  /** Resolves an account from its globally unique PUUID. */
  getByPuuid(puuid: string, options?: RegionalRequestOptions): Promise<AccountDto>
  getByPuuid<T>(puuid: string, options: RegionalDecodedRequestOptions<T>): Promise<T>
  getByPuuid<T>(
    puuid: string,
    options: RegionalRequestOptions | RegionalDecodedRequestOptions<T> = {},
  ): Promise<AccountDto | T> {
    return this.#executor.request<AccountDto | T>({
      endpoint: ENDPOINTS.account.getByPuuid,
      route: { kind: "regional", region: options.region ?? this.#defaultRegion },
      path: `/riot/account/v1/accounts/by-puuid/${encodeURIComponent(puuid)}`,
      auth: { kind: "api-key" },
      options,
    })
  }

  /** Resolves the current RSO account using an OAuth access token. */
  getMe(accessToken: string, options?: RegionalRequestOptions): Promise<AccountDto>
  getMe<T>(accessToken: string, options: RegionalDecodedRequestOptions<T>): Promise<T>
  getMe<T>(
    accessToken: string,
    options: RegionalRequestOptions | RegionalDecodedRequestOptions<T> = {},
  ): Promise<AccountDto | T> {
    return this.#executor.request<AccountDto | T>({
      endpoint: ENDPOINTS.account.getMe,
      route: { kind: "regional", region: options.region ?? this.#defaultRegion },
      path: "/riot/account/v1/accounts/me",
      auth: { kind: "bearer", accessToken },
      options,
    })
  }

  /** Returns the active platform shard for a PUUID and Riot game. */
  getActiveShard(
    puuid: string,
    game?: string,
    options?: RegionalRequestOptions,
  ): Promise<ActiveShardDto>
  getActiveShard<T>(
    puuid: string,
    game: string,
    options: RegionalDecodedRequestOptions<T>,
  ): Promise<T>
  getActiveShard<T>(
    puuid: string,
    game = "val",
    options: RegionalRequestOptions | RegionalDecodedRequestOptions<T> = {},
  ): Promise<ActiveShardDto | T> {
    return this.#executor.request<ActiveShardDto | T>({
      endpoint: ENDPOINTS.account.getActiveShard,
      route: { kind: "regional", region: options.region ?? this.#defaultRegion },
      path: `/riot/account/v1/active-shards/by-game/${encodeURIComponent(game)}/by-puuid/${encodeURIComponent(puuid)}`,
      auth: { kind: "api-key" },
      options,
    })
  }
}
