import { describe, expect, it } from "vitest"
import { resolveHost } from "../src/core/routing.ts"
import { ValorantApi, ValorantConfigurationError } from "../src/index.ts"

describe("resolveHost", () => {
  it("returns a platform host when the endpoint uses a Platform Route", () => {
    // Given
    const route = { kind: "platform", platform: "eu" } as const

    // When
    const host = resolveHost(route)

    // Then
    expect(host).toBe("eu.api.riotgames.com")
  })

  it("returns a regional host when the endpoint uses a Regional Route", () => {
    // Given
    const route = { kind: "regional", region: "europe" } as const

    // When
    const host = resolveHost(route)

    // Then
    expect(host).toBe("europe.api.riotgames.com")
  })

  it("rejects an untrusted platform value at runtime", () => {
    // Given
    const config = { apiKey: "secret", defaultPlatform: "attacker.example/" }

    // When
    const action = () => Reflect.construct(ValorantApi, [config])

    // Then
    expect(action).toThrow(ValorantConfigurationError)
  })
})
