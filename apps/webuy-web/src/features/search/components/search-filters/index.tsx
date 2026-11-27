'use client';

import {
  Button,
  CheckBoxGroup,
  Checkbox,
  RadioGroup,
} from '@kiichan/design-system';
import { PRICE_RANGE_DEFS } from '@/features/search/constants';
import type {
  PriceRangeId,
  RatingFilter,
  SearchFacets,
  SearchFiltersState,
} from '@/features/search/types';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

function isPriceRangeId(value: string): value is PriceRangeId {
  return PRICE_RANGE_DEFS.some((range) => range.id === value);
}

function isRatingFilter(value: string): value is RatingFilter {
  return value === 'all' || value === '4' || value === '3';
}

interface SearchFiltersProps {
  locale: Locale;
  filters: SearchFiltersState;
  facets: SearchFacets;
  activeCount: number;
  onChange: (patch: Partial<SearchFiltersState>) => void;
  onClear: () => void;
}

export const SearchFilters = ({
  locale,
  filters,
  facets,
  activeCount,
  onChange,
  onClear,
}: SearchFiltersProps) => {
  const t = useTranslations(locale);
  const { format } = useFormatMoney();

  const priceOptions = PRICE_RANGE_DEFS.map((range) => {
    if (range.id === 'all') {
      return { value: range.id, label: t.search.priceAll };
    }
    if (range.max !== undefined && range.min === undefined) {
      return {
        value: range.id,
        label: t.search.priceUnder.replace('{value}', format(range.max)),
      };
    }
    if (range.min !== undefined && range.max !== undefined) {
      return {
        value: range.id,
        label: t.search.priceBetween
          .replace('{min}', format(range.min))
          .replace('{max}', format(range.max)),
      };
    }
    return {
      value: range.id,
      label: t.search.priceFrom.replace('{value}', format(range.min ?? 0)),
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium tracking-wide text-neutral-900 uppercase">
          {t.search.filters}
          {activeCount > 0 ? ` (${activeCount})` : ''}
        </p>
        {activeCount > 0 ? (
          <Button type="button" variant="ghost" onClick={onClear}>
            {t.search.clearFilters}
          </Button>
        ) : null}
      </div>

      {facets.categories.length > 0 ? (
        <CheckBoxGroup
          name="search-category"
          label={t.search.category}
          layout="vertical"
          gap="sm"
          fullWidth
          options={facets.categories.map((category) => ({
            value: category,
            label: category,
          }))}
          value={filters.categories}
          onChange={(categories) => onChange({ categories })}
        />
      ) : null}

      {facets.brands.length > 0 ? (
        <CheckBoxGroup
          name="search-brand"
          label={t.search.brand}
          layout="vertical"
          gap="sm"
          fullWidth
          options={facets.brands.map((brand) => ({
            value: brand,
            label: brand,
          }))}
          value={filters.brands}
          onChange={(brands) => onChange({ brands })}
        />
      ) : null}

      <RadioGroup
        name="search-price"
        label={t.search.price}
        layout="vertical"
        gap="sm"
        fullWidth
        options={priceOptions}
        value={filters.priceRange}
        onChange={(value) => {
          if (isPriceRangeId(value)) {
            onChange({ priceRange: value });
          }
        }}
      />

      <RadioGroup
        name="search-rating"
        label={t.search.rating}
        layout="vertical"
        gap="sm"
        fullWidth
        options={[
          { value: 'all', label: t.search.ratingAll },
          { value: '4', label: t.search.rating4Plus },
          { value: '3', label: t.search.rating3Plus },
        ]}
        value={filters.minRating}
        onChange={(value) => {
          if (isRatingFilter(value)) {
            onChange({ minRating: value });
          }
        }}
      />

      <Checkbox
        checked={filters.inStockOnly}
        onChange={(event) =>
          onChange({ inStockOnly: event.currentTarget.checked })
        }
        label={t.search.inStockOnly}
      />
    </div>
  );
};
