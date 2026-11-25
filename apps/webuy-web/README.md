# `@webuy/web`

WeBuy storefront — Next.js 16 App Router.

## Phase 1

- Dev server: **http://localhost:3000**
- Single page: homepage with WeBuy brand + `@kiichan/design-system` `Button`
- Tailwind 3 via `@webuy/tailwind-config` (not Tailwind 4)

## Commands

From monorepo root:

```bash
pnpm dev:web
```

Or from this package:

```bash
pnpm dev
pnpm build
pnpm test
```

## Notes

- Future domains live under feature folders (`catalog`, `search`, `cart`, `checkout`, `account`, `content`).
- Campaign/content pages use Next SSG instead of a separate Astro app (see ADR-0001).
- Design system is pinned from GitHub — see root [README](../../README.md).
