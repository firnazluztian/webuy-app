import type {
  PriceRangeDef,
  PriceRangeId,
  SearchFiltersState,
  SortOption,
} from '@/features/search/types';

export const DEFAULT_SEARCH_FILTERS: SearchFiltersState = {
  categories: [],
  brands: [],
  priceRange: 'all',
  minRating: 'all',
  inStockOnly: false,
  sort: 'featured',
};

export const PRICE_RANGE_DEFS: readonly PriceRangeDef[] = [
  { id: 'all' },
  { id: 'under-50', max: 50 },
  { id: '50-100', min: 50, max: 100 },
  { id: '100-250', min: 100, max: 250 },
  { id: '250-plus', min: 250 },
] as const;

export const SORT_OPTIONS: readonly SortOption[] = [
  'featured',
  'price-asc',
  'price-desc',
  'rating-desc',
  'name-asc',
] as const;

export const PRICE_RANGE_IDS: readonly PriceRangeId[] = PRICE_RANGE_DEFS.map(
  (range) => range.id,
);
