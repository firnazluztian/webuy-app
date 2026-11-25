# Ops: Vercel deploy + independent app releases (WeBuy monorepo)

- **Status:** Active
- **Date:** 2026-11-25
- **Audience:** FE shipping storefront (`@webuy/web`) and backoffice (`@webuy/bo`)

## Mental model (vs your Portainer multi-repo)

| Multi-repo + Portainer | WeBuy monorepo + Vercel |
| --- | --- |
| Separate git repos | One repo, two **Vercel projects** |
| Image tag = deployable unit | Git commit = deployable unit; **`web@x.y.z` / `bo@x.y.z` tags** = release ledger |
| Rollback = change image tag in Portainer | Rollback = **Instant Rollback** / promote previous production deployment |
| Push to web repo only deploys web | Push notifies both projects; **`turbo-ignore`** skips the unchanged app |

Tags are **not** Docker tags. They answer “what version is prod supposed to be?” and point at the commit Vercel already built.

---

## Part A — One-time Vercel setup (step by step)

### A1. Prerequisites

- Repo on GitHub (or GitLab / Bitbucket) with default branch **`main`**
- Vercel account with permission to create two projects
- Local: Vercel CLI optional (`pnpm dlx vercel`)

### A2. Create project: storefront

1. Vercel Dashboard → **Add New… → Project** → Import the WeBuy repo.
2. Project name: `webuy-web` (or similar).
3. **Root Directory** → `apps/webuy-web` → Edit → select that folder.
4. Framework Preset should detect **Next.js**. Leave it.
5. Build & Install (recommended overrides if auto-detect is wrong):

   | Setting | Value |
   | --- | --- |
   | Install Command | `pnpm install` (run from monorepo root — Vercel does this when Root Directory is set inside a workspace) |
   | Build Command | `cd ../.. && pnpm turbo run build --filter=@webuy/web` |
   | Output Directory | leave default (Next) |

   If Vercel’s Turborepo auto-config already sets a correct build for the root directory, keep the dashboard defaults. Prefer the filter form above when builds pull in the wrong package.

6. **Ignored Build Step** → ensure:

   ```bash
   npx turbo-ignore
   ```

   (Vercel usually sets this automatically for Turborepo monorepos.)

7. Env vars: add Production / Preview secrets for this app only.
8. Domains → assign storefront domain (e.g. `webuy.example.com`).
9. Deploy.

### A3. Create project: backoffice

1. **Add New… → Project** → Import the **same** repo again.
2. Project name: `webuy-bo`.
3. **Root Directory** → `apps/webuy-bo`.
4. Framework: **Vite**.
5. Overrides if needed:

   | Setting | Value |
   | --- | --- |
   | Build Command | `cd ../.. && pnpm turbo run build --filter=@webuy/bo` |
   | Output Directory | `dist` |
   | Ignored Build Step | `npx turbo-ignore` |

6. SPA fallback is already in [`apps/webuy-bo/vercel.json`](../../apps/webuy-bo/vercel.json) (rewrite → `index.html`).
7. Domains → `bo.webuy.example.com` (or similar).
8. Deploy.

### A4. Verify selective deploys

1. Change only a file under `apps/webuy-web/**` → push `main`.
2. In Vercel: **webuy-web** should build; **webuy-bo** should show **Canceled / Ignored Build Step** (skipped).
3. Change only `docs/**` → both should skip.
4. Change `packages/tailwind-config/**` or the kiichan catalog pin → **both** should build.

### A5. Optional CLI link (local)

From monorepo root:

```bash
pnpm dlx vercel link --repo
```

Maps both apps under `.vercel/repo.json`. Do not commit secrets; keep `.vercel/` gitignored if it appears locally.

---

## Part B — Release / versioning workflow

### Why not one root `pnpm release:major`?

A single monorepo version forces BO up when only web ships. That fights independent domains and rollbacks. Design-system uses one version because it is **one publishable package**. WeBuy has **two deployables**.

### Scripts

From repo root, on a clean `main`:

```bash
pnpm release:web:patch   # bugfix
pnpm release:web:minor   # feature
pnpm release:web:major   # breaking

pnpm release:bo:patch
pnpm release:bo:minor
pnpm release:bo:major
```

Each run:

1. Bumps `apps/webuy-{web|bo}/package.json`
2. Prepends that app’s `CHANGELOG.md` (commits since last `web@*` / `bo@*` tag)
3. Commits `Release web@x.y.z` (or `bo@…`)
4. Creates annotated tag `web@x.y.z` / `bo@x.y.z`
5. Pushes branch + tags → Vercel builds the affected project(s)

### Suggested shipping flow

```text
feature branch → PR → merge to main
                 ↓
         (preview deploys already ran)
                 ↓
    pnpm release:web:minor   # or bo — when you cut a named release
                 ↓
         Vercel production for that app
                 ↓
    record tag ↔ deployment in incident notes if needed
```

You can merge often and only cut tags when you want a named production marker (closer to “image tag” discipline). Or cut a tag on every prod-worthy merge — team preference.

### Rollback (fast)

1. Vercel → project (`webuy-web` or `webuy-bo`) → **Deployments**.
2. Find the previous **Production** deployment (match commit of `web@1.2.0` via Git tags if needed).
3. **⋯ → Instant Rollback** (or CLI: `vercel rollback` in that project context).

No rebuild required for Instant Rollback. Do **not** retag history; cut a new patch release after the fix if you need a clean ledger.

### Mapping tag → deployment

```bash
git show web@1.2.0 --no-patch --format='%H %s'
```

In Vercel Deployments, filter/search that commit SHA.

---

## Part C — What redeploys when

| Change | `webuy-web` | `webuy-bo` |
| --- | --- | --- |
| `apps/webuy-web/**` | build | skip |
| `apps/webuy-bo/**` | skip | build |
| `packages/*` shared by both | build | build |
| `pnpm-workspace.yaml` catalog / lockfile | build | build |
| `docs/**` only | skip | skip |
| Release commit that only bumps web version/changelog | build (web package changed) | skip |

---

## Anti-patterns

- One shared `v1.2.3` tag for the whole monorepo as the only version — blurs which app shipped.
- Expecting a tag alone to change Portainer-style “running image” without a Vercel production assignment — on Vercel, production is the deployment promoted to the domain.
- Skipping `turbo-ignore` — every push rebuilds both apps and burns quota.
- Putting Root Directory at repo root for a single project that builds both — you lose independent domains and rollbacks.

## Related

- [ADR-0001: Monorepo over microfrontends](../adr/0001-monorepo-over-microfrontends.md)
- [ADR-0002: Shared kiichan catalog pin](../adr/0002-shared-kiichan-catalog-pin.md)
- Release implementation: [`scripts/release.mjs`](../../scripts/release.mjs)
