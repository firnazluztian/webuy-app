# ADR-0003: Shared ESLint quality gates

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** WeBuy frontend

## Context

WeBuy ships a customer storefront and an internal backoffice from one monorepo. Without shared lint rules, apps drift on TypeScript strictness, React hooks discipline, and accidental `console` / debugger leftovers that reach production bundles.

Client env prefixes (`NEXT_PUBLIC_*`, `VITE_*`) are inherently public. Teams occasionally mis-name secrets as public variables; that must fail fast at build time, not in a security review after release.

## Decision

1. Publish a workspace package `@webuy/eslint-config` with flat configs:
   - `base` — TypeScript recommended, `no-console` error, no `any`, unused vars hygiene
   - `next` — storefront (`@webuy/web`)
   - `react` — backoffice (`@webuy/bo`)
2. Run ESLint via each app’s `lint` script and root `pnpm lint` (Turbo).
3. Run `scripts/check-public-env.mjs` before production builds to reject secret-like public env names.
4. Allow `console` only in tests and `scripts/` (ESLint overrides).

## Consequences

### Positive

- One lint contract for all contributors and agents
- Production builds refuse dangerous public env naming
- Fewer debug leftovers in client bundles

### Negative / trade-offs

- FlatCompat bridge for `eslint-config-next` until Next ships native flat presets everywhere
- Rare false positives on public env names require rename or an explicit team discussion (not a silent CI bypass)

## Alternatives considered

1. **App-local ESLint only** — faster to start, guaranteed drift. Rejected.
2. **eslint-plugin custom rule for secrets** — richer IDE feedback, more maintenance. Deferred; build script covers merge/deploy path.
