'use client';

import { Button, Text } from '@kiichan/design-system';
import Link from 'next/link';
import { useLocalOrder } from '@/features/checkout/hooks/use-local-order';
import type { OrderDetailProps } from '@/features/checkout/types';
import { PageSectionSkeleton } from '@/features/shell/components/loading/page-section-skeleton';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';

export const OrderDetail = ({ locale, orderId }: OrderDetailProps) => {
  const t = useTranslations(locale);
  const order = useLocalOrder(orderId);
  const { format } = useFormatMoney();

  if (order === undefined) {
    return <PageSectionSkeleton rows={3} />;
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <Text variant="body2" className="text-neutral-600">
          {t.order.notFound}
        </Text>
        <Link href={`/${locale}`}>
          <Button type="button" variant="outline-primary">
            {t.order.backHome}
          </Button>
        </Link>
      </div>
    );
  }

  const shippingLine = [
    order.address,
    [order.city, order.state, order.postalCode].filter(Boolean).join(', '),
    order.country,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="relative mx-auto flex w-full max-w-lg flex-col gap-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-6 -z-10 h-48 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-50),_transparent_70%)]"
      />

      <header className="flex flex-col gap-2">
        <Text
          variant="caption"
          className="uppercase tracking-[0.2em] text-neutral-500"
        >
          {t.order.status}: {order.status}
        </Text>
        <Text variant="heading2" as="h1">
          {t.order.title} {order.id}
        </Text>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl border border-primary-100 bg-white p-5">
        <ul className="flex flex-col gap-3">
          {order.items.map((item) => (
            <li
              key={item.productId}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="min-w-0 text-neutral-700">
                {item.title} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium text-neutral-900">
                {format(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between gap-4 border-t border-primary-50 pt-4">
          <Text variant="body2" className="text-neutral-600">
            {t.order.total}
          </Text>
          <Text variant="heading4" className="text-primary">
            {format(order.baseTotal)}
          </Text>
        </div>
      </section>

      {shippingLine ? (
        <section className="flex flex-col gap-2 rounded-2xl bg-primary-50/80 p-5">
          <Text
            variant="caption"
            className="uppercase tracking-[0.16em] text-neutral-500"
          >
            {t.order.shippingAddress}
          </Text>
          <Text variant="subtitle2" className="text-neutral-900">
            {order.customerName}
          </Text>
          <Text
            variant="body2"
            className="whitespace-pre-line text-neutral-600"
          >
            {shippingLine}
          </Text>
        </section>
      ) : null}

      <Link href={`/${locale}`}>
        <Button type="button" variant="outline" fullWidth>
          {t.order.backHome}
        </Button>
      </Link>
    </div>
  );
};
