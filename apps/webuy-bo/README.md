# `@webuy/bo`

WeBuy backoffice — Vite + React 19.

## Phase 1

- Dev server: **http://localhost:5175**
- Single page: login shell with `@kiichan/design-system` `Button` (no real auth)
- Tailwind 3 via `@webuy/tailwind-config`

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
- Shares the same kiichan design-system pin as the storefront.
- Design system bump process: root [README](../../README.md).
