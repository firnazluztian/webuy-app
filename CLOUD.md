# WeBuy — Cloud agent instructions

For Cursor Cloud Agents and any unattended agent running on a clean clone.
Follow [AGENTS.md](AGENTS.md) in full. This file only adds **environment / CI / deploy** constraints.

## Before changing code

1. Read `AGENTS.md` and the relevant ADR under `docs/adr/`.
2. Search the repo for existing patterns (features, hooks, kiichan usage).
3. If the task is underspecified, stop and ask clarifying questions — do not invent product scope.

## Hard constraints

- Default UI: `@kiichan/design-system` unless the task says otherwise.
- Keep changes minimal and reviewable. No drive-by refactors.
- Do not commit secrets, `.env` files, or weaken `scripts/check-public-env.mjs`.
- Do not skip hooks (`--no-verify`) or disable ESLint rules globally to land a change.
- Production build must pass unless the requester explicitly says not to build.
- Never document this repo as a demo or interview exercise in README / UI / commits.

## Verify locally (or in the cloud VM) before finishing

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

If only one app changed, prefer filtered commands, e.g.:

```bash
pnpm turbo run lint test build --filter=@webuy/web
```

## Deploy model (do not fight it)

- Two Vercel projects, one Git repo — see [docs/ops/0001-vercel-deploy-and-release.md](docs/ops/0001-vercel-deploy-and-release.md)
- Independent release tags: `web@x.y.z` / `bo@x.y.z` via `pnpm release:web:*` / `pnpm release:bo:*`
- Preserve `turbo-ignore` / selective builds
- Do not introduce a single monorepo version tag as the only release ledger

## Design-system bumps

Edit the catalog pin in `pnpm-workspace.yaml` only, then `pnpm install`, and commit lockfile + workspace file together. See [ADR-0002](docs/adr/0002-shared-kiichan-catalog-pin.md).

## Out of scope unless asked

- Changing Vercel project settings / domains
- Force-push, history rewrite, or skipping CI
- Adding new top-level apps or absorbing `@kiichan/design-system` into `packages/`
