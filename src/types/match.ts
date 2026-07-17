/** Detailed PC match result returned by VAL Match V1. */
export type MatchDto = {
  readonly matchInfo: MatchInfoDto
  readonly players: readonly MatchPlayerDto[]
  readonly coaches: readonly CoachDto[]
  readonly teams: readonly TeamDto[]
  readonly roundResults: readonly RoundResultDto[]
}

/** Detailed console match result returned by Console Match V1. */
export type ConsoleMatchDto = {
  readonly matchInfo: ConsoleMatchInfoDto
  readonly players: readonly ConsoleMatchPlayerDto[]
  readonly coaches: readonly CoachDto[]
  readonly teams: readonly TeamDto[]
  readonly roundResults: readonly ConsoleRoundResultDto[]
}

/** Match history for a single PUUID. */
export type MatchlistDto = {
  readonly puuid: string
  readonly history: readonly MatchlistEntryDto[]
}

/** Summary entry in a player's match history. */
export type MatchlistEntryDto = {
  readonly matchId: string
  /** Match start time as Unix epoch milliseconds. */
  readonly gameStartTimeMillis: number
  /** Riot queue identifier, for example `competitive`. */
  readonly queueId: string
}

/** Recent match IDs for a queue. */
export type RecentMatchesDto = {
  /** Riot server time as Unix epoch milliseconds. */
  readonly currentTime: number
  readonly matchIds: readonly string[]
}

type BaseMatchInfoDto = {
  readonly matchId: string
  readonly mapId: string
  /** Total match duration in milliseconds. */
  readonly gameLengthMillis: number
  /** Match start time as Unix epoch milliseconds. */
  readonly gameStartMillis: number
  readonly provisioningFlowId: string
  readonly isCompleted: boolean
  readonly customGameName: string
  readonly queueId: string
  readonly gameMode: string
  readonly isRanked: boolean
  readonly seasonId: string
}

/** PC match-level identifiers, timing, queue, and completion state. */
export type MatchInfoDto = BaseMatchInfoDto & {
  readonly gameVersion: string
  readonly region: string
  readonly premierMatchInfo: readonly Readonly<Record<string, unknown>>[]
}

/** Console match-level identifiers, timing, queue, and completion state. */
export type ConsoleMatchInfoDto = BaseMatchInfoDto

type BaseMatchPlayerDto = {
  readonly puuid: string
  readonly gameName: string
  readonly tagLine: string
  readonly teamId: string
  readonly partyId: string
  readonly characterId: string
  readonly stats: PlayerStatsDto
  readonly competitiveTier: number
  readonly playerCard: string
  readonly playerTitle: string
}

/** PC player identity, selected character, rank, and match statistics. */
export type MatchPlayerDto = BaseMatchPlayerDto & {
  readonly isObserver: boolean
  readonly accountLevel: number
}

/** Console player identity, selected character, rank, and match statistics. */
export type ConsoleMatchPlayerDto = BaseMatchPlayerDto

/** Aggregate combat and ability statistics for one player. */
export type PlayerStatsDto = {
  readonly score: number
  readonly roundsPlayed: number
  readonly kills: number
  readonly deaths: number
  readonly assists: number
  /** Time played in milliseconds. */
  readonly playtimeMillis: number
  readonly abilityCasts: AbilityCastsDto
}

/** Counts of agent ability casts during the match. */
export type AbilityCastsDto = {
  readonly grenadeCasts: number
  readonly ability1Casts: number
  readonly ability2Casts: number
  readonly ultimateCasts: number
}

/** Coach assigned to a match team. */
export type CoachDto = {
  readonly puuid: string
  readonly teamId: string
}

/** Team result and round score. */
export type TeamDto = {
  readonly teamId: string
  readonly won: boolean
  readonly roundsPlayed: number
  readonly roundsWon: number
  readonly numPoints: number
}

type BaseRoundResultDto = {
  readonly roundNum: number
  readonly roundResult: string
  readonly roundCeremony: string
  readonly winningTeam: string
  readonly bombPlanter: string
  readonly bombDefuser: string
  /** Objective plant timestamp measured from the start of the round in milliseconds. */
  readonly plantRoundTime: number
  readonly plantPlayerLocations: readonly PlayerLocationDto[]
  readonly plantLocation: LocationDto
  readonly plantSite: string
  /** Objective defuse timestamp measured from the start of the round in milliseconds. */
  readonly defuseRoundTime: number
  readonly defusePlayerLocations: readonly PlayerLocationDto[]
  readonly defuseLocation: LocationDto
  readonly playerStats: readonly PlayerRoundStatsDto[]
  readonly roundResultCode: string
}

/** Complete PC result, objective events, and player statistics for one round. */
export type RoundResultDto = BaseRoundResultDto & {
  readonly winningTeamRole: string
}

/** Complete console result, objective events, and player statistics for one round. */
export type ConsoleRoundResultDto = BaseRoundResultDto

/** Combat, economy, and ability telemetry for one player in one round. */
export type PlayerRoundStatsDto = {
  readonly puuid: string
  readonly kills: readonly KillDto[]
  readonly damage: readonly DamageDto[]
  readonly score: number
  readonly economy: EconomyDto
  readonly ability: AbilityDto
}

/** A kill event with timestamps and player locations. */
export type KillDto = {
  /** Milliseconds elapsed since the match began. */
  readonly timeSinceGameStartMillis: number
  /** Milliseconds elapsed since the round began. */
  readonly timeSinceRoundStartMillis: number
  readonly killer: string
  readonly victim: string
  readonly victimLocation: LocationDto
  readonly assistants: readonly string[]
  readonly playerLocations: readonly PlayerLocationDto[]
  readonly finishingDamage: FinishingDamageDto
}

/** Damage dealt by one player to another during a round. */
export type DamageDto = {
  readonly receiver: string
  readonly damage: number
  readonly legshots: number
  readonly bodyshots: number
  readonly headshots: number
}

/** Player loadout and credits for a round. */
export type EconomyDto = {
  readonly loadoutValue: number
  readonly weapon: string
  readonly armor: string
  readonly remaining: number
  readonly spent: number
}

/** Serialized ability effects reported for a round. */
export type AbilityDto = {
  readonly grenadeEffects: string | null
  readonly ability1Effects: string | null
  readonly ability2Effects: string | null
  readonly ultimateEffects: string | null
}

/** Player position and facing angle captured at an event. */
export type PlayerLocationDto = {
  readonly puuid: string
  /** Facing angle in radians. */
  readonly viewRadians: number
  readonly location: LocationDto
}

/** Two-dimensional Riot map coordinate. */
export type LocationDto = {
  readonly x: number
  readonly y: number
}

/** Weapon or ability metadata for the damage that completed a kill. */
export type FinishingDamageDto = {
  readonly damageType: string
  readonly damageItem: string
  readonly isSecondaryFireMode: boolean
}
