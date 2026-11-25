'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProduct, fetchProducts, fetchSearch } from '@/lib/client-api';
import { queryKeys, staleTimes } from '@/lib/query-keys';

export function useFeaturedProducts() {
  return useQuery({
    queryKey: queryKeys.products.featured,
    queryFn: () => fetchProducts(8, 0),
    staleTime: staleTimes.products,
  });
}

export function useHeroProducts() {
  return useQuery({
    queryKey: queryKeys.products.hero,
    queryFn: () => fetchProducts(5, 0),
    staleTime: staleTimes.products,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => fetchProduct(id),
    staleTime: staleTimes.products,
    enabled: Boolean(id),
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => fetchSearch(query),
    staleTime: staleTimes.search,
  });
}
