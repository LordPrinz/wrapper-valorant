# Migration from v2 to v3

Version 3 replaces handler-shaped arguments with endpoint-family methods, modernizes the runtime, and intentionally removes the old Axios dependency.

## Runtime and constructor

```ts
// v2
const api = new ValorantApi(apiKey)

// v3
const api = new ValorantApi({ apiKey, defaultPlatform: "eu" })
```

Node.js 22 or newer is required.

## Method mapping

| v2 | v3 |
| --- | --- |
| `api.getContents({ locale, region })` | `api.content.getContents({ locale, platform })` |
| `api.getStatus({ region })` | `api.status.getPlatformData({ platform })` |
| `api.getLeaderboard({ actId, ... })` | `api.ranked.getLeaderboard(actId, options)` |
| `api.match.getByMatchId({ matchId })` | `api.match.getMatch(matchId)` |
| `api.match.getByPuuid({ puuid })` | `api.match.getMatchlist(puuid)` |
| `api.match.getByQueue({ queue })` | `api.match.getRecent(queue)` |
| `api.account.getByName({ gameName, tagLine })` | `api.account.getByRiotId(gameName, tagLine)` |
| `api.account.getByPuuid({ puuid })` | `api.account.getByPuuid(puuid)` |
| `api.account.getMyAccount({ authorization })` | `api.account.getMe(accessToken)` |
| `api.account.getActiveShard({ puuid })` | `api.account.getActiveShard(puuid)` |

## New endpoint families

Version 3 adds `consoleMatch`, `consoleRanked`, and the complete status family requested in the v3 report.

## Error handling

Generic request failures are replaced by exported typed errors. Update error branches to use `instanceof RiotApiError`, `RequestCancelledError`, or `RequestTimeoutError`.

## Caching and validation

Caching is disabled by default. Configure a `CacheAdapter` and positive TTL to enable it. TypeScript response declarations do not validate network data at runtime; supply a `decode` function where validation is required.
