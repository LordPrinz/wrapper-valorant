/** Localized status title or update body. */
export type StatusContentDto = {
  readonly locale: string
  readonly content: string
}

/** Published status update using Riot's snake_case wire names. */
export type StatusUpdateDto = {
  readonly id: number
  readonly author: string
  readonly publish: boolean
  /** Platform codes where this update is published. */
  readonly publish_locations: readonly string[]
  readonly translations: readonly StatusContentDto[]
  /** ISO-8601 creation timestamp. */
  readonly created_at: string
  /** ISO-8601 last-update timestamp. */
  readonly updated_at: string
}

/** Maintenance or incident record returned by VAL Status V1. */
export type StatusDto = {
  readonly id: number
  readonly maintenance_status: string
  readonly incident_severity: string
  readonly titles: readonly StatusContentDto[]
  readonly updates: readonly StatusUpdateDto[]
  readonly created_at: string
  /** ISO-8601 timestamp, or null while the record remains active. */
  readonly archive_at: string | null
  readonly updated_at: string
  readonly platforms: readonly string[]
}

/** Current incidents and maintenances for one VAL platform. */
export type PlatformDataDto = {
  readonly id: string
  readonly name: string
  readonly locales: readonly string[]
  readonly maintenances: readonly StatusDto[]
  readonly incidents: readonly StatusDto[]
}
