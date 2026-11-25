# MVP scope — Friday storefront journey

- **Status:** Active
- **Deadline:** Fri 27 Nov 2026
- **Surfaces:** `@webuy/web` (storefront), `@webuy/bo` (backoffice)

## Intent

Ship a complete guest → checkout journey on the storefront, plus a thin English-only backoffice. Focus architecture on TanStack Query (`staleTime`, invalidation), Zustand vs server state, feature modules, i18n/l10n with market currencies, and GTM funnel events.

## In scope

### Web (`@webuy/web`)

| Area | Behavior |
| --- | --- |
| Shell | Topbar (logo, search, cart badge, account, locale switcher), footer |
| Home | Hero, search entry, featured products |
| Catalog | Search results, PDP, add to cart |
| Cart | Zustand lines; totals formatted per market |
| Auth | Session via commerce auth API; login / logout / account |
| Checkout | Address → place order |
| Payment | Always-success confirmation for this sprint |
| i18n | Locales `en` / `ko` / `id` — one messages file each |
| Markets | `en`→SG/`SGD`, `ko`→KR/`KRW`, `id`→ID/`IDR` via `formatMoney` |
| Catalog API | External commerce JSON API (products, users, auth, carts) |
| Analytics | GTM stub + `dataLayer` ecommerce events (incl. `currency`) |

### BO (`@webuy/bo`)

| Area | Behavior |
| --- | --- |
| Auth | Hardcoded admin credentials + client route guard |
| Users | List from commerce users API |
| Orders | Carts list as order activity (read-only) |
| Locale | English only |

## Out of scope (this sprint)

- Real Stripe / PayPal settlement
- Supabase / OAuth (documented seam — next sprint)
- AI floating chat (layout mount reserved)
- Profile recommendations engine
- Meilisearch, Sentry, Mixpanel
- Shared `@webuy/api` package
- BO i18n / multi-currency admin UX
- Live FX rates; per-SKU multi-currency price tables
- Translating product titles/descriptions from the catalog API

## Journey map

```text
/[locale] → search → PDP → cart → login? → checkout → payment success → account
     ↕ locale switcher (language + currency together)
```

## Data layer

| Concern | Now | Later |
| --- | --- | --- |
| Catalog / users / carts | Public commerce JSON API | Supabase or owned BFF |
| Web auth | Auth login + stored session token | Supabase Auth + OAuth |
| BO auth | Hardcoded credentials | Real admin IdP |
| Payment | Always `success` locally | Payment provider webhooks |
| FX | Static multipliers from catalog base price | Live rates or market price lists |
| Locale = market | 1:1 for speed | Split language vs ship-to country |

## Architecture notes

- **Server state:** Query over HTTP; products `staleTime: 60s`, search `30s`; invalidate after mutations
- **Client state:** Zustand cart — not a second server cache
- **RSC vs client:** Shell where cheap; Query for interactive catalog and auth
- **i18n:** One file per locale + market row to add a language
- **Money:** `Intl.NumberFormat`; markets bind locale to currency for this sprint
- **Observability:** GTM `dataLayer` with currency on funnel events

## Next sprint (candidates)

1. Supabase: products persistence + email/OAuth for web
2. AI assistance floating chat
3. Profile insights
4. BO i18n; real admin auth
5. Freeze public API contracts

## Backlog reference

Stories S0–S11 live in the Notion sprint board and mirror this scope.
