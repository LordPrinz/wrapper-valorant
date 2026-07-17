/** Locales accepted by VAL Content V1. */
export const LOCALES = [
  "ar-AE",
  "de-DE",
  "en-GB",
  "en-US",
  "es-ES",
  "es-MX",
  "fr-FR",
  "id-ID",
  "it-IT",
  "ja-JP",
  "ko-KR",
  "pl-PL",
  "pt-BR",
  "ru-RU",
  "th-TH",
  "tr-TR",
  "vi-VN",
  "zh-CN",
  "zh-TW",
] as const

export type Locale = (typeof LOCALES)[number]

/** Localized display names keyed by Riot locale. */
export type LocalizedNamesDto = Readonly<Partial<Record<Locale, string>>>

/** A content-catalog resource and its Riot asset identifiers. */
export type ContentItemDto = {
  readonly name: string
  readonly localizedNames?: LocalizedNamesDto
  readonly id: string
  readonly assetName: string
  /** Internal Riot asset path; absent for resources that do not expose one. */
  readonly assetPath?: string
}

/** Competitive act or episode returned in the content catalog. */
export type ActDto = {
  readonly id: string
  readonly name: string
  readonly localizedNames?: LocalizedNamesDto
  readonly isActive: boolean
}

/** Complete versioned VALORANT content catalog. */
export type ContentDto = {
  /** Riot content version associated with every item in this response. */
  readonly version: string
  readonly characters: readonly ContentItemDto[]
  readonly maps: readonly ContentItemDto[]
  readonly chromas: readonly ContentItemDto[]
  readonly skins: readonly ContentItemDto[]
  readonly skinLevels: readonly ContentItemDto[]
  readonly equips: readonly ContentItemDto[]
  readonly gameModes: readonly ContentItemDto[]
  readonly sprays: readonly ContentItemDto[]
  readonly sprayLevels: readonly ContentItemDto[]
  readonly charms: readonly ContentItemDto[]
  readonly charmLevels: readonly ContentItemDto[]
  readonly playerCards: readonly ContentItemDto[]
  readonly playerTitles: readonly ContentItemDto[]
  readonly acts: readonly ActDto[]
}
