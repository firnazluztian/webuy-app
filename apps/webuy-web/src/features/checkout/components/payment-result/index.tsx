'use client';

import { Button, NegativeCase, Text } from '@kiichan/design-system';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCheckout } from '@/features/checkout/hooks/use-checkout';
import {
  getLocalOrder,
  useLocalOrder,
} from '@/features/checkout/hooks/use-local-order';
import type { LocalOrder } from '@/features/checkout/schema';
import type { PaymentResultProps } from '@/features/checkout/types';
import { PageSectionSkeleton } from '@/features/shell/components/loading/page-section-skeleton';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import {
  getKiichanImage,
  getNegativeCaseImage,
} from '@/lib/kiichan/images';

export const PaymentResult = ({ locale, orderId }: PaymentResultProps) => {
  const t = useTranslations(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const storedOrder = useLocalOrder(orderId);
  const { format } = useFormatMoney();
  const { finalizePaidOrder } = useCheckout(locale);
  const finalizedRef = useRef(false);
  const [order, setOrder] = useState<LocalOrder | null | undefined>(undefined);

  const checkoutState = searchParams.get('checkout');

  useEffect(() => {
    if (!orderId || storedOrder === undefined) {
      return;
    }

    if (checkoutState === 'success' && !finalizedRef.current) {
      finalizedRef.current = true;
      const finalized = finalizePaidOrder(orderId);
      setOrder(finalized ?? getLocalOrder(orderId) ?? null);
      return;
    }

    setOrder(storedOrder);
  }, [checkoutState, finalizePaidOrder, orderId, storedOrder]);

  if (order === undefined) {
    return <PageSectionSkeleton rows={4} />;
  }

  if (!order || order.status !== 'success') {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-2">
        <NegativeCase
          variant="payment-failed"
          customImage={getNegativeCaseImage('payment-failed')}
          customMessage={
            <span className="flex flex-col gap-1">
              <Text variant="subtitle1">{t.payment.failedTitle}</Text>
              <Text variant="body2" className="text-neutral-500">
                {t.payment.failedBody}
              </Text>
            </span>
          }
          reloadText={t.cart.checkout}
          reload={() => router.push(`/${locale}/checkout`)}
          className="w-full px-0"
        />
      </div>
    );
  }

  const shippingLine = [
    order.address,
    [order.city, order.state, order.postalCode].filter(Boolean).join(', '),
    order.country,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center gap-8 py-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-6 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-50),_transparent_68%)]"
      />

      <div className="kiichan-float relative">
        <Image
          src={getKiichanImage('delighted')}
          alt={t.payment.successKiichan}
          width={168}
          height={168}
          priority
          className="mx-auto h-36 w-36 object-contain sm:h-40 sm:w-40"
        />
      </div>

      <div className="flex flex-col gap-3">
        <Text
          variant="caption"
          className="uppercase tracking-[0.28em] text-primary"
        >
          {t.payment.successEyebrow}
        </Text>
        <Text variant="heading2" as="h1" className="text-neutral-900">
          {t.payment.successTitle}
        </Text>
        <Text variant="body1" className="mx-auto max-w-md text-neutral-600">
          {t.payment.successBody}
        </Text>
        <Text variant="caption" className="text-neutral-400">
          {t.payment.successKiichan}
        </Text>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-2xl border border-primary-100 bg-white/95 p-5 text-left sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-primary-50 pb-4">
          <div className="flex flex-col gap-0.5">
            <Text
              variant="caption"
              className="uppercase tracking-[0.16em] text-neutral-500"
            >
              {t.payment.orderLabel}
            </Text>
            <Text variant="subtitle1" className="text-neutral-900">
              {order.id}
            </Text>
          </div>
          <Text variant="heading4" className="text-primary">
            {format(order.baseTotal)}
          </Text>
        </div>

        <ul className="flex flex-col gap-2">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="min-w-0 truncate text-neutral-700">
                {item.title} × {item.quantity}
              </span>
              <span className="shrink-0 text-neutral-900">
                {format(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {shippingLine ? (
          <div className="flex flex-col gap-1 border-t border-primary-50 pt-4">
            <Text
              variant="caption"
              className="uppercase tracking-[0.16em] text-neutral-500"
            >
              {t.payment.shippedTo}
            </Text>
            <Text variant="body2" className="text-neutral-700">
              {order.customerName}
            </Text>
            <Text variant="body2" className="text-neutral-500">
              {shippingLine}
            </Text>
          </div>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={`/${locale}/orders/${order.id}`} className="sm:min-w-44">
          <Button type="button" variant="primary" fullWidth>
            {t.payment.viewOrder}
          </Button>
        </Link>
        <Link href={`/${locale}`} className="sm:min-w-44">
          <Button type="button" variant="outline" fullWidth>
            {t.payment.continueShopping}
          </Button>
        </Link>
      </div>
    </div>
  );
};
