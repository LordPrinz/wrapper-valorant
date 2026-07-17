# Security

## Keep API keys on the server

Never embed a Riot API key in browser bundles, desktop applications, mobile applications, downloadable binaries, or public repositories. A custom browser-compatible transport does not make client-side key usage safe.

- Load keys from server-side environment variables or a secret manager.
- Keep `.env` and `.env.*` ignored; commit only `.env.example`.
- Rotate any key that appears in source, logs, screenshots, issue reports, or build artifacts.
- Use HTTPS only.
- Do not attach request headers or access tokens to telemetry.

The package sends Riot API keys in `X-Riot-Token`, RSO access tokens in `Authorization: Bearer`, and never includes either value in URLs, cache keys, hook contexts, or typed errors.

## Riot Sign On

`account.getMe(accessToken)` accepts a Riot Sign On access token and bypasses caching. OAuth acquisition, refresh, scopes, and token storage belong to the host application.

Read Riot's current policies before production use: [VALORANT developer documentation](https://developer.riotgames.com/docs/valorant).
