'use client';

import { ProductCard } from '@/features/catalog/components/product-card';
import { useSearchProducts } from '@/features/catalog/hooks/use-products';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const Search = ({ locale, query }: { locale: Locale; query: string }) => {
  const t = useTranslations(locale);
  const { data, isLoading, isError, refetch } = useSearchProducts(query);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-neutral-900">{t.search.title}</h1>
        {query ? (
          <p className="mt-1 text-sm text-neutral-600">
            {t.search.resultsFor} “{query}”
          </p>
        ) : null}
      </div>

      {isLoading ? <p className="text-sm text-neutral-600">{t.search.loading}</p> : null}
      {isError ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-red-600">{t.search.error}</p>
          <button type="button" className="text-sm text-primary underline" onClick={() => refetch()}>
            {t.common.retry}
          </button>
        </div>
      ) : null}
      {!isLoading && !isError && data?.length === 0 ? (
        <p className="text-sm text-neutral-600">{t.search.empty}</p>
      ) : null}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : null}
    </div>
  );
};
