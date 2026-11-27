'use client';

import Link from 'next/link';
import { useLocalOrder } from '@/features/checkout/hooks/use-local-order';
import type { PaymentResultProps } from '@/features/checkout/types';
import { PageSectionSkeleton } from '@/features/shell/components/loading/page-section-skeleton';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';

export const PaymentResult = ({ locale, orderId }: PaymentResultProps) => {
  const t = useTranslations(locale);
  const order = useLocalOrder(orderId);
  const { format } = useFormatMoney();

  if (order === undefined) {
    return <PageSectionSkeleton rows={3} />;
  }

  if (!order) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">{t.payment.failedTitle}</h1>
        <Link href={`/${locale}`} className="text-primary underline">
          {t.order.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <h1 className="text-3xl font-semibold text-primary">{t.payment.successTitle}</h1>
      <p className="text-neutral-600">{t.payment.successBody}</p>
      <p className="text-sm text-neutral-700">
        {t.order.title} {order.id}
      </p>
      <p className="text-lg font-medium">
        {t.order.total}: {format(order.baseTotal)}
      </p>
      <Link href={`/${locale}/orders/${order.id}`} className="text-primary underline">
        {t.payment.viewOrder}
      </Link>
    </div>
  );
};
