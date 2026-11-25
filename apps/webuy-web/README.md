# `@webuy/web`

WeBuy customer storefront — **Next.js 16** App Router, React 19, Tailwind 4, Vitest.

## Overview

| Item | Value |
| --- | --- |
| Package | `@webuy/web` |
| Dev URL | http://localhost:3000 |
| UI | `@kiichan/design-system` (pnpm catalog) |
| Theme | `@webuy/tailwind-config` |
| Lint | `@webuy/eslint-config` + `eslint-config-next` |

## Commands

From monorepo root:

```bash
pnpm dev:web
pnpm turbo run lint test build --filter=@webuy/web
```

From this package:

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm start
```

## Structure (current → target)

```plaintext
src/
├── app/                 # Routes, layouts, globals
├── components/          # Early shared UI (migrate into features/ as domains grow)
└── ...                  # Target: features/{catalog,search,cart,checkout,account,content}
```

## Notes

- Prefer kiichan primitives; keep UI thin and logic in hooks.
- Design-system version is owned by the monorepo catalog — see root [README](../../README.md) and [ADR-0002](../../docs/adr/0002-shared-kiichan-catalog-pin.md).
- Public env: `NEXT_PUBLIC_*` only for truly public values. Builds run `scripts/check-public-env.mjs`.
- Agent notes: [AGENTS.md](./AGENTS.md) + root [AGENTS.md](../../AGENTS.md).
