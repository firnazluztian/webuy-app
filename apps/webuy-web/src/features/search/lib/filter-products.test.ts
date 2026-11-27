import { describe, expect, it } from 'vitest';
import { DEFAULT_SEARCH_FILTERS } from '@/features/search/constants';
import {
  applySearchFilters,
  collectSearchFacets,
  countActiveSearchFilters,
  isProductInStock,
} from '@/features/search/lib/filter-products';
import type { Product } from '@/lib/schemas';

function product(partial: Partial<Product> & Pick<Product, 'id' | 'title'>): Product {
  return {
    description: 'Sample',
    price: 100,
    thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
    ...partial,
  };
}

describe('filter-products', () => {
  const catalog = [
    product({
      id: 1,
      title: 'Alpha Serum',
      price: 40,
      category: 'beauty',
      brand: 'Glow',
      rating: 4.5,
      stock: 12,
    }),
    product({
      id: 2,
      title: 'Beta Cream',
      price: 120,
      category: 'skincare',
      brand: 'Luxe',
      rating: 3.2,
      stock: 0,
      availabilityStatus: 'Out of Stock',
    }),
    product({
      id: 3,
      title: 'Gamma Oil',
      price: 280,
      category: 'beauty',
      brand: 'Glow',
      rating: 4.8,
      stock: 3,
    }),
  ];

  it('collects sorted unique facets', () => {
    expect(collectSearchFacets(catalog)).toEqual({
      categories: ['beauty', 'skincare'],
      brands: ['Glow', 'Luxe'],
    });
  });

  it('filters by category, price, rating, and stock', () => {
    const results = applySearchFilters(catalog, {
      ...DEFAULT_SEARCH_FILTERS,
      categories: ['beauty'],
      priceRange: 'under-50',
      minRating: '4',
      inStockOnly: true,
    });

    expect(results.map((item) => item.id)).toEqual([1]);
  });

  it('sorts by price ascending', () => {
    const results = applySearchFilters(catalog, {
      ...DEFAULT_SEARCH_FILTERS,
      sort: 'price-asc',
    });
    expect(results.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it('counts active filters without sort', () => {
    expect(
      countActiveSearchFilters({
        ...DEFAULT_SEARCH_FILTERS,
        brands: ['Glow'],
        priceRange: '100-250',
        inStockOnly: true,
      }),
    ).toBe(3);
  });

  it('detects out of stock from status', () => {
    expect(isProductInStock(catalog[1]!)).toBe(false);
    expect(isProductInStock(catalog[0]!)).toBe(true);
  });
});
