# Architecture

The client has four deliberate seams:

1. `ValorantApi` composes endpoint families and their default routes.
2. Endpoint families translate typed arguments into paths and query strings.
3. The request executor owns authentication, cancellation, timeout, caching, hooks, decoding, and normalized errors.
4. The transport adapter owns HTTP I/O.

This keeps endpoint methods small while making cross-cutting behavior consistent. Platform and regional routes are separate types so VAL endpoints cannot accidentally receive an Account regional value.

## Dependency policy

The published package has zero runtime dependencies. Native Fetch and Abort APIs provide the default transport and cancellation primitives. Cache engines, schema validators, observability stacks, and rate limiters remain application choices connected through small interfaces.

## Response contracts

DTOs mirror Riot's JSON wire names, including snake_case fields where the API uses them. They are readonly compile-time declarations. Runtime validation is opt-in through a decoder because forcing a schema dependency would increase package weight and constrain consumers.

## Distribution

The build emits:

- `dist/index.mjs` and `dist/index.d.mts` for ESM
- `dist/index.cjs` and `dist/index.d.cts` for CommonJS
- source maps for runtime and declarations

Package exports provide matching type conditions for both module systems. CI validates the declarations with `publint` and Are the Types Wrong, then installs the packed tarball into a clean temporary consumer and executes ESM, CommonJS, and TypeScript examples.
