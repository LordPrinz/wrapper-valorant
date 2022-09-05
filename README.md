# wrapper-valorant

A NodeJS wrapper for the VALORANT API.

[![NPM Version][npm-image]][npm-url]

## Installation

npm:

```bash
npm i wrapper-valorant
```

yarn:

```bash
yarn add wrapper-valorant
```

[**VAL-CONTENT-V1**](https://developer.riotgames.com/apis#val-content-v1)

| Method                                                                                               | Description                     |
| ---------------------------------------------------------------------------------------------------- | ------------------------------- |
| [getContents({locale, region?)}](https://developer.riotgames.com/apis#val-content-v1/GET_getContent) | Get content filtered by locale. |

---

[**VAL-MATCH-V1**](https://developer.riotgames.com/apis#val-match-v1)

| Method                                                                                                   | Description                             |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [match.getByMatchId({matchid, region?})](https://developer.riotgames.com/apis#val-match-v1/GET_getMatch) | Get match by id                         |
| [match.getByPuuid({puuid, region?)}](https://developer.riotgames.com/apis#val-match-v1/GET_getMatchlist) | Get matchlist for games played by puuid |
| [match.getByQueue({queue, region?})](https://developer.riotgames.com/apis#val-match-v1/GET_getRecent)    | Get recent matches                      |

---

[**VAL-RANKED-V1**](https://developer.riotgames.com/apis#val-ranked-v1)

| Method                                                                                                                        | Description                               |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [getLeaderboard({actId, region?, size?, startIndex?})](https://developer.riotgames.com/apis#val-ranked-v1/GET_getLeaderboard) | Get leaderboard for the competitive queue |

[**ACCOUNT-V1**](https://developer.riotgames.com/apis#account-v1)

| Method                                                                                                                 | Description                          |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [account.getByPuuid({puuid, region?})](https://developer.riotgames.com/apis#account-v1/GET_getByPuuid)                 | Get account by puuid                 |
| [account.getByName({gameName, tagLine, region?})](https://developer.riotgames.com/apis#account-v1/GET_getByRiotId)     | Get account by riot id               |
| [account.getMyAccount({authorization, region?})](https://developer.riotgames.com/apis#account-v1/GET_getByAccessToken) | Get account by authentication string |
| [account.getActiveShardByPuuid({puuid, region?})](https://developer.riotgames.com/apis#account-v1/GET_getActiveShard)  | Get active shard for a player        |

---

## Supported regions:

#### Valorant API:

| Region | Endpoint                |
| ------ | ----------------------- |
| APAC   | ap.api.riotgames.com    |
| BR     | br.api.riotgames.com    |
| EU     | eu.api.riotgames.com    |
| KR     | kr.api.riotgames.com    |
| LATAM  | latam.api.riotgames.com |
| NA     | na.api.riotgames.com    |

#### Account API:

| Region   | Endpoint                   |
| -------- | -------------------------- |
| ASIA     | asia.api.riotgames.com     |
| AMERICAS | americas.api.riotgames.com |
| EUROPE   | europe.api.riotgames.com   |

## Usage

#### Typescript:

```ts
import ValorantApi from "wrapper-valorant";

const APIKey = ""; // Your API Key

const ValApi = new ValorantApi(APIKey); // An API instance for Valorant query

// Example usage of the VAL-CONTENT-V1 API
ValApi.getContents({ locale: "en-US" }).then((data) => console.log(data));

// Production API Key

ValApi.match.getByPuuid({ puuid: "" }); // Your puuid

ValApi.match
	.getByQueue({ queue: "competetive" })
	.then((data) => console.log(data));
```

## Contact

- GitHub [LordPrinz](https://github.com/LordPrinz)
- Discord [<c2>Lord Prinz ™ 🔥#6396](https://discord.com/users/520676533279522817)

[npm-image]: https://img.shields.io/npm/v/wrapper-valorant-api.svg
[npm-url]: https://www.npmjs.com/package/wrapper-valorant-api
