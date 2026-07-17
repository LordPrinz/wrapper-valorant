# Configuration and Routing

## Constructor

```ts
const api = new ValorantApi({
  apiKey: "RGAPI-...",
  defaultPlatform: "eu",
  defaultRegion: "europe",
  timeoutMs: 10_000,
  cache: customCache,
  cacheTtlMs: 30_000,
  transport: customTransport,
  hooks,
})
```

Only `apiKey` is required. The default platform is `eu`. If `defaultRegion` is absent, it is inferred as follows:

| Platform route | Regional route |
| --- | --- |
| `na`, `br`, `latam` | `americas` |
| `ap`, `kr` | `asia` |
| `eu` | `europe` |

Platform routes are `ap`, `br`, `eu`, `kr`, `latam`, and `na`. Account regional routes are `americas`, `asia`, `europe`, and `esports`.

## Per-request overrides

VAL endpoint options use `platform`; Account endpoint options use `region`:

```ts
await api.match.getRecent("competitive", { platform: "na" })
await api.account.getByPuuid("puuid", { region: "americas" })
```

## Runtime decoding

Generic response types are compile-time declarations. For runtime guarantees, pass a schema parser as `decode`:

```ts
const value = await api.status.getPlatformData({
  decode: PlatformDataSchema.parse,
})
```

The decoder receives `unknown` and determines the returned type. This design integrates with any schema library without adding it as a dependency.
