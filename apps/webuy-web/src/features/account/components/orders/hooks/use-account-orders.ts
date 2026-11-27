'use client';

import { useMemo } from 'react';
import { DUMMY_ACCOUNT_ORDERS } from '@/features/account/components/orders/constants';
import type { AccountOrder } from '@/features/account/types';
import { listLocalOrders } from '@/features/checkout/hooks/use-local-order';
import type { LocalOrder } from '@/features/checkout/schema';
import { getKiichanImage } from '@/lib/kiichan/images';

const LOCAL_ORDER_THUMBNAIL = getKiichanImage('sparkle');

function mapLocalOrder(order: LocalOrder): AccountOrder {
  return {
    id: order.id,
    status: 'delivered',
    currency: order.currency,
    amount: order.amount,
    placedAt: order.createdAt,
    items: order.items.map((item) => ({
      productId: item.productId,
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      thumbnail: LOCAL_ORDER_THUMBNAIL,
    })),
  };
}

export function useAccountOrders(): AccountOrder[] {
  return useMemo(() => {
    const local = listLocalOrders().map(mapLocalOrder);
    if (local.length === 0) {
      return DUMMY_ACCOUNT_ORDERS;
    }
    return [...local, ...DUMMY_ACCOUNT_ORDERS];
  }, []);
}
