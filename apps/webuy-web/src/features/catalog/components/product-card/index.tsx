import Image from 'next/image';
import Link from 'next/link';
import { formatMoney } from '@/i18n/markets';
import type { Locale } from '@/i18n/types';
import type { Product } from '@/lib/schemas';

export const ProductCard = ({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) => {
  return (
    <Link href={`/${locale}/products/${product.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-neutral-900">{product.title}</h3>
        <p className="text-sm text-primary">{formatMoney(product.price, locale)}</p>
      </div>
    </Link>
  );
};
