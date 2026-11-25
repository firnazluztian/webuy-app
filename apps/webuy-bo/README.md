# `@webuy/bo`

WeBuy backoffice — **Vite** + React 19 + Tailwind 4.

## Overview

| Item | Value |
| --- | --- |
| Package | `@webuy/bo` |
| Dev URL | http://localhost:5175 |
| UI | `@kiichan/design-system` (pnpm catalog) |
| Theme | `@webuy/tailwind-config` |
| Lint | `@webuy/eslint-config/react` |

## Commands

From monorepo root:

```bash
pnpm dev:bo
pnpm turbo run lint test build --filter=@webuy/bo
```

From this package:

```bash
pnpm dev
pnpm lint
pnpm test
pnpm build
pnpm preview
```

## Notes

- Vite over Next: BO is mostly client-side admin UI ([ADR-0001](../../docs/adr/0001-monorepo-over-microfrontends.md)).
- Same kiichan version as the storefront via pnpm catalog ([ADR-0002](../../docs/adr/0002-shared-kiichan-catalog-pin.md)).
- `VITE_*` is public — never put secrets there. Builds run `scripts/check-public-env.mjs`.
- Follow root [AGENTS.md](../../AGENTS.md) and [README](../../README.md).
