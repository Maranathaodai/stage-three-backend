# Mastra bundler: circular reexport / self-reference during bundle stage

Summary
-------

During remote deploys the Mastra deployer's bundler fails with errors like:

```
Failed during bundler bundle stage: "HttpTransport" cannot be exported from ".mastra/.build/@mastra-loggers-http.mjs" as it is a reexport that references itself.
```

Locally, running `npx mastra build` completes successfully and produces a `.mastra/output` build that runs. The failure only appears in the remote deployer/bundler used by the platform.

Repository
----------

Project: telex-ai-agent
Repo: https://github.com/Maranathaodai/stage-three-backend

Files we modified in-repo as mitigations
- `src/shims/@mastra-loggers-http.js` — CommonJS shim exporting a named `HttpTransport`.
- `shims/@mastra-loggers-http/*` (removed/iterated)
- `shims/@mastra-loggers/*`, `shims/@mastra-libsql/*` — similar local shims for other transitive packages.
- `package.json` — added `overrides` mapping `@mastra/loggers-http` -> `file:src/shims/@mastra-loggers-http.js` so remote `npm ci` will map the package to the local shim when lockfile / overrides are present.

Local reproduction steps
----------------------

1. Clone the repo.
2. Ensure node >=18.
3. Run `npx mastra build` in the repo root.
   - Locally this builds successfully and outputs `.mastra/output`.

Observed remote failure
-----------------------

- Remote deploy logs show the bundler failing during the 'bundle' stage with a circular dependency and a self-reexport error for `HttpTransport` (see log excerpt below).
- The remote `npm ci` step completes (installs packages) but the deployer's bundler/optimizer produces the failure.

Relevant log excerpt (remote deploy)
-----------------------------------

```
Analyzing dependencies...
Optimizing dependencies...
Bundling Mastra application
warn Circular dependency found:
    .mastra/.build/@mastra-loggers-http.mjs -> .mastra/.build/@mastra-loggers-http.mjs
error Failed during bundler bundle stage: "HttpTransport" cannot be exported from ".mastra/.build/@mastra-loggers-http.mjs" as it is a reexport that references itself.
```

What we've tried
----------------

1. Add local shim modules that export the named symbols the bundler expects (e.g., `HttpTransport`, `LibSQLStore`, `LibSQLVector`) and map `@mastra/*` to those local shims with `overrides`/`file:` in `package.json`.
2. Iterated module formats for the shim (ESM vs CommonJS, explicit `exports` map) to avoid reexport cycles.
3. Verified `npx mastra build` locally (succeeds) and `npm run build` (tsc) locally (succeeds).

Why we think this is a Mastra/bundler issue
-------------------------------------------

- Local Mastra CLI bundling and the remote deploy bundler behave differently; the same source and shims produce a successful local build but a failing remote build.
- The remote error explicitly references a reexport that references itself — this can be caused by the bundler converting CommonJS -> ESM reexports or by an ESM `export ... from '...'` that resolves back to itself through package-level `exports` or dual-package entrypoints.

Suggested next actions for maintainers
------------------------------------

1. Confirm the Mastra deployer/bundler version and match locally (we ran Mastra CLI v0.17.7 locally). If there is a different deployer runtime version on the platform, that could explain the divergence.
2. Provide guidance or a recommended packaging pattern for `@mastra/*` packages to avoid self-reexport cycles when consumed by the Mastra bundler. For example, avoid dual ESM/CJS entries that reexport named bindings in ways that can form cycles.
3. If the deployer uses an internal bundler transform that creates reexports, consider a fix to detect and inline/export original bindings rather than creating reexports that point back to the same module.

Minimal workaround we used (repo-side)
-------------------------------------

- Provide local shim files that directly export the named symbols (CommonJS-only entry) and use `overrides`/`file:` to point the package to the local file so `npm ci` resolves it.
- This got the local Mastra CLI to succeed but the remote deployer still raised the same circular reexport in its bundle stage.

Attachments & metadata
----------------------

- Local Mastra CLI build success output is available in the repository build logs (run `npx mastra build`).
- Remote deploy logs include the circular reexport failure (see snippet above).

If you want, I can open this issue on your behalf in the Mastra repo (I will need permission or a link). Alternatively, post this file's contents to the issue tracker and we can iterate on a quick fix or provide further information from the remote deploy environment.

-- End of report
