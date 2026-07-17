# Cancellation and Errors

## Caller cancellation

```ts
const controller = new AbortController()
const pending = api.match.getMatch("match-id", { signal: controller.signal })

controller.abort("request no longer needed")

try {
  await pending
} catch (error) {
  if (error instanceof RequestCancelledError) {
    console.log(error.reason)
  }
}
```

The caller signal is combined with the configured timeout. Caller cancellation has precedence when both signals are aborted.

## Errors

| Error | Meaning |
| --- | --- |
| `ValorantConfigurationError` | Invalid client or request configuration |
| `RequestCancelledError` | The caller's AbortSignal cancelled the request |
| `RequestTimeoutError` | The configured timeout elapsed |
| `TransportError` | A transport rejected with a non-Error value |
| `RiotApiError` | Riot returned a non-2xx response |

`RiotApiError` provides `status`, `statusText`, `url`, `body`, `retryAfterMs`, and parsed `rateLimit` response headers. Authorization headers are never added to the error.

```ts
try {
  await api.ranked.getLeaderboard("act-id")
} catch (error) {
  if (error instanceof RiotApiError && error.status === 429) {
    scheduleRetry(error.retryAfterMs)
  }
}
```

The wrapper reports rate-limit information but deliberately does not retry automatically. Automatic retries can amplify traffic and require application-specific idempotency, queueing, and backoff decisions.
