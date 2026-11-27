'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@kiichan/design-system';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import type { Locale } from '@/i18n/types';
import type { Product } from '@/lib/schemas';

export const ProductCard = ({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) => {
  const { format } = useFormatMoney();

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group flex flex-col gap-3 p-0"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-neutral-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="rounded-3xl object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {product.brand ? (
          <p className="text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
            {product.brand}
          </p>
        ) : null}
        <h3 className="text-sm font-medium leading-snug text-neutral-900">
          {product.title}
        </h3>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-neutral-900">
            {format(product.price)}
          </p>
          {product.rating !== undefined ? (
            <p className="flex items-center gap-1 text-xs text-neutral-600">
              <Icon icon="mdi:star" className="h-3.5 w-3.5 text-primary" />
              {product.rating.toFixed(1)}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};
