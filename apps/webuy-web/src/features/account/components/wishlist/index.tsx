'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button, Chip, Text } from '@kiichan/design-system';
import { useWishlist } from '@/features/account/components/wishlist/hooks/use-wishlist';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

interface AccountWishlistProps {
  locale: Locale;
}

function formatMoney(amount: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export const AccountWishlist = ({ locale }: AccountWishlistProps) => {
  const t = useTranslations(locale);
  const { items, removeItem } = useWishlist();

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="heading3">{t.account.wishlistTitle}</Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.wishlistSubtitle}
        </Text>
      </div>

      {items.length === 0 ? (
        <Text variant="body2" className="text-neutral-500">
          {t.account.wishlistEmpty}
        </Text>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex min-w-0 flex-col gap-3 rounded-2xl bg-primary-50 p-3 sm:flex-row sm:items-center sm:p-4"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex flex-1 flex-col gap-1">
                  <Link
                    href={`/${locale}/products/${item.productId}`}
                    className="truncate text-sm font-medium text-neutral-900 underline-offset-2 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2">
                    <Text variant="subtitle2">
                      {formatMoney(item.price, item.currency, locale)}
                    </Text>
                    <Chip
                      variant="soft"
                      color={item.inStock ? 'success' : 'warning'}
                    >
                      {item.inStock
                        ? t.account.wishlistInStock
                        : t.account.wishlistOutOfStock}
                    </Chip>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline-danger"
                leftIcon="mdi:heart-off-outline"
                fullWidth
                className="sm:w-auto"
                onClick={() => removeItem(item.productId)}
              >
                {t.account.wishlistRemove}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
