'use client';

import { ProductCard } from '@/features/catalog/components/product-card';
import { useFeaturedProducts } from '@/features/catalog/hooks/use-products';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const FeaturedProducts = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const { data, isLoading, isError, refetch } = useFeaturedProducts();

  if (isLoading) {
    return <p className="text-sm text-neutral-600">{t.common.loading}</p>;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-red-600">{t.common.error}</p>
        <button type="button" className="text-sm text-primary underline" onClick={() => refetch()}>
          {t.common.retry}
        </button>
      </div>
    );
  }

  if (!data?.length) {
    return <p className="text-sm text-neutral-600">{t.home.emptyFeatured}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {data.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
};
