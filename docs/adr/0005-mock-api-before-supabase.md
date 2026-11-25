# ADR-0005: External commerce JSON API before Supabase

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** WeBuy frontend

## Context

The Friday storefront needs a full purchase path and TanStack Query against real HTTP (`staleTime`, invalidation, loading/error). Owning Route Handlers or standing up Supabase in the same window competes with UX delivery. Public env must never carry secrets (`NEXT_PUBLIC_*`).

## Decision

1. Consume a **public commerce JSON API** (products, search, users, auth, carts) from the storefront client via a thin typed fetch module.
2. Keep Zod schemas and the fetch client **inside** `@webuy/web` for this sprint (no `@webuy/api` package yet).
3. Web auth uses the commerce **auth login** endpoint; session token stored client-side. BO auth is **hardcoded** client credentials.
4. Feature hooks call the commerce client — swap the base URL / adapter later for Supabase or an owned BFF without rewriting UI.
5. Locale markets (`en`/`ko`/`id` → SGD/KRW/IDR) stay a **frontend concern**; catalog prices are treated as a base amount for display FX.

## Consequences

### Positive

- Real HTTP + Query cache behavior without operating our own mock server
- Faster path to a complete purchase UX
- Clear seam for Supabase OAuth / tables next sprint

### Negative / trade-offs

- Dependent on a third-party public API availability and schema
- Client-held session token is not production-hardening
- Static FX is display-only

## Alternatives considered

1. **Supabase Free now** — correct long-term; deferred for schedule.
2. **Next Route Handlers + local fixtures** — more ownership, more code this sprint. Deferred.
3. **Import static JSON in the client** — no HTTP cache semantics. Rejected.

## References

- [docs/scope/0001-mvp-friday-showcase.md](../scope/0001-mvp-friday-showcase.md)
- [docs/reference/0001-skinseoul.md](../reference/0001-skinseoul.md)
