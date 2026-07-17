/** Riot account identity returned by Account V1. */
export type AccountDto = {
  /** Globally unique, stable player identifier. */
  readonly puuid: string
  /** Player-facing Riot ID name. */
  readonly gameName: string
  /** Player-facing Riot ID tag line. */
  readonly tagLine: string
}

/** Active platform shard for a Riot account and game. */
export type ActiveShardDto = {
  readonly puuid: string
  readonly game: string
  /** Platform route such as `eu`, `na`, or `ap`. */
  readonly activeShard: string
}
