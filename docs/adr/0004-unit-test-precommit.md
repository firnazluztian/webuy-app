# ADR-0004: Unit tests on pre-commit

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** WeBuy frontend

## Context

Lint alone does not protect pricing, cart math, or UI contracts. Waiting solely for CI lets broken unit tests land on shared branches and burn review time. WeBuy already uses Vitest on the storefront and expects coverage to grow with domain modules.

## Decision

Use **Husky** + **lint-staged** on `pre-commit`:

1. `lint-staged` — ESLint fix on staged `ts/tsx/js/jsx/mjs` files
2. Full workspace unit suite — `pnpm test` (Turbo → packages that define `test`)

Developers must not use `--no-verify` except in documented emergencies, and must follow up with a green commit immediately.

CI (when added) remains the merge gate for lint + test + build. Pre-commit is the fast local filter.

## Consequences

### Positive

- Broken unit tests rarely reach remote `main`
- Shared habit for all contributors (humans and agents)
- Aligns with conventional “fix critical paths before push” practice

### Negative / trade-offs

- Pre-commit gets slower as the suite grows — mitigate later with Turbo `--filter` / affected tests, not by removing the hook
- BO currently has no `test` script; Turbo skips it until tests exist

## Alternatives considered

1. **CI-only tests** — insufficient for local discipline; rejected as sole gate.
2. **lint-staged runs vitest only on related files** — ideal later; phase-1 suite is small enough for full `pnpm test`.
