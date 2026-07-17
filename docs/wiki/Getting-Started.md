# Getting Started

## Install

```bash
npm install wrapper-valorant-api
```

Node.js 22 or newer is supported.

## Configure

Store the Riot API key in an untracked environment file:

```dotenv
RIOT_API_KEY=RGAPI-your-development-key
```

```ts
import { ValorantApi } from "wrapper-valorant-api"

const api = new ValorantApi({
  apiKey: process.env.RIOT_API_KEY ?? "",
  defaultPlatform: "eu",
  timeoutMs: 10_000,
})
```

An empty key throws `ValorantConfigurationError` immediately.

## Make requests

```ts
const content = await api.content.getContents({ locale: "en-US" })
const account = await api.account.getByRiotId("Game Name", "TAG")
const matches = await api.match.getMatchlist(account.puuid)
```

Override routing, caching, cancellation, or decoding per request:

```ts
const controller = new AbortController()

const account = await api.account.getByPuuid("puuid", {
  region: "americas",
  cache: { ttlMs: 60_000 },
  signal: controller.signal,
})
```

See [Configuration and Routing](Configuration-and-Routing.md) for the full constructor contract.
