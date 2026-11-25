# ADR-0002: Single kiichan design-system version via pnpm catalog

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** WeBuy frontend

## Context

`@kiichan/design-system` is an **external**, multi-product UI library (GitHub release tags). It must not live inside the WeBuy monorepo (see ADR-0001).

WeBuy has two apps that both consume kiichan:

- `@webuy/web` (storefront)
- `@webuy/bo` (backoffice)

Other products outside this monorepo may pin **different** kiichan versions on their own schedule. Inside WeBuy, FO and BO should stay on the **same** design-system version so tokens, Button API, and Tailwind content stay aligned — staggered DS upgrades between web and bo create avoidable UI drift for one product team.

## Decision

Pin `@kiichan/design-system` once in the monorepo **pnpm catalog**, and have both apps reference `catalog:`:

```yaml
# pnpm-workspace.yaml
catalog:
  "@kiichan/design-system": "github:firnazluztian/my-design-system#v3.0.0"
```

```json
// apps/*/package.json
"@kiichan/design-system": "catalog:"
```

**Bump process (WeBuy):** edit the tag in `pnpm-workspace.yaml` → `pnpm install` → commit `pnpm-workspace.yaml` + `pnpm-lock.yaml`.

**Out of scope:** other repos (Vinove, future products) keep their own pins / catalogs. Catalog scope is this workspace only.

## Consequences

### Positive

- One source of truth for the WeBuy kiichan version
- Impossible for web and bo to silently diverge on DS tag
- Still external SemVer/tag model — no workspace coupling to the DS git repo

### Negative / trade-offs

- Temporary staggered upgrades (web on new major, bo lagging) require an explicit override or temporary exit from `catalog:` — do that only for short migrations, then reunify
- Catalog does not publish anything; external consumers are unaffected

## Alternatives considered

1. **Duplicate GitHub pins in each app `package.json`** — flexible, but easy to drift; rejected for WeBuy’s single-product cadence.
2. **`@webuy/ui` wrapper package** that re-exports kiichan — useful later for product-specific composition; overkill for phase 1 when the only need is a shared version pin.
3. **Absorb kiichan into `packages/`** — rejected in ADR-0001 (multi-product ownership).

## References

- [ADR-0001: Monorepo over microfrontends](./0001-monorepo-over-microfrontends.md)
- [pnpm catalogs](https://pnpm.io/catalogs)
- Root [README](../../README.md) — bump instructions
