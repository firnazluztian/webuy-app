'use client';

import { useState } from 'react';
import { DEFAULT_SEARCH_FILTERS } from '@/features/search/constants';
import {
  applySearchFilters,
  collectSearchFacets,
  countActiveSearchFilters,
} from '@/features/search/lib/filter-products';
import type { SearchFiltersState } from '@/features/search/types';
import type { Product } from '@/lib/schemas';

export function useSearchFilters(products: Product[] | undefined) {
  const [filters, setFilters] = useState<SearchFiltersState>(
    DEFAULT_SEARCH_FILTERS,
  );

  const source = products ?? [];
  const facets = collectSearchFacets(source);
  const results = applySearchFilters(source, filters);
  const activeCount = countActiveSearchFilters(filters);

  const clearFilters = () => {
    setFilters({
      ...DEFAULT_SEARCH_FILTERS,
      sort: filters.sort,
    });
  };

  const patchFilters = (patch: Partial<SearchFiltersState>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  return {
    filters,
    facets,
    results,
    activeCount,
    clearFilters,
    patchFilters,
    setFilters,
  };
}
