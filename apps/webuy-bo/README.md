# `@webuy/bo`

WeBuy backoffice — Vite + React 19.

## Phase 1

- Dev server: **http://localhost:5175**
- Single page: login shell with `@kiichan/design-system` `Button` (no real auth)
- Tailwind 4 via `@webuy/tailwind-config` (kiichan v3 tokens + General Sans)

## Commands

From monorepo root:

```bash
pnpm dev:bo
```

Or from this package:

```bash
pnpm dev
pnpm build
```

## Notes

- Chosen Vite over Next because BO is mostly client-side admin UI.
- Shares the same kiichan design-system version as the storefront via pnpm catalog ([ADR-0002](../../docs/adr/0002-shared-kiichan-catalog-pin.md)).
- Bump process: root [README](../../README.md).
