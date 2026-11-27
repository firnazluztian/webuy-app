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

function writeOrders(orders: LocalOrder[]): void {
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function saveLocalOrder(order: LocalOrder): void {
  if (typeof window === 'undefined') {
    return;
  }
  const existing = listLocalOrders().filter((item) => item.id !== order.id);
  writeOrders([order, ...existing]);
}

export function updateLocalOrder(
  orderId: string,
  patch: Partial<LocalOrder>
): LocalOrder | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const orders = listLocalOrders();
  const index = orders.findIndex((item) => item.id === orderId);
  if (index < 0) {
    return undefined;
  }
  const next = { ...orders[index], ...patch } as LocalOrder;
  const copy = [...orders];
  copy[index] = next;
  writeOrders(copy);
  return next;
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
