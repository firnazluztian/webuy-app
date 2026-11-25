export const queryKeys = {
  products: {
    all: ['products'] as const,
    featured: ['products', 'featured'] as const,
    detail: (id: string) => ['products', id] as const,
  },
  search: (q: string) => ['search', q] as const,
  me: ['auth', 'me'] as const,
  order: (id: string) => ['orders', id] as const,
};

/**
 * staleTime defaults:
 * - catalog: 60s — product list changes slowly
 * - search: 30s — fresher while refining queries
 * - me/orders: rely on invalidateQueries after mutations
 */
export const staleTimes = {
  products: 60_000,
  search: 30_000,
  me: 30_000,
  order: 0,
} as const;
