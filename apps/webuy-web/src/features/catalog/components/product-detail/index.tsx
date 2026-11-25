"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, StarRating } from "@kiichan/design-system";
import { useCartStore } from "@/features/cart/hooks/use-cart-store";
import { useInView } from "@/features/catalog/components/product-detail/hooks/use-in-view";
import { useProduct } from "@/features/catalog/hooks/use-products";
import { useFormatMoney } from "@/features/shell/hooks/use-format-money";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import { convertFromBase } from "@/i18n/markets";
import type { Locale } from "@/i18n/types";
import { trackAddToCart, trackViewItem } from "@/lib/gtm";

const ProductSpecs = dynamic(
  () =>
    import("@/features/catalog/components/product-specs").then((mod) => ({
      default: mod.ProductSpecs,
    })),
  {
    loading: () => (
      <div className="h-40 animate-pulse rounded-lg bg-neutral-100" />
    ),
  },
);

const ProductReviews = dynamic(
  () =>
    import("@/features/catalog/components/product-reviews").then((mod) => ({
      default: mod.ProductReviews,
    })),
  {
    loading: () => (
      <div className="h-48 animate-pulse rounded-lg bg-neutral-100" />
    ),
  },
);

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
  const showBelowFold = useInView(belowFoldRef, "200px 0px", Boolean(data));

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
    return <p className="text-sm text-neutral-600">{t.product.loading}</p>;
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

  const image = data.images?.[0] ?? data.thumbnail;
  const discount = data.discountPercentage;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={image}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <Link
            href={`/${locale}/search`}
            className="text-sm text-neutral-600 underline"
          >
            {t.product.backToSearch}
          </Link>
          {(data.brand || data.category) && (
            <p className="text-sm uppercase tracking-wide text-neutral-500">
              {[data.brand, data.category].filter(Boolean).join(" · ")}
            </p>
          )}
          <h1 className="text-3xl font-semibold text-neutral-900">
            {data.title}
          </h1>
          {data.rating !== undefined ? (
            <div className="flex items-center gap-2">
              <StarRating rating={data.rating} readOnly color="warning" />
              <span className="text-sm text-neutral-600">
                {data.rating.toFixed(2)}
              </span>
            </div>
          ) : null}
          <div className="flex flex-wrap items-baseline gap-3">
            <p className="text-xl text-primary">{format(data.price)}</p>
            {discount !== undefined && discount > 0 ? (
              <p className="text-sm text-neutral-500">
                {t.product.discount.replace(
                  "{value}",
                  discount.toFixed(0),
                )}
              </p>
            ) : null}
          </div>
          {data.availabilityStatus || data.stock !== undefined ? (
            <p className="text-sm text-neutral-600">
              {data.availabilityStatus ??
                `${t.product.stock}: ${data.stock}`}
            </p>
          ) : null}
          <p className="text-neutral-600">{data.description}</p>
          <Button
            type="button"
            variant="primary"
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

      <div ref={belowFoldRef} className="flex min-h-32 flex-col gap-10">
        {showBelowFold ? (
          <>
            <ProductSpecs locale={locale} product={data} />
            <ProductReviews locale={locale} reviews={data.reviews ?? []} />
          </>
        ) : (
          <div className="h-32 animate-pulse rounded-lg bg-neutral-100" />
        )}
      </div>
    </div>
  );
};
