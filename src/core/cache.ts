import { ValorantConfigurationError } from "./errors.ts"

/** Adapter contract for Redis, Keyv, LRU, or application-owned caches. */
export interface CacheAdapter {
  get(key: string, signal: AbortSignal): Promise<unknown | undefined>
  set(key: string, value: unknown, ttlMs: number, signal: AbortSignal): Promise<void>
  delete?(key: string, signal: AbortSignal): Promise<void>
}

export type MemoryCacheOptions = {
  readonly maxEntries?: number
  readonly now?: () => number
}

type CacheEntry = {
  readonly expiresAt: number
  readonly value: unknown
}

/** Small opt-in in-memory cache suitable for scripts and short-lived processes. */
export class MemoryCache implements CacheAdapter {
  readonly #entries = new Map<string, CacheEntry>()
  readonly #now: () => number
  readonly #maxEntries: number

  constructor(options: MemoryCacheOptions = {}) {
    const maxEntries = options.maxEntries ?? 1_000
    if (!Number.isInteger(maxEntries) || maxEntries <= 0) {
      throw new ValorantConfigurationError("MemoryCache maxEntries must be a positive integer")
    }
    this.#now = options.now ?? Date.now
    this.#maxEntries = maxEntries
  }

  async get(key: string, signal: AbortSignal): Promise<unknown | undefined> {
    signal.throwIfAborted()
    const entry = this.#entries.get(key)
    if (entry === undefined) {
      return undefined
    }

    if (entry.expiresAt <= this.#now()) {
      this.#entries.delete(key)
      return undefined
    }

    this.#entries.delete(key)
    this.#entries.set(key, entry)
    return entry.value
  }

  async set(key: string, value: unknown, ttlMs: number, signal: AbortSignal): Promise<void> {
    signal.throwIfAborted()
    this.#removeExpired()
    this.#entries.delete(key)
    while (this.#entries.size >= this.#maxEntries) {
      const oldestKey = this.#entries.keys().next().value
      if (oldestKey === undefined) {
        break
      }
      this.#entries.delete(oldestKey)
    }
    this.#entries.set(key, { expiresAt: this.#now() + ttlMs, value })
  }

  async delete(key: string, signal: AbortSignal): Promise<void> {
    signal.throwIfAborted()
    this.#entries.delete(key)
  }

  clear(): void {
    this.#entries.clear()
  }

  #removeExpired(): void {
    const now = this.#now()
    for (const [key, entry] of this.#entries) {
      if (entry.expiresAt <= now) {
        this.#entries.delete(key)
      }
    }
  }
}
