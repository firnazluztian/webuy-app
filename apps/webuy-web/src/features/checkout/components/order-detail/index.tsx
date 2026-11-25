'use client';

import Link from 'next/link';
import { useLocalOrder } from '@/features/checkout/hooks/use-local-order';
import type { OrderDetailProps } from '@/features/checkout/types';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';

export const OrderDetail = ({ locale, orderId }: OrderDetailProps) => {
  const t = useTranslations(locale);
  const order = useLocalOrder(orderId);
  const { format } = useFormatMoney();

  if (order === undefined) {
    return <p className="text-sm text-neutral-600">{t.common.loading}</p>;
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-neutral-600">{t.order.notFound}</p>
        <Link href={`/${locale}`} className="text-primary underline">
          {t.order.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="text-3xl font-semibold">
        {t.order.title} {order.id}
      </h1>
      <p className="text-sm text-neutral-600">
        {t.order.status}: {order.status}
      </p>
      <ul className="flex flex-col gap-2 border-t border-neutral-200 pt-4">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between text-sm">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>{format(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="text-lg font-medium">
        {t.order.total}: {format(order.baseTotal)}
      </p>
      <Link href={`/${locale}`} className="text-primary underline">
        {t.order.backHome}
      </Link>
    </div>
  );
};
