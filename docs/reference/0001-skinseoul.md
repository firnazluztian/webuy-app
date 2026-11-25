Here's their stack as I confirmed it from skin-seoul.com, plus what HR told you.
Storefront (web):
Next.js 16 App Router with React Server Components, Turbopack and pnpm.
TypeScript, zod for validation, TanStack Query and axios for data fetching.
Radix UI with cmdk (command menu/search), vaul (drawers), sonner (toasts), and Tailwind-style classes.
Runtime config injected as window.\_\_ENV, so one build runs in dev, staging and prod.
Backend and commerce:
Headless WordPress/WooCommerce for products and orders.
A Node/Express API at api.skin-seoul.com.
Meilisearch for search.
Stripe Payment Intents and PayPal for payments.
Other surfaces:
Astro for campaign and blog pages, WordPress/Elementor for the skin quiz.
A React Native app.
Infra and tooling: Cloudflare in front of Google Cloud, and Sentry for errors. For analytics and CX they use GTM, Mixpanel, Amplitude, Hotjar, Clarity, BigQuery/Firebase, Klaviyo and Gorgias.
Team: HR said about 90 people in 10+ countries, roughly 30% of them in engineering, product and design. LinkedIn shows about 48, so treat it as somewhere between 15 and 27 builders. Everyone is fully remote with a daily 11am SGT sync, and everyone in dev, product and design reports to Minchul. They use Claude Code through MCP. They're early stage: pre-seed in January 2025, with a KRW 10B Series A being raised now. I couldn't see their repo layout, test setup or CI provider from outside.
My recommendation: build a pnpm + Turborepo monorepo with one Next.js app as a modular monolith. Organize the app by domain (catalog, search, cart, checkout, account), and put shared design system, API client/zod schemas and config in packages. Skip microfrontends. They solve coordination between many independent teams with separate deploys, and a single frontend team of maybe 5 to 10 people would pay the cost (duplicate React, version drift, slower pages) with no benefit. Their mobile scores are already hurting from 2.8 MB of JS per page.
There's also a good talking point here. SKINSEOUL is already accidentally micro-frontend-ish: Next.js, Astro, Elementor and React Native all render separate experiences. You can say a monorepo with shared tokens and an API layer is how you'd pull those together without a rewrite. Mention that you'd only split into microfrontends when team count and deploy contention actually demand it.
