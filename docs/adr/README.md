# Architecture Decision Records (ADR)

Significant stack and product decisions for WeBuy live here. Read these before changing architecture, deploy topology, or quality gates.

## Format

Each ADR includes status, date, context, decision, consequences, and alternatives.

## Decision log

| ADR | Topic | Status |
| --- | --- | --- |
| [0001](./0001-monorepo-over-microfrontends.md) | Modular monolith monorepo over microfrontends | Accepted |
| [0002](./0002-shared-kiichan-catalog-pin.md) | Single kiichan design-system pin via pnpm catalog | Accepted |
| [0003](./0003-eslint-quality-gates.md) | Shared ESLint + public-env build guard | Accepted |
| [0004](./0004-unit-test-precommit.md) | Unit tests on pre-commit (Husky + lint-staged) | Accepted |

## Related

- Ops / Vercel release: [docs/ops/0001-vercel-deploy-and-release.md](../ops/0001-vercel-deploy-and-release.md)
- Contributor & agent contracts: [AGENTS.md](../../AGENTS.md), [CLOUD.md](../../CLOUD.md)
