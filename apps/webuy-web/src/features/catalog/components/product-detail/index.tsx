'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Breadcrumbs,
  Button,
  Divider,
  StarRating,
} from '@kiichan/design-system';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import { ProductGallery } from '@/features/catalog/components/product-detail/components/product-gallery';
import { useInView } from '@/features/catalog/components/product-detail/hooks/use-in-view';
import { useProduct } from '@/features/catalog/hooks/use-products';
import { ProductDetailSkeleton } from '@/features/shell/components/loading/product-detail-skeleton';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { convertFromBase } from '@/i18n/markets';
import type { Locale } from '@/i18n/types';
import { trackAddToCart, trackViewItem } from '@/lib/gtm';

const ProductSpecs = dynamic(
  () =>
    import('@/features/catalog/components/product-specs').then((mod) => ({
      default: mod.ProductSpecs,
    })),
  {
    loading: () => (
      <div className="h-40 animate-pulse bg-neutral-100" />
    ),
  },
);

const ProductReviews = dynamic(
  () =>
    import('@/features/catalog/components/product-reviews').then((mod) => ({
      default: mod.ProductReviews,
    })),
  {
    loading: () => (
      <div className="h-48 animate-pulse bg-neutral-100" />
    ),
  },
);

function listPrice(basePrice: number, discountPercentage?: number) {
  if (discountPercentage === undefined || discountPercentage <= 0) {
    return null;
  }
  return basePrice / (1 - discountPercentage / 100);
}

export const ProductDetail = ({
  locale,
  productId,
}: {
  locale: Locale;
  productId: string;
}) => {
  const t = useTranslations(locale);
  const { data, isLoading, isError, refetch } = useProduct(productId);
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const { format, convert, currency, marketId } = useFormatMoney();
  const belowFoldRef = useRef<HTMLDivElement>(null);
  const showBelowFold = useInView(belowFoldRef, '200px 0px', Boolean(data));

  useEffect(() => {
    if (!data) {
      return;
    }
    trackViewItem({
      itemId: String(data.id),
      itemName: data.title,
      value: convertFromBase(data.price, marketId),
      currency,
    });
  }, [currency, data, marketId]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-red-600">{t.product.notFound}</p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          {t.common.retry}
        </Button>
        <Link
          href={`/${locale}/search`}
          className="text-sm text-neutral-700 underline"
        >
          {t.product.backToSearch}
        </Link>
      </div>
    );
  }

  const galleryImages = Array.from(
    new Set(
      [...(data.images ?? []), data.thumbnail].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  );
  const discount = data.discountPercentage;
  const compareAt = listPrice(data.price, discount);
  const reviewCount = data.reviews?.length ?? 0;
  const reviewLabel =
    reviewCount === 1
      ? t.product.reviewCountOne
      : t.product.reviewCount.replace('{count}', String(reviewCount));

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <Breadcrumbs
        items={[
          { label: t.product.breadcrumbHome, href: `/${locale}` },
          { label: t.product.breadcrumbSearch, href: `/${locale}/search` },
          { label: data.title },
        ]}
        activeLastItem
      />

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          locale={locale}
          title={data.title}
          images={galleryImages}
        />

        <div className="flex flex-col gap-8 lg:sticky lg:top-24">
          <div className="flex flex-col gap-4">
            {(data.brand || data.category) && (
              <p className="text-xs font-medium tracking-[0.22em] text-neutral-500 uppercase">
                {[data.brand, data.category].filter(Boolean).join(' · ')}
              </p>
            )}

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl md:leading-tight">
              {data.title}
            </h1>

            {data.rating !== undefined ? (
              <div className="flex flex-wrap items-center gap-3">
                <StarRating rating={data.rating} readOnly color="warning" />
                <span className="text-sm text-neutral-600">
                  {data.rating.toFixed(1)}
                  {reviewCount > 0 ? ` · ${reviewLabel}` : ''}
                </span>
              </div>
            ) : null}

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <p className="text-2xl font-medium tracking-tight text-neutral-900">
                {format(data.price)}
              </p>
              {compareAt !== null ? (
                <p className="text-sm text-neutral-400 line-through">
                  {format(compareAt)}
                </p>
              ) : null}
              {discount !== undefined && discount > 0 ? (
                <p className="text-sm text-primary">
                  {t.product.discount.replace('{value}', discount.toFixed(0))}
                </p>
              ) : null}
            </div>

            {data.availabilityStatus || data.stock !== undefined ? (
              <p className="text-sm text-neutral-600">
                {data.availabilityStatus ??
                  `${t.product.stock}: ${data.stock}`}
              </p>
            ) : null}
          </div>

          <Divider />

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
              {t.product.about}
            </h2>
            <p className="text-base leading-relaxed text-neutral-700">
              {data.description}
            </p>
          </div>

          {(data.shippingInformation ||
            data.warrantyInformation ||
            data.returnPolicy) && (
            <>
              <Divider />
              <ul className="flex flex-col gap-3 text-sm text-neutral-600">
                {data.shippingInformation ? (
                  <li>
                    <span className="font-medium text-neutral-900">
                      {t.product.shipping}:{' '}
                    </span>
                    {data.shippingInformation}
                  </li>
                ) : null}
                {data.warrantyInformation ? (
                  <li>
                    <span className="font-medium text-neutral-900">
                      {t.product.warranty}:{' '}
                    </span>
                    {data.warrantyInformation}
                  </li>
                ) : null}
                {data.returnPolicy ? (
                  <li>
                    <span className="font-medium text-neutral-900">
                      {t.product.returnPolicy}:{' '}
                    </span>
                    {data.returnPolicy}
                  </li>
                ) : null}
              </ul>
            </>
          )}

          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => {
              addItem({
                productId: data.id,
                title: data.title,
                imageUrl: data.thumbnail,
                basePrice: data.price,
              });
              trackAddToCart({
                itemId: String(data.id),
                itemName: data.title,
                value: convert(data.price),
                currency,
              });
              setAdded(true);
            }}
          >
            {added ? t.product.added : t.product.addToCart}
          </Button>
        </div>
      </div>

      <div ref={belowFoldRef} className="flex min-h-32 flex-col gap-14">
        {showBelowFold ? (
          <>
            <ProductSpecs locale={locale} product={data} />
            <ProductReviews locale={locale} reviews={data.reviews ?? []} />
          </>
        ) : (
          <div className="h-32 animate-pulse bg-neutral-100" />
        )}
      </div>
    </div>
  );
};
