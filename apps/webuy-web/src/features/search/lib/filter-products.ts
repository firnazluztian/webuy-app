import { PRICE_RANGE_DEFS } from '@/features/search/constants';
import type {
  PriceRangeId,
  SearchFacets,
  SearchFiltersState,
} from '@/features/search/types';
import type { Product } from '@/lib/schemas';

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function isProductInStock(product: Product): boolean {
  if (typeof product.stock === 'number') {
    return product.stock > 0;
  }
  if (product.availabilityStatus) {
    return !/out of stock/i.test(product.availabilityStatus);
  }
  return true;
}

export function collectSearchFacets(products: Product[]): SearchFacets {
  return {
    categories: uniqueSorted(
      products
        .map((product) => product.category)
        .filter((value): value is string => Boolean(value)),
    ),
    brands: uniqueSorted(
      products
        .map((product) => product.brand)
        .filter((value): value is string => Boolean(value)),
    ),
  };
}

function matchesPriceRange(price: number, rangeId: PriceRangeId): boolean {
  const range = PRICE_RANGE_DEFS.find((item) => item.id === rangeId);
  if (!range || rangeId === 'all') {
    return true;
  }
  if (range.min !== undefined && price < range.min) {
    return false;
  }
  if (range.max !== undefined && price >= range.max) {
    return false;
  }
  return true;
}

export function countActiveSearchFilters(filters: SearchFiltersState): number {
  let count = filters.categories.length + filters.brands.length;
  if (filters.priceRange !== 'all') {
    count += 1;
  }
  if (filters.minRating !== 'all') {
    count += 1;
  }
  if (filters.inStockOnly) {
    count += 1;
  }
  return count;
}

export function applySearchFilters(
  products: Product[],
  filters: SearchFiltersState,
): Product[] {
  const minRating =
    filters.minRating === 'all' ? 0 : Number(filters.minRating);

  const filtered = products.filter((product) => {
    if (
      filters.categories.length > 0 &&
      (!product.category || !filters.categories.includes(product.category))
    ) {
      return false;
    }
    if (
      filters.brands.length > 0 &&
      (!product.brand || !filters.brands.includes(product.brand))
    ) {
      return false;
    }
    if (!matchesPriceRange(product.price, filters.priceRange)) {
      return false;
    }
    if (minRating > 0 && (product.rating ?? 0) < minRating) {
      return false;
    }
    if (filters.inStockOnly && !isProductInStock(product)) {
      return false;
    }
    return true;
  });

  if (filters.sort === 'featured') {
    return filtered;
  }

  const sorted = [...filtered];
  switch (filters.sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }
  return sorted;
}
