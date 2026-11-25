# WeBuy — Agent & contributor instructions

These rules apply to **every engineer and coding agent** working in this monorepo.
Read this file before changing product code. Prefer searching the codebase and `docs/` over guessing.

## Product intent

WeBuy is a **production ecommerce platform**: customer storefront (`@webuy/web`) and internal backoffice (`@webuy/bo`).

Optimize for:

- Mobile-first storefront performance and clear purchase paths
- Consistent UI via the design system
- Maintainable feature modules that a small FE team can own
- Safe defaults around secrets, lint, tests, and production builds

Do **not** describe this repo as a demo, sample, or interview exercise in READMEs, UI copy, commits, or PR descriptions. Write as if shipping a real product.

Competitive / industry notes (when relevant): `docs/reference/`. Do not copy that framing into user-facing docs.

## Clarify before building

If the task is ambiguous, **interview the requester** until scope is clear:

1. Which app(s)? (`web`, `bo`, shared package)
2. User-visible outcome vs internal refactor
3. Constraints (design-system only, no new deps, no build, etc.)
4. Done definition (UI, tests, docs)

If the answer is already in the repo or `docs/`, use that — do not re-ask. If still unclear after a short search, ask.

## Design system (non-negotiable default)

- Use **`@kiichan/design-system`** for UI primitives and patterns unless the requester explicitly says otherwise.
- Do not reinvent Button, Input, Modal, etc. when kiichan already covers the need — no hand-rolled `<button>` / `<input>` for the same job unless told not to use the DS.
- **Never** pass `size` or `rounded` on DS components unless the requester explicitly asks — omit them and use design-system defaults.
- Tokens / Tailwind theme live in `@webuy/tailwind-config` — keep them aligned with the catalog pin ([ADR-0002](docs/adr/0002-shared-kiichan-catalog-pin.md)).
- Both apps share **one** kiichan version via the pnpm catalog. Bump only in `pnpm-workspace.yaml`, then `pnpm install`.

## Engineering principles

- **Start simple.** Ship the smallest correct design. Add abstraction only when duplication or change pressure is real.
- **Think outside the box** when a simpler topology beats a fashionable pattern (composition over new packages, server data over client caches when enough, etc.).
- **Separation of concerns.** Prefer `UI components` + `hooks` / services. Keep rendering thin; put data fetching, derived state, and side effects in hooks or shared modules.
- **Feature folder shape:** `features/<domain>/index.tsx` (UI) + `hooks/` + optional `types.ts` / `schema.ts` / `constants.ts` + `components/<name>/index.tsx` (nested UI with its own `hooks/` when needed).
- **Named exports only** in features/components (`export const Checkout`). Default exports are reserved for Next.js `app/` routes.
- **File size:** max **500** lines per file (ESLint `max-lines`).
- **Clean code.** Readable names, shallow nesting, no clever one-liners. A senior should understand a file in under 30 seconds.
- **Feature-based layout** as domains grow: `catalog`, `search`, `cart`, `checkout`, `account`, `content` (web); admin domains under `bo`.
- **Strict TypeScript.** Avoid `any`. Prefer interfaces for models; types for unions/fns.
- **No unnecessary memoization.** Follow React Compiler–friendly patterns; add `useMemo` / `useCallback` only when justified.
- **Handle failure modes.** Loading, empty, and error states are part of the feature — not afterthoughts.

## Quality gates (always)

Unless the requester explicitly waives a gate:

1. **Lint** must pass (`pnpm lint`)
2. **Unit tests** must pass (`pnpm test`)
3. **Production build** must pass (`pnpm build`)

Do not introduce `console.log` / `console.debug` / `console.info` in app code. Prefer structured logging only where an approved logger exists; otherwise omit. ESLint enforces `no-console`.

Do not weaken CI, husky hooks, `turbo-ignore`, or release tagging to “make it green.”

## Secrets & public env (critical)

- **Never** put secrets in client bundles.
- Treat `NEXT_PUBLIC_*` and `VITE_*` as **public**. Anyone can read them from the browser.
- Forbidden patterns on public prefixes (examples): `SECRET`, `PRIVATE_KEY`, `API_KEY` that authorizes privileged actions, DB URLs, OAuth client secrets, webhook signing secrets, Stripe secret keys, etc.
- Server-only secrets: no `NEXT_PUBLIC_` / `VITE_` prefix; read only in server/route/Edge contexts or BO server tooling.
- If someone asks to expose a secret as public env, **refuse**, explain the risk, and suggest a server proxy or proper public key type (e.g. Stripe *publishable* key).
- `pnpm build` runs `scripts/check-public-env.mjs` and **fails** when public env names look secret-like.

## Monorepo commands

```bash
pnpm install
pnpm dev          # both apps
pnpm dev:web      # storefront :3000
pnpm dev:bo       # backoffice :5175
pnpm lint
pnpm test
pnpm build
pnpm typecheck
```

Prefer filtered Turbo tasks over ad-hoc `cd` when touching one app.

## Docs map

| Path | Use |
| --- | --- |
| [README.md](README.md) | Onboarding, stack, workflow |
| [docs/adr/](docs/adr/) | Architecture decisions |
| [docs/ops/](docs/ops/) | Deploy & release |
| [docs/reference/](docs/reference/) | Industry / competitor notes (internal) |
| [CLOUD.md](CLOUD.md) | Cloud agent / CI-oriented constraints |
| [.cursor/rules/](.cursor/rules/) | Cursor rule mirrors of these principles |

Local-only agent skills (gitignored): `docs/skills/` — optional personal playbooks; not required for contributors.

## PR / change hygiene

- Conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `perf:`)
- One logical change per commit when practical
- Update ADRs when changing architecture; update ops docs when changing deploy/release
- Do not commit `.env`, credentials, or real secrets — only `.env.example` placeholders
