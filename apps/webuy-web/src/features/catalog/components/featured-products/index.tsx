'use client';

import Link from 'next/link';
import { Button } from '@kiichan/design-system';
import { ProductCard } from '@/features/catalog/components/product-card';
import { useFeaturedProducts } from '@/features/catalog/hooks/use-products';
import { ProductGridSkeleton } from '@/features/shell/components/loading/product-grid-skeleton';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const FeaturedProducts = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const { data, isLoading, isError, refetch } = useFeaturedProducts();

  return (
    <section className="flex flex-col gap-8" aria-labelledby="featured-heading">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-xl flex-col gap-2">
          <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
            {t.home.featuredEyebrow}
          </p>
          <h2
            id="featured-heading"
            className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl"
          >
            {t.home.featuredHeading}
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            {t.home.featuredSubtitle}
          </p>
        </div>
        <Link
          href={`/${locale}/search`}
          className="text-sm font-medium text-neutral-900 underline-offset-4 transition hover:underline"
        >
          {t.home.featuredViewAll}
        </Link>
      </div>

      {isLoading ? (
        <ProductGridSkeleton
          count={8}
          className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-10"
        />
      ) : null}

      {isError ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-red-600">{t.common.error}</p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            {t.common.retry}
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && !data?.length ? (
        <p className="text-sm text-neutral-600">{t.home.emptyFeatured}</p>
      ) : null}

      {data && data.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6 md:gap-y-10">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      ) : null}
    </section>
  );
};
