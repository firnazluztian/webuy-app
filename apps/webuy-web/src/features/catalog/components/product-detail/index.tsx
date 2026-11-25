'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@kiichan/design-system';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import { useProduct } from '@/features/catalog/hooks/use-products';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { convertFromBase, formatMoney, getMarket } from '@/i18n/markets';
import type { Locale } from '@/i18n/types';
import { trackAddToCart, trackViewItem } from '@/lib/gtm';

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
  const currency = getMarket(locale).currency;

  useEffect(() => {
    if (!data) {
      return;
    }
    trackViewItem({
      itemId: String(data.id),
      itemName: data.title,
      value: convertFromBase(data.price, locale),
      currency,
    });
  }, [currency, data, locale]);

  if (isLoading) {
    return <p className="text-sm text-neutral-600">{t.product.loading}</p>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-red-600">{t.product.notFound}</p>
        <button type="button" className="text-sm text-primary underline" onClick={() => refetch()}>
          {t.common.retry}
        </button>
        <Link href={`/${locale}/search`} className="text-sm text-neutral-700 underline">
          {t.product.backToSearch}
        </Link>
      </div>
    );
  }

  const image = data.images?.[0] ?? data.thumbnail;

  return (
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
        <Link href={`/${locale}/search`} className="text-sm text-neutral-600 underline">
          {t.product.backToSearch}
        </Link>
        <h1 className="text-3xl font-semibold text-neutral-900">{data.title}</h1>
        <p className="text-xl text-primary">{formatMoney(data.price, locale)}</p>
        <p className="text-neutral-600">{data.description}</p>
        <Button
          type="button"
          variant="primary"
          size="md"
          rounded="xl"
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
              value: convertFromBase(data.price, locale),
              currency,
            });
            setAdded(true);
          }}
        >
          {added ? t.product.added : t.product.addToCart}
        </Button>
      </div>
    </div>
  );
};
