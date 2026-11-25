import type { CurrencyCode } from '@/i18n/types';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushDataLayer(event: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}

export function trackViewItem(payload: {
  itemId: string;
  itemName: string;
  value: number;
  currency: CurrencyCode;
}): void {
  pushDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: payload.currency,
      value: payload.value,
      items: [{ item_id: payload.itemId, item_name: payload.itemName }],
    },
  });
}

export function trackAddToCart(payload: {
  itemId: string;
  itemName: string;
  value: number;
  currency: CurrencyCode;
}): void {
  pushDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: payload.currency,
      value: payload.value,
      items: [{ item_id: payload.itemId, item_name: payload.itemName }],
    },
  });
}

export function trackBeginCheckout(payload: { value: number; currency: CurrencyCode }): void {
  pushDataLayer({
    event: 'begin_checkout',
    ecommerce: { currency: payload.currency, value: payload.value },
  });
}

export function trackPurchase(payload: {
  transactionId: string;
  value: number;
  currency: CurrencyCode;
}): void {
  pushDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: payload.transactionId,
      currency: payload.currency,
      value: payload.value,
    },
  });
}
