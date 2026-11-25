'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@kiichan/design-system';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import type { CartProps } from '@/features/cart/types';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import { trackBeginCheckout } from '@/lib/gtm';

export const Cart = ({ locale }: CartProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotalBase = useCartStore((state) => state.subtotalBase());
  const { format, convert, currency } = useFormatMoney();

  if (lines.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{t.cart.title}</h1>
        <p className="text-neutral-600">{t.cart.empty}</p>
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => router.push(`/${locale}`)}
        >
          {t.cart.continueShopping}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold">{t.cart.title}</h1>
      <ul className="flex flex-col gap-4">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 border-b border-neutral-200 pb-4">
            <div className="relative aspect-square w-20 shrink-0 overflow-hidden bg-neutral-100 rounded-lg">
              <Image src={line.imageUrl} alt={line.title} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/${locale}/products/${line.productId}`} className="font-medium">
                  {line.title}
                </Link>
                <p className="text-lg text-primary">
                  {format(line.basePrice * line.quantity)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    isIconOnly
                    leftIcon="mdi:chevron-left"
                    aria-label={`${t.cart.quantity} -`}
                    onClick={() =>
                      setQuantity(line.productId, Math.max(1, line.quantity - 1))
                    }
                  />
                  <p className="w-10 mx-auto text-center p-0 m-0">{line.quantity}</p>
                  <Button
                    type="button"
                    variant="outline"
                    isIconOnly
                    leftIcon="mdi:chevron-right"
                    aria-label={`${t.cart.quantity} +`}
                    onClick={() => setQuantity(line.productId, line.quantity + 1)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  leftIcon="mdi:trash-can-outline"
                  aria-label={t.cart.remove}
                  onClick={() => removeItem(line.productId)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">
          {t.cart.subtotal}: {format(subtotalBase)}
        </p>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            trackBeginCheckout({
              value: convert(subtotalBase),
              currency,
            });
            router.push(`/${locale}/checkout`);
          }}
        >
          {t.cart.checkout}
        </Button>
      </div>
    </div>
  );
};
