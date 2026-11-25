# ADR-0001: Modular monolith monorepo over microfrontends

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** WeBuy frontend

## Context

WeBuy is a greenfield ecommerce product with two surfaces: a customer storefront and an internal backoffice. We need a frontend topology that a small FE team can ship and operate without paying microfrontend coordination costs early, while still allowing independent deployables and a shared design system.

## Decision

Use a **pnpm + Turborepo product monorepo** with:

- `apps/webuy-web` — Next.js 16 App Router storefront (SSG/SSR for catalog and content instead of a separate static-site runtime)
- `apps/webuy-bo` — Vite + React backoffice (client-heavy admin)
- `packages/*` — shared product packages (Tailwind preset, TS config, ESLint config; later API client / Zod schemas)

Treat the UI library as **out of band**: `@kiichan/design-system` is consumed via GitHub release tags, not as a workspace package. Cross-product design systems must not live inside a single product monorepo. Within WeBuy, both apps share one pin via the pnpm catalog (see [ADR-0002](./0002-shared-kiichan-catalog-pin.md)).

**Reject microfrontends** for WeBuy’s current team size and deploy model.

## Consequences

### Positive

- One React version, one design-system pin, shared tokens via `packages/tailwind-config`
- Domain folders can grow inside Next (`catalog`, `search`, `cart`, `checkout`, `account`, `content`) without cross-app bundler coordination
- Campaign/content SSG stays in Next — one storefront runtime for SEO pages and commerce UI
- Independent Vercel projects + `web@` / `bo@` tags keep deploy/rollback per app

### Negative / trade-offs

- Storefront and BO share a repo; release cadence is coordinated at the Git level even when Vercel builds are selective
- Design-system iteration requires tag bump + lockfile update (by design for multi-product ownership)
- If team count and deploy contention explode, we may revisit independent apps — not MFEs by default

## Alternatives considered

1. **Microfrontends (Module Federation / separate deployable shells)** — high coordination cost, duplicate React, version drift, worse mobile JS weight. Rejected until multiple autonomous teams contend on one release train.
2. **Single Next app for web + BO** — possible, but BO is almost entirely client-side and benefits from Vite’s lighter admin DX. Separate apps in one monorepo is enough separation.
3. **Polyrepo (web, bo, packages each own git root)** — more release friction for a single product team; deferred.

## References

- [ADR-0002: Shared kiichan catalog pin](./0002-shared-kiichan-catalog-pin.md)
- [docs/ops/0001-vercel-deploy-and-release.md](../ops/0001-vercel-deploy-and-release.md)
