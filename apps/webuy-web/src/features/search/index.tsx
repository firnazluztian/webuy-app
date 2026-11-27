'use client';

import { useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Select,
} from '@kiichan/design-system';
import { ProductCard } from '@/features/catalog/components/product-card';
import { SearchFilters } from '@/features/search/components/search-filters';
import { SORT_OPTIONS } from '@/features/search/constants';
import { useSearchFilters } from '@/features/search/hooks/use-search-filters';
import type { SortOption } from '@/features/search/types';
import { useSearchProducts } from '@/features/catalog/hooks/use-products';
import { ProductGridSkeleton } from '@/features/shell/components/loading/product-grid-skeleton';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

function isSortOption(value: string): value is SortOption {
  return (SORT_OPTIONS as readonly string[]).includes(value);
}

export const Search = ({ locale, query }: { locale: Locale; query: string }) => {
  const t = useTranslations(locale);
  const { data, isLoading, isError, refetch } = useSearchProducts(query);
  const {
    filters,
    facets,
    results,
    activeCount,
    clearFilters,
    patchFilters,
  } = useSearchFilters(data);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sortOptions = SORT_OPTIONS.map((value) => ({
    value,
    label: {
      featured: t.search.sortFeatured,
      'price-asc': t.search.sortPriceAsc,
      'price-desc': t.search.sortPriceDesc,
      'rating-desc': t.search.sortRating,
      'name-asc': t.search.sortName,
    }[value],
  }));

  const resultsLabel =
    results.length === 1
      ? t.search.resultsCountOne
      : t.search.resultsCount.replace('{count}', String(results.length));

  const filterPanel = (
    <SearchFilters
      locale={locale}
      filters={filters}
      facets={facets}
      activeCount={activeCount}
      onChange={patchFilters}
      onClear={clearFilters}
    />
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2 border-b border-neutral-200 pb-6">
        <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
          {t.search.title}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          {query ? (
            <>
              {t.search.resultsFor}{' '}
              <span className="text-primary">“{query}”</span>
            </>
          ) : (
            t.search.browseTitle
          )}
        </h1>
      </header>

      {isLoading ? (
        <ProductGridSkeleton
          count={8}
          className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-3"
        />
      ) : null}

      {isError ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-red-600">{t.search.error}</p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            {t.common.retry}
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              {filterPanel}
            </div>
          </aside>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-neutral-600">{resultsLabel}</p>
                {activeCount > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filters.categories.map((category) => (
                      <Chip
                        key={`cat-${category}`}
                        variant="soft"
                        color="default"
                        onClose={() =>
                          patchFilters({
                            categories: filters.categories.filter(
                              (item) => item !== category,
                            ),
                          })
                        }
                      >
                        {category}
                      </Chip>
                    ))}
                    {filters.brands.map((brand) => (
                      <Chip
                        key={`brand-${brand}`}
                        variant="soft"
                        color="default"
                        onClose={() =>
                          patchFilters({
                            brands: filters.brands.filter(
                              (item) => item !== brand,
                            ),
                          })
                        }
                      >
                        {brand}
                      </Chip>
                    ))}
                    {filters.priceRange !== 'all' ? (
                      <Chip
                        variant="soft"
                        color="default"
                        onClose={() => patchFilters({ priceRange: 'all' })}
                      >
                        {t.search.price}
                      </Chip>
                    ) : null}
                    {filters.minRating !== 'all' ? (
                      <Chip
                        variant="soft"
                        color="default"
                        onClose={() => patchFilters({ minRating: 'all' })}
                      >
                        {t.search.rating}
                      </Chip>
                    ) : null}
                    {filters.inStockOnly ? (
                      <Chip
                        variant="soft"
                        color="default"
                        onClose={() => patchFilters({ inStockOnly: false })}
                      >
                        {t.search.inStockOnly}
                      </Chip>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="lg:hidden"
                  leftIcon="mdi:filter-variant"
                  onClick={() => setFiltersOpen(true)}
                >
                  {t.search.openFilters}
                  {activeCount > 0 ? ` (${activeCount})` : ''}
                </Button>
                <div className="min-w-48 flex-1 sm:flex-none">
                  <Select
                    label={t.search.sort}
                    aria-label={t.search.sort}
                    options={sortOptions}
                    value={filters.sort}
                    onChange={(value) => {
                      if (isSortOption(value)) {
                        patchFilters({ sort: value });
                      }
                    }}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            {data && data.length === 0 ? (
              <p className="text-sm text-neutral-600">{t.search.empty}</p>
            ) : null}

            {data && data.length > 0 && results.length === 0 ? (
              <div className="flex flex-col items-start gap-3 py-10">
                <p className="text-sm text-neutral-600">
                  {t.search.emptyFiltered}
                </p>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  {t.search.clearFilters}
                </Button>
              </div>
            ) : null}

            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <Dialog
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        className="w-full max-w-md"
        backdrop="blur"
        closeOnBackdropClick
        position="bottom"
        scrollBehavior="inside"
      >
        <DialogHeader onClose={() => setFiltersOpen(false)}>
          <DialogTitle>{t.search.filters}</DialogTitle>
        </DialogHeader>
        <DialogBody className="max-h-[70vh] overflow-y-auto">
          {filterPanel}
        </DialogBody>
        <DialogActions className="flex justify-end gap-2">
          <Button
            type="button"
            variant="primary"
            onClick={() => setFiltersOpen(false)}
          >
            {t.search.applyFilters}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
