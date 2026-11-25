# ADR-0001: Modular monolith monorepo over microfrontends

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** WeBuy frontend

## Context

WeBuy is a greenfield ecommerce product (storefront + backoffice) used as a SkinSeoul-scale interview preparation codebase. SkinSeoul today is accidentally multi-runtime (Next.js storefront, Astro campaigns/blog, Elementor quiz, React Native). We need a deliberate frontend topology for a small team building for scale without paying microfrontend costs early.

## Decision

Use a **pnpm + Turborepo product monorepo** with:

- `apps/webuy-web` — Next.js 16 App Router storefront (SSG for catalog/campaign content instead of a separate Astro app)
- `apps/webuy-bo` — Vite + React backoffice (client-heavy admin)
- `packages/*` — shared product packages (Tailwind preset, TS config; later API client / zod schemas)

Treat the UI library as **out of band**: `@kiichan/design-system` is consumed via GitHub release tags, not as a workspace package. Cross-product design systems must not live inside a single product monorepo. Within WeBuy, both apps share one pin via the pnpm catalog (see [ADR-0002](./0002-shared-kiichan-catalog-pin.md)).

**Reject microfrontends** for WeBuy’s current team size and deploy model.

## Consequences

### Positive

- One React version, one design-system pin, shared tokens via `packages/tailwind-config`
- Domain folders can grow inside Next (`catalog`, `search`, `cart`, `checkout`, `account`, `content`) without cross-app bundler coordination
- Interview narrative matches SkinSeoul’s real constraint: a small remote FE team does not benefit from independent deployables yet
- Campaign/blog SSG stays in Next — collapses SkinSeoul’s Astro split without a second frontend runtime

### Negative / trade-offs

- Storefront and BO share a repo; release cadence is coordinated unless we add path-filtered CI later
- Design-system iteration requires tag bump + lockfile update (by design for multi-product ownership)
- If team count and deploy contention explode, we may revisit independent apps — not MFEs by default

## Alternatives considered

1. **Microfrontends (Module Federation / separate deployable shells)** — high coordination cost, duplicate React, version drift, worse mobile JS weight. SkinSeoul’s public pages already show the cost of multi-runtime experiences. Rejected until multiple autonomous teams contend on one release train.
2. **Single Next app for web + BO** — possible, but BO is almost entirely client-side and benefits from Vite’s lighter admin DX. Separate apps in one monorepo is enough separation.
3. **Polyrepo (web, bo, packages each own git root)** — more release friction for a single product team; deferred.

## References

- [docs/reference/0001-skinseoul.md](../reference/0001-skinseoul.md)
