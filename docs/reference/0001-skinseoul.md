# SKINSEOUL — Stack & Context

Sources: confirmed from [skin-seoul.com](https://skin-seoul.com) + HR notes.

---

## Storefront (web)

- **Framework:** Next.js 16 App Router, React Server Components, Turbopack, pnpm
- **Language / validation:** TypeScript, Zod
- **Data fetching:** TanStack Query, Axios
- **UI:** Radix UI, cmdk (command menu/search), vaul (drawers), sonner (toasts), Tailwind-style classes
- **Config:** Runtime env via `window.__ENV` — one build for dev, staging, and prod

## Backend & commerce

- Headless WordPress / WooCommerce — products and orders
- Node / Express API — `api.skin-seoul.com`
- Meilisearch — search
- Stripe Payment Intents + PayPal — payments

## Other surfaces

- Astro — campaign and blog pages
- WordPress / Elementor — skin quiz
- React Native — mobile app

## Infra & tooling

| Area | Stack |
| --- | --- |
| Edge / hosting | Cloudflare → Google Cloud |
| Errors | Sentry |
| Analytics / CX | GTM, Mixpanel, Amplitude, Hotjar, Clarity, BigQuery / Firebase, Klaviyo, Gorgias |

## Team & stage

| Signal | Detail |
| --- | --- |
| Headcount | ~90 across 10+ countries (HR); LinkedIn ~48 — treat builders as **15–27** |
| Org mix | ~30% engineering, product, design |
| Structure | Fully remote; daily **11am SGT** sync; all of eng / product / design report to **Minchul** |
| Tooling | Claude Code via MCP |
| Funding | Pre-seed Jan 2025; raising **KRW 10B** Series A |

**Unknown from outside:** repo layout, test setup, CI provider.

---

## Recommendation

**pnpm + Turborepo monorepo** with a single Next.js app as a **modular monolith**.

- Organize by domain: `catalog`, `search`, `cart`, `checkout`, `account`
- Shared packages: design system, API client / Zod schemas, config
- **Skip microfrontends**

### Why skip microfrontends

They solve coordination across many independent teams with separate deploys. A frontend team of ~5–10 would pay the cost (duplicate React, version drift, slower pages) with no benefit. Mobile scores are already hurt by **~2.8 MB of JS per page**.

### Talking point

SKINSEOUL is already accidentally micro-frontend-ish: Next.js, Astro, Elementor, and React Native all ship separate experiences. A monorepo with shared tokens and an API layer is how you'd pull those together **without a rewrite**. Split into microfrontends only when team count and deploy contention actually demand it.
