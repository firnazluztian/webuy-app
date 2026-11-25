# WeBuy

Ecommerce product monorepo (storefront + backoffice) for SkinSeoul-scale interview prep. Professional topology, phase-1 skeleton only.

## Apps

| Package | Path | Stack | Port | Phase 1 surface |
| --- | --- | --- | --- | --- |
| `@webuy/web` | [`apps/webuy-web`](apps/webuy-web) | Next.js 16, React 19, Tailwind 3 | **3000** | Homepage + kiichan Button |
| `@webuy/bo` | [`apps/webuy-bo`](apps/webuy-bo) | Vite, React 19, Tailwind 3 | **5175** | Login page + kiichan Button |

## Shared packages

| Package | Path | Role |
| --- | --- | --- |
| `@webuy/tailwind-config` | [`packages/tailwind-config`](packages/tailwind-config) | Kiichan-aligned Tailwind 3 preset |
| `@webuy/typescript-config` | [`packages/typescript-config`](packages/typescript-config) | Shared TS bases |

## Design system

[`@kiichan/design-system`](https://github.com/firnazluztian/my-design-system) is **external** (GitHub tag pin). It is not a workspace package — it may serve products beyond WeBuy.

```json
"@kiichan/design-system": "github:firnazluztian/my-design-system#v2.4.11"
```

Bump: edit the tag in each app `package.json` → `pnpm install` → commit lockfile.

## Commands

```bash
pnpm install
pnpm dev          # both apps via Turborepo
pnpm dev:web      # storefront :3000
pnpm dev:bo       # backoffice :5175
pnpm build
pnpm test
```

## Architecture decisions

- [ADR-0001: Monorepo over microfrontends](docs/adr/0001-monorepo-over-microfrontends.md) — **Accepted**
- [SkinSeoul reference notes](docs/reference/0001-skinseoul.md)

## Stack

pnpm · Turborepo · Next.js 16 · Vite · React 19 · TypeScript · Tailwind 3 · Zod · Zustand · TanStack Query · Vitest · `@kiichan/design-system`
