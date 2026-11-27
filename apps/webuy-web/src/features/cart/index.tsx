'use client';

import { Button, NegativeCase, Text } from '@kiichan/design-system';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartHydrated } from '@/features/cart/hooks/use-cart-hydrated';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import type { CartProps } from '@/features/cart/types';
import { CartSkeleton } from '@/features/shell/components/loading/cart-skeleton';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { trackBeginCheckout } from '@/lib/gtm';
import { getNegativeCaseImage } from '@/lib/kiichan/images';

export const Cart = ({ locale }: CartProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const cartHydrated = useCartHydrated();
  const lines = useCartStore((state) => state.lines);
  const pieceCount = useCartStore((state) => state.totalQuantity());
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotalBase = useCartStore((state) => state.subtotalBase());
  const { format, convert, currency } = useFormatMoney();

  const continueShopping = () => {
    router.push(`/${locale}`);
  };

  if (!cartHydrated) {
    return <CartSkeleton title={t.cart.title} />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2">
        <Text variant="heading2" as="h1" className="text-center">
          {t.cart.title}
        </Text>
        <NegativeCase
          variant="no-order"
          customImage={getNegativeCaseImage('no-order')}
          customMessage={
            <span className="flex flex-col gap-1">
              <Text variant="subtitle1">{t.cart.empty}</Text>
              <Text variant="body2" className="text-neutral-500">
                {t.cart.emptyHint}
              </Text>
            </span>
          }
          reloadText={t.cart.continueShopping}
          reload={continueShopping}
          className="w-full px-0"
        />
      </div>
    );
  }

  const checkout = () => {
    trackBeginCheckout({
      value: convert(subtotalBase),
      currency,
    });
    router.push(`/${locale}/checkout`);
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex flex-col gap-1">
        <Text variant="heading2" as="h1">
          {t.cart.title}
        </Text>
        <Text variant="body2" className="text-neutral-500">
          {pieceCount === 1
            ? t.cart.itemCountOne
            : t.cart.itemCount.replace('{count}', String(pieceCount))}
        </Text>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
        <ul className="flex min-w-0 flex-col gap-3">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex min-w-0 gap-3 rounded-2xl bg-primary-50 p-3 sm:gap-4 sm:p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white sm:h-28 sm:w-28">
                <Image
                  src={line.imageUrl}
                  alt={line.title}
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex flex-col gap-0.5">
                    <Link
                      href={`/${locale}/products/${line.productId}`}
                      className="truncate text-sm font-medium text-neutral-900 sm:text-base"
                    >
                      {line.title}
                    </Link>
                    <Text variant="caption" className="text-neutral-500">
                      {format(line.basePrice)}
                    </Text>
                  </div>
                  <Text
                    variant="subtitle1"
                    className="shrink-0 text-primary"
                  >
                    {format(line.basePrice * line.quantity)}
                  </Text>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      isIconOnly
                      leftIcon="mdi:minus"
                      aria-label={`${t.cart.quantity} -`}
                      onClick={() =>
                        setQuantity(
                          line.productId,
                          Math.max(1, line.quantity - 1)
                        )
                      }
                    />
                    <Text
                      variant="subtitle2"
                      className="w-8 text-center text-neutral-900"
                    >
                      {line.quantity}
                    </Text>
                    <Button
                      type="button"
                      variant="outline"
                      isIconOnly
                      leftIcon="mdi:plus"
                      aria-label={`${t.cart.quantity} +`}
                      onClick={() =>
                        setQuantity(line.productId, line.quantity + 1)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    isIconOnly
                    leftIcon="mdi:trash-can-outline"
                    aria-label={t.cart.remove}
                    onClick={() => removeItem(line.productId)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="flex flex-col gap-5 rounded-2xl border border-primary-100 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
          <Text
            variant="caption"
            className="uppercase tracking-[0.18em] text-neutral-500"
          >
            {t.cart.summary}
          </Text>
          <div className="flex items-baseline justify-between gap-4">
            <Text variant="body2" className="text-neutral-600">
              {t.cart.subtotal}
            </Text>
            <Text variant="heading4" className="text-primary">
              {format(subtotalBase)}
            </Text>
          </div>
          <Button type="button" variant="primary" fullWidth onClick={checkout}>
            {t.cart.checkout}
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={continueShopping}
          >
            {t.cart.continueShopping}
          </Button>
        </aside>
      </div>
    </div>
  );
};
