# Caching and Integrations

## Built-in memory cache

```ts
const api = new ValorantApi({
  apiKey,
  cache: new MemoryCache(),
  cacheTtlMs: 60_000,
})
```

The built-in cache is process-local and suited to scripts, bots, and short-lived services. It has no background timer; expired entries are removed on access.

## Custom cache

```ts
const redisCache: CacheAdapter = {
  async get(key) {
    const json = await redis.get(key)
    return json === null ? undefined : JSON.parse(json)
  },
  async set(key, value, ttlMs) {
    await redis.set(key, JSON.stringify(value), { PX: ttlMs })
  },
  async delete(key) {
    await redis.del(key)
  },
}
```

Cache keys are normalized request URLs. Only successful raw response bodies are stored. Access tokens, API keys, and authorization headers are never part of a key. Endpoints marked non-cacheable ignore cache policy.

## Custom transport

Implement `TransportAdapter` to integrate a proxy, a test double, custom TLS policy, tracing, or another HTTP stack:

```ts
const transport: TransportAdapter = {
  async send(request) {
    const response = await customHttp(request)
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.body,
    }
  },
}
```

The adapter must honor `request.signal` for cancellation and timeout behavior.

## Hooks and rate limiters

`onRequest`, `onResponse`, `onCacheHit`, and `onError` may be synchronous or asynchronous. The context contains endpoint metadata, URL, rate limits, status, and duration as appropriate. It never contains credentials.

```ts
const hooks: ClientHooks = {
  onRequest: ({ endpoint, rateLimits }) => limiter.acquire(endpoint.id, rateLimits),
  onResponse: ({ endpoint, status, durationMs }) => telemetry.record({
    operation: endpoint.id,
    status,
    durationMs,
  }),
}
```

Because hooks are awaited, an external limiter can delay dispatch without replacing the transport.
