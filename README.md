# WeBuy

Modern ecommerce platform with a customer **storefront** and internal **backoffice**, built as a pnpm + Turborepo monorepo. Optimized for performance, accessibility, consistent UI via the **kiichan design system**, and independent app releases.

## Tech Stack

| Category | Technology | Description | Why we use it |
| --- | --- | --- | --- |
| Monorepo | **pnpm** + **Turborepo** | Workspace apps/packages, filtered tasks, remote-friendly caching | One product, two deployables, shared tooling without microfrontend cost |
| Storefront | **Next.js 16 (App Router)**, **React 19** | SSR/SSG/ISR, Route Handlers, metadata | SEO for catalog/content, fast first paint, server-first data where it fits |
| Backoffice | **Vite**, **React 19** | Client-heavy admin SPA | Fast DX for internal tools; lighter than forcing admin into Next |
| Language | **TypeScript** | Strict typing across apps and packages | Safer refactors; clear contracts between UI, hooks, and API layers |
| UI library | **@kiichan/design-system** | External design system (GitHub tag / pnpm catalog) | One UI source of truth; multi-product DS stays out of this monorepo |
| Styling | **Tailwind CSS 4** + `@webuy/tailwind-config` | Utility CSS aligned to kiichan tokens | Predictable spacing/color; shared theme for web and BO |
| Client state | **Zustand** | Light global UI/session state | Avoid Redux boilerplate; keep server cache in TanStack Query |
| Data fetching | **TanStack Query** | Cache, revalidation, dedupe | Catalog/search/cart client needs without reinventing cache |
| Validation | **Zod** | Runtime schemas | Safe boundaries at API and form edges |
| Testing | **Vitest** + Testing Library | Unit tests | Guard UI contracts and domain logic before merge |
| Lint | **ESLint 9** (`@webuy/eslint-config`) | Shared flat configs, `no-console` | Keep debug noise and `any` out of production |
| CI / Deploy | **Vercel** (two projects) | Git-integrated preview + production | Independent domains/rollbacks; `turbo-ignore` skips unchanged apps |

## Architecture Decision Records (ADR)

Significant stack and product decisions live in [`docs/adr/`](./docs/adr/README.md). Start there before changing architecture.

| ADR | Topic |
| --- | --- |
| [0001](./docs/adr/0001-monorepo-over-microfrontends.md) | Modular monolith monorepo over microfrontends |
| [0002](./docs/adr/0002-shared-kiichan-catalog-pin.md) | Single kiichan design-system pin via pnpm catalog |
| [0003](./docs/adr/0003-eslint-quality-gates.md) | Shared ESLint + public-env build guard |
| [0004](./docs/adr/0004-unit-test-precommit.md) | Unit tests on pre-commit |

Ops (Vercel setup, selective builds, rollback): [`docs/ops/0001-vercel-deploy-and-release.md`](./docs/ops/0001-vercel-deploy-and-release.md).

Agent / contributor contracts: [`AGENTS.md`](./AGENTS.md), [`CLOUD.md`](./CLOUD.md).

## Apps & packages

| Package | Path | Role | Dev port |
| --- | --- | --- | --- |
| `@webuy/web` | [`apps/webuy-web`](./apps/webuy-web) | Customer storefront (Next.js) | 3000 |
| `@webuy/bo` | [`apps/webuy-bo`](./apps/webuy-bo) | Backoffice (Vite) | 5175 |
| `@webuy/tailwind-config` | [`packages/tailwind-config`](./packages/tailwind-config) | Shared Tailwind 4 theme | — |
| `@webuy/typescript-config` | [`packages/typescript-config`](./packages/typescript-config) | Shared TS bases | — |
| `@webuy/eslint-config` | [`packages/eslint-config`](./packages/eslint-config) | Shared ESLint flat configs | — |

## Folder structure (high level)

```plaintext
webuy-app/
├── apps/
│   ├── webuy-web/                 # Storefront — Next.js App Router
│   │   └── src/
│   │       ├── app/               # Routes, layouts, metadata
│   │       ├── components/        # Route-local / shared UI (grows into features/)
│   │       └── ...                # Future: features/{catalog,search,cart,checkout,account,content}
│   └── webuy-bo/                  # Backoffice — Vite + React
│       └── src/
│           ├── pages/             # Admin screens
│           └── ...
├── packages/
│   ├── eslint-config/
│   ├── tailwind-config/
│   └── typescript-config/
├── docs/
│   ├── adr/                       # Architecture decisions
│   ├── ops/                       # Deploy & release
│   └── reference/                 # Internal industry notes
├── scripts/
│   ├── check-public-env.mjs       # Fail build on secret-like public env
│   └── release.mjs                # Independent web@ / bo@ releases
├── AGENTS.md
├── CLOUD.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

Target storefront domain layout as features grow:

```plaintext
apps/webuy-web/src/
├── app/                 # Next.js routes only (composition)
├── features/            # Domain modules (UI + hooks + local utils)
│   ├── catalog/
│   ├── search/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   └── content/
├── shared/              # Cross-domain UI, hooks, utils
└── lib/                 # API client, env helpers
```

## Getting started

### 1. Prerequisites

- Node.js LTS
- pnpm via Corepack:

```bash
corepack enable
```

### 2. Install

```bash
pnpm install
```

Husky installs git hooks via the `prepare` script (lint-staged + unit tests on commit).

### 3. Environment

Copy examples and fill values per environment (ask the team lead for shared secrets — never commit real `.env` files):

```bash
cp apps/webuy-web/.env.example apps/webuy-web/.env.local
cp apps/webuy-bo/.env.example apps/webuy-bo/.env
```

`NEXT_PUBLIC_*` and `VITE_*` are **public**. Do not place secrets there. Production builds run `scripts/check-public-env.mjs` and fail on secret-like public names.

### 4. Develop

```bash
pnpm dev          # both apps
pnpm dev:web      # http://localhost:3000
pnpm dev:bo       # http://localhost:5175
```

## Design system

WeBuy uses **`@kiichan/design-system`**, pinned once for the whole workspace via the pnpm catalog ([ADR-0002](./docs/adr/0002-shared-kiichan-catalog-pin.md)):

```yaml
# pnpm-workspace.yaml
catalog:
  "@kiichan/design-system": "github:firnazluztian/my-design-system#v3.0.0"
```

Apps declare `"@kiichan/design-system": "catalog:"`.

**Bump (WeBuy only):** edit the catalog tag → `pnpm install` → commit `pnpm-workspace.yaml` + `pnpm-lock.yaml`.

Prefer kiichan components for all product UI unless a task explicitly opts out.

## Testing

```bash
pnpm test
```

Vitest runs via Turborepo for packages that define a `test` script. Pre-commit also runs the unit suite ([ADR-0004](./docs/adr/0004-unit-test-precommit.md)).

## Lint & typecheck

```bash
pnpm lint
pnpm typecheck
```

ESLint enforces TypeScript hygiene and **no `console`** in app source ([ADR-0003](./docs/adr/0003-eslint-quality-gates.md)).

## Build & production

```bash
pnpm build
```

Storefront production start (after build):

```bash
pnpm --filter @webuy/web start
```

Backoffice preview:

```bash
pnpm --filter @webuy/bo preview
```

## Deployment & release

Two **Vercel projects**, one Git repository, independent domains. Selective builds via `turbo-ignore`. Full walkthrough: [docs/ops/0001-vercel-deploy-and-release.md](./docs/ops/0001-vercel-deploy-and-release.md).

### Versioning

Independent SemVer per app — tags `web@x.y.z` / `bo@x.y.z` (not one monorepo product version).

- **MAJOR** — breaking changes
- **MINOR** — backward-compatible features
- **PATCH** — fixes and small improvements

On a clean `main`:

```bash
pnpm release:web:patch   # or :minor / :major
pnpm release:bo:patch    # or :minor / :major
```

Each script bumps the app `package.json`, prepends that app’s `CHANGELOG.md`, creates an annotated tag, and pushes (see `scripts/release.mjs`).

### Rollback

Use Vercel **Instant Rollback** on the affected project. Match deployment to tag via:

```bash
git show web@x.y.z --no-patch --format='%H %s'
```

## Git workflow & commits

### Branching

- `main` — production-ready default branch (Vercel production)
- Feature: `feat/<short-description>`
- Fix: `fix/<short-description>`
- Chore/docs: `chore/...`, `docs/...`

### Commit messages

Conventional Commits (English, present tense, one logical change):

```bash
feat: add cart summary on checkout
fix: correct storefront price rounding
refactor: extract catalog filters hook
docs: update release section in README
chore: bump kiichan catalog pin
test: cover home CTA button render
perf: defer below-fold homepage modules
```

### Pre-commit

Every commit runs:

1. `lint-staged` (ESLint `--fix` on staged JS/TS)
2. `pnpm test` (workspace unit tests)

Do not use `--no-verify` except emergencies; follow with a green commit.

## Contributing

1. Install Node LTS + enable Corepack; `pnpm install`.
2. Branch from updated `main`: `git checkout -b feat/your-feature`.
3. Implement with kiichan DS, feature folders, thin UI + hooks.
4. Quality gates:

```bash
pnpm lint
pnpm test
pnpm build
```

5. Commit with conventional messages; open a PR into `main` with scope, screenshots for UI, and migration notes if any.

## Additional references

- [AGENTS.md](./AGENTS.md) — engineering rules for humans and agents
- [CLOUD.md](./CLOUD.md) — cloud-agent / CI-oriented constraints
- [docs/adr/](./docs/adr/) — architecture decisions
- [docs/ops/0001-vercel-deploy-and-release.md](./docs/ops/0001-vercel-deploy-and-release.md) — deploy & release
