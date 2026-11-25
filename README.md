# WeBuy

Ecommerce product monorepo (storefront + backoffice) for SkinSeoul-scale interview prep. Professional topology, phase-1 skeleton only.

## Apps

| Package | Path | Stack | Port | Phase 1 surface |
| --- | --- | --- | --- | --- |
| `@webuy/web` | [`apps/webuy-web`](apps/webuy-web) | Next.js 16, React 19, Tailwind 4 | **3000** | Homepage + kiichan Button |
| `@webuy/bo` | [`apps/webuy-bo`](apps/webuy-bo) | Vite, React 19, Tailwind 4 | **5175** | Login page + kiichan Button |

## Shared packages

| Package | Path | Role |
| --- | --- | --- |
| `@webuy/tailwind-config` | [`packages/tailwind-config`](packages/tailwind-config) | Kiichan v3 Tailwind 4 `@theme` + General Sans |
| `@webuy/typescript-config` | [`packages/typescript-config`](packages/typescript-config) | Shared TS bases |

## Design system

[`@kiichan/design-system`](https://github.com/firnazluztian/my-design-system) is **external** (GitHub tag). It is not a workspace package — other products may pin different versions.

Inside WeBuy, **web and bo share one version** via the pnpm catalog in [`pnpm-workspace.yaml`](pnpm-workspace.yaml):

```yaml
catalog:
  "@kiichan/design-system": "github:firnazluztian/my-design-system#v3.0.0"
```

Apps declare `"@kiichan/design-system": "catalog:"`.

Bump (WeBuy only): edit the catalog tag → `pnpm install` → commit `pnpm-workspace.yaml` + `pnpm-lock.yaml`.

See [ADR-0002](docs/adr/0002-shared-kiichan-catalog-pin.md).

## Commands

```bash
pnpm install
pnpm dev          # both apps via Turborepo
pnpm dev:web      # storefront :3000
pnpm dev:bo       # backoffice :5175
pnpm build
pnpm test
```

## Deploy & release (Vercel)

Two Vercel projects, same Git repo, independent domains. Selective builds via `turbo-ignore`. Independent tags `web@x.y.z` / `bo@x.y.z` (not one monorepo version).

```bash
pnpm release:web:patch|minor|major   # on clean main
pnpm release:bo:patch|minor|major
```

Full step-by-step (dashboard setup, rollback, what triggers which deploy): [docs/ops/0001-vercel-deploy-and-release.md](docs/ops/0001-vercel-deploy-and-release.md).

## Architecture decisions

- [ADR-0001: Monorepo over microfrontends](docs/adr/0001-monorepo-over-microfrontends.md) — **Accepted**
- [ADR-0002: Shared kiichan catalog pin](docs/adr/0002-shared-kiichan-catalog-pin.md) — **Accepted**
- [SkinSeoul reference notes](docs/reference/0001-skinseoul.md)

## Stack

pnpm · Turborepo · Next.js 16 · Vite · React 19 · TypeScript · Tailwind 4 · Zod · Zustand · TanStack Query · Vitest · `@kiichan/design-system` v3
