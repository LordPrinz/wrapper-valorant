import { describe, expect, it } from "vitest"
import { MemoryCache } from "../src/index.ts"

describe("MemoryCache", () => {
  it("evicts the least recently used entry at its configured limit", async () => {
    // Given
    const cache = new MemoryCache({ maxEntries: 2 })
    const signal = new AbortController().signal
    await cache.set("first", 1, 60_000, signal)
    await cache.set("second", 2, 60_000, signal)
    await cache.get("first", signal)

    // When
    await cache.set("third", 3, 60_000, signal)

    // Then
    await expect(cache.get("second", signal)).resolves.toBeUndefined()
    await expect(cache.get("first", signal)).resolves.toBe(1)
    await expect(cache.get("third", signal)).resolves.toBe(3)
  })
})
