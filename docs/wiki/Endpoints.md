# Endpoint Reference

All methods return promises and accept an optional final options object. Path parameters are URI-encoded by the client.

## VAL Match V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `match.getMatch(matchId)` | `/val/match/v1/matches/{matchId}` | 800 / 10 seconds |
| `match.getMatchlist(puuid)` | `/val/match/v1/matchlists/by-puuid/{puuid}` | 800 / 10 seconds |
| `match.getRecent(queue)` | `/val/match/v1/recent-matches/by-queue/{queue}` | 60 / minute |

## VAL Content V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `content.getContents({ locale })` | `/val/content/v1/contents` | 250 / 10 seconds |

## Account V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `account.getByRiotId(gameName, tagLine)` | `/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}` | 1,000 / minute |
| `account.getByPuuid(puuid)` | `/riot/account/v1/accounts/by-puuid/{puuid}` | 1,000 / minute |
| `account.getMe(accessToken)` | `/riot/account/v1/accounts/me` | 20,000 / 10 seconds; 1,200,000 / 10 minutes |
| `account.getActiveShard(puuid, game)` | `/riot/account/v1/active-shards/by-game/{game}/by-puuid/{puuid}` | 20,000 / 10 seconds; 1,200,000 / 10 minutes |

Use `{ region: "esports" }` with `getByRiotId` or `getByPuuid` for the esports route and its supplied high-capacity limits. `getMe` uses `Authorization: Bearer`; other methods use `X-Riot-Token`.

## VAL Ranked V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `ranked.getLeaderboard(actId, { size, startIndex })` | `/val/ranked/v1/leaderboards/by-act/{actId}` | 10 / 10 seconds |

`size` must be an integer from 1 to 200. `startIndex` must be a non-negative integer.

## VAL Status V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `status.getPlatformData()` | `/val/status/v1/platform-data` | 20,000 / 10 seconds; 1,200,000 / 10 minutes |

## Console Match V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `consoleMatch.getMatch(matchId)` | `/val/match/console/v1/matches/{matchId}` | 20,000 / 10 seconds; 1,200,000 / 10 minutes |
| `consoleMatch.getMatchlist(puuid)` | `/val/match/console/v1/matchlists/by-puuid/{puuid}` | 20,000 / 10 seconds; 1,200,000 / 10 minutes |
| `consoleMatch.getRecent(queue)` | `/val/match/console/v1/recent-matches/by-queue/{queue}` | 20,000 / 10 seconds; 1,200,000 / 10 minutes |

## Console Ranked V1

| Method | Path | Supplied method limit |
| --- | --- | --- |
| `consoleRanked.getLeaderboard(actId, { size, startIndex })` | `/val/console/ranked/v1/leaderboards/by-act/{actId}` | Not specified in the supplied report |

The immutable `ENDPOINTS` export contains the same metadata for rate-limit integrations. Riot application limits and method limits can differ by key and are also returned in response headers; inspect `RiotApiError.rateLimit` and your response hooks.

Official reference: [Riot API portal](https://developer.riotgames.com/apis).
