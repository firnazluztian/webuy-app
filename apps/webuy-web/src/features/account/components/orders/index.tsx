'use client';

import Image from 'next/image';
import { Chip, Text } from '@kiichan/design-system';
import { useAccountOrders } from '@/features/account/components/orders/hooks/use-account-orders';
import type { OrderStatus } from '@/features/account/types';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

interface AccountOrdersProps {
  locale: Locale;
}

const STATUS_COLOR: Record<
  OrderStatus,
  'success' | 'info' | 'warning' | 'danger'
> = {
  delivered: 'success',
  shipped: 'info',
  processing: 'warning',
  cancelled: 'danger',
};

function formatMoney(amount: number, currency: string, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(iso));
}

export const AccountOrders = ({ locale }: AccountOrdersProps) => {
  const t = useTranslations(locale);
  const orders = useAccountOrders();

  const statusLabel: Record<OrderStatus, string> = {
    delivered: t.account.orderStatusDelivered,
    shipped: t.account.orderStatusShipped,
    processing: t.account.orderStatusProcessing,
    cancelled: t.account.orderStatusCancelled,
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <Text variant="heading3">{t.account.ordersTitle}</Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.ordersEmpty}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="heading3">{t.account.ordersTitle}</Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.ordersSubtitle}
        </Text>
      </div>

      <ul className="flex flex-col gap-4">
        {orders.map((order) => (
          <li
            key={order.id}
            className="flex min-w-0 flex-col gap-3 border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex flex-col gap-0.5">
                <Text variant="subtitle2" className="truncate text-neutral-900">
                  {t.account.orderIdLabel} {order.id}
                </Text>
                <Text variant="caption" className="text-neutral-500">
                  {t.account.orderPlacedLabel}{' '}
                  {formatDate(order.placedAt, locale)}
                </Text>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
                <Chip variant="soft" color={STATUS_COLOR[order.status]}>
                  {statusLabel[order.status]}
                </Chip>
                <Text variant="subtitle2" className="text-neutral-900">
                  {formatMoney(order.amount, order.currency, locale)}
                </Text>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {order.items.map((item) => (
                <li
                  key={`${order.id}-${item.productId}`}
                  className="flex min-w-0 gap-3"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="rounded-lg object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex flex-1 flex-col justify-center gap-0.5">
                    <Text variant="body2" className="truncate text-neutral-800">
                      {item.title}
                    </Text>
                    <Text variant="caption" className="text-neutral-500">
                      {t.account.orderQtyLabel} {item.quantity} ·{' '}
                      {formatMoney(item.unitPrice, order.currency, locale)}
                    </Text>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
