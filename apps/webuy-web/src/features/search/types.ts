export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'name-asc';

export type PriceRangeId =
  | 'all'
  | 'under-50'
  | '50-100'
  | '100-250'
  | '250-plus';

export type RatingFilter = 'all' | '4' | '3';

export interface SearchFiltersState {
  categories: string[];
  brands: string[];
  priceRange: PriceRangeId;
  minRating: RatingFilter;
  inStockOnly: boolean;
  sort: SortOption;
}

export interface SearchFacets {
  categories: string[];
  brands: string[];
}

export interface PriceRangeDef {
  id: PriceRangeId;
  min?: number;
  max?: number;
}
