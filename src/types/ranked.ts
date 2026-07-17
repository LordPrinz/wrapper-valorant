/** Ranked identity and rating for one leaderboard entry. */
export type LeaderboardPlayerDto = {
  readonly puuid?: string
  readonly gameName?: string
  readonly tagLine?: string
  /** One-based leaderboard position. */
  readonly leaderboardRank: number
  readonly rankedRating: number
  readonly numberOfWins: number
}

/** Paginated competitive leaderboard for a Riot act. */
export type LeaderboardDto = {
  readonly shard: string
  readonly actId: string
  readonly totalPlayers: number
  readonly players: readonly LeaderboardPlayerDto[]
}

/** Console leaderboard response including query and tier metadata. */
export type ConsoleLeaderboardDto = LeaderboardDto & {
  readonly query: string
  readonly tierDetails: readonly Readonly<Record<string, unknown>>[]
}
