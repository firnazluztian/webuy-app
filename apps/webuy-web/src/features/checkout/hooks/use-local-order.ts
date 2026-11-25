'use client';

import { useEffect, useState } from 'react';
import { ORDERS_STORAGE_KEY } from '@/features/checkout/constants';
import type { LocalOrder } from '@/features/checkout/schema';

export function listLocalOrders(): LocalOrder[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as LocalOrder[];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: LocalOrder): void {
  if (typeof window === 'undefined') {
    return;
  }
  const existing = listLocalOrders();
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([order, ...existing]));
}

export function getLocalOrder(id: string): LocalOrder | undefined {
  return listLocalOrders().find((order) => order.id === id);
}

export function useLocalOrder(orderId: string) {
  const [order, setOrder] = useState<LocalOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrder(orderId ? (getLocalOrder(orderId) ?? null) : null);
  }, [orderId]);

  return order;
}
