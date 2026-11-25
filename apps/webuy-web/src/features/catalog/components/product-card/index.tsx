"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@kiichan/design-system";
import { useFormatMoney } from "@/features/shell/hooks/use-format-money";
import type { Locale } from "@/i18n/types";
import type { Product } from "@/lib/schemas";

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
      <div className="relative aspect-square overflow-hidden rounded-xl hover:bg-primary-100 bg-primary-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-neutral-900">
          {product.title}
        </h3>
        <p className="text-dark font-medium">{format(product.price)}</p>
        <p className="text-sm text-dark flex items-center gap-1">
          <Icon icon="mdi:star" className="w-4 h-4 text-primary" />
          {product.rating}
        </p>
      </div>
    </Link>
  );
};
