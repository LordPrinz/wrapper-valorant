# wrapper-valorant-api

Tiny, typed, zero-runtime-dependency client for the official Riot VALORANT APIs.

[![npm version](https://img.shields.io/npm/v/wrapper-valorant-api.svg)](https://www.npmjs.com/package/wrapper-valorant-api)
[![CI](https://github.com/LordPrinz/wrapper-valorant/actions/workflows/ci.yml/badge.svg)](https://github.com/LordPrinz/wrapper-valorant/actions/workflows/ci.yml)

- ESM and CommonJS with bundled TypeScript declarations
- Native `fetch`, no runtime dependencies, about 4.2 kB gzip
- Platform and regional routing with safe path encoding
- `AbortSignal` cancellation and configurable timeouts
- Pluggable transport, cache, decoders, logging, metrics, and rate-limit hooks
- Typed Riot errors with retry and rate-limit response metadata
- PC and console match/ranked endpoint families

## Requirements

- Node.js 22 or newer, or a compatible runtime with Fetch and Abort APIs
- A Riot development or production API key

```bash
npm install wrapper-valorant-api
```

## Quick start

```ts
import { ValorantApi } from "wrapper-valorant-api"

const valorant = new ValorantApi({
  apiKey: process.env.RIOT_API_KEY ?? "",
  defaultPlatform: "eu",
})

const content = await valorant.content.getContents({ locale: "en-US" })
const account = await valorant.account.getByRiotId("Game Name", "TAG")
const history = await valorant.match.getMatchlist(account.puuid)
```

CommonJS is supported through the same package:

```js
const { ValorantApi } = require("wrapper-valorant-api")
```

## Endpoint families

| Client method | Official endpoint |
| --- | --- |
| `match.getMatch(matchId)` | `GET /val/match/v1/matches/{matchId}` |
| `match.getMatchlist(puuid)` | `GET /val/match/v1/matchlists/by-puuid/{puuid}` |
| `match.getRecent(queue)` | `GET /val/match/v1/recent-matches/by-queue/{queue}` |
| `content.getContents(options)` | `GET /val/content/v1/contents` |
| `account.getByRiotId(gameName, tagLine)` | `GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` |
| `account.getByPuuid(puuid)` | `GET /riot/account/v1/accounts/by-puuid/{puuid}` |
| `account.getMe(accessToken)` | `GET /riot/account/v1/accounts/me` |
| `account.getActiveShard(puuid, game)` | `GET /riot/account/v1/active-shards/by-game/{game}/by-puuid/{puuid}` |
| `ranked.getLeaderboard(actId, options)` | `GET /val/ranked/v1/leaderboards/by-act/{actId}` |
| `status.getPlatformData()` | `GET /val/status/v1/platform-data` |
| `consoleMatch.getMatch(matchId)` | `GET /val/match/console/v1/matches/{matchId}` |
| `consoleMatch.getMatchlist(puuid)` | `GET /val/match/console/v1/matchlists/by-puuid/{puuid}` |
| `consoleMatch.getRecent(queue)` | `GET /val/match/console/v1/recent-matches/by-queue/{queue}` |
| `consoleRanked.getLeaderboard(actId, options)` | `GET /val/console/ranked/v1/leaderboards/by-act/{actId}` |

The package exposes `ENDPOINTS` and `valorant.endpoints` with method, route type, cacheability, and the documented rate-limit windows supplied for each operation. Account esports variants use the same methods with `{ region: "esports" }`.

## Cancellation and timeout

```ts
const controller = new AbortController()

const request = valorant.match.getMatch("match-id", {
  signal: controller.signal,
})

controller.abort("navigation changed")
await request
```

Cancellation rejects with `RequestCancelledError`; elapsed client timeouts reject with `RequestTimeoutError`. Configure the default using `timeoutMs` in the constructor.

## Caching

Caching is opt-in and only applies to endpoints marked cacheable:

```ts
import { MemoryCache, ValorantApi } from "wrapper-valorant-api"

const valorant = new ValorantApi({
  apiKey: process.env.RIOT_API_KEY ?? "",
  cache: new MemoryCache(),
  cacheTtlMs: 30_000,
})

await valorant.content.getContents({ cache: { ttlMs: 300_000 } })
await valorant.content.getContents({ cache: false })
```

Implement `CacheAdapter` to connect Redis, Keyv, an LRU cache, or your application cache. Raw responses are cached and decoded separately for every caller.

## Validation and library integrations

Response declarations describe Riot's wire format but do not perform runtime validation. Supply a `decode` function when data crosses a trust boundary:

```ts
import { z } from "zod"

const Account = z.object({
  puuid: z.string(),
  gameName: z.string(),
  tagLine: z.string(),
})

const account = await valorant.account.getByRiotId("Name", "TAG", {
  decode: Account.parse,
})
```

Zod is only an example and is not a package dependency. A `TransportAdapter` can replace Fetch, while hooks integrate tracing, metrics, logging, or an external rate limiter:

```ts
const valorant = new ValorantApi({
  apiKey: process.env.RIOT_API_KEY ?? "",
  hooks: {
    onRequest: ({ endpoint, rateLimits }) => limiter.acquire(endpoint.id, rateLimits),
    onResponse: ({ endpoint, status, durationMs }) => metrics.observe(endpoint.id, status, durationMs),
  },
})
```

Hooks never receive authorization headers or tokens.

## Errors

```ts
import { RiotApiError } from "wrapper-valorant-api"

try {
  await valorant.match.getMatch("unknown")
} catch (error) {
  if (error instanceof RiotApiError) {
    console.error(error.status, error.retryAfterMs, error.rateLimit)
  }
}
```

The public error classes are `ValorantConfigurationError`, `RequestCancelledError`, `RequestTimeoutError`, `TransportError`, and `RiotApiError`.

## Routing

VAL endpoints use a platform route: `ap`, `br`, `eu`, `kr`, `latam`, or `na`. Account endpoints use a regional route: `americas`, `asia`, `europe`, or `esports`. The regional default is inferred from the default platform and can be overridden globally or per request.

## Security

Riot API keys are server-side secrets. Never bundle a key into browser, desktop, mobile, or other distributed client code. Keep `.env` files out of version control, use HTTPS, rotate leaked credentials, and use Riot Sign On access tokens only with the account `getMe` flow.

## Documentation

- [GitHub Wiki source](docs/wiki/Home.md)
- [Endpoint and rate-limit reference](docs/wiki/Endpoints.md)
- [Caching and integrations](docs/wiki/Caching-and-Integrations.md)
- [Migration from v2](docs/wiki/Migration-v2-to-v3.md)
- [Official Riot API reference](https://developer.riotgames.com/apis)
- [Official VALORANT developer documentation](https://developer.riotgames.com/docs/valorant)

## License

[MIT](License)
