'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import { PAYMENT_PROCESSING_MS } from '@/features/checkout/constants';
import { saveLocalOrder } from '@/features/checkout/hooks/use-local-order';
import {
  checkoutFormSchema,
  type CheckoutFormValues,
  type LocalOrder,
} from '@/features/checkout/schema';
import { useMarketStore } from '@/features/shell/hooks/use-market-store';
import { convertFromBase, getMarket } from '@/i18n/markets';
import type { Locale } from '@/i18n/types';
import { trackPurchase } from '@/lib/gtm';

export type CheckoutFieldErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export interface CheckoutErrorMessages {
  customerName: string;
  address: string;
  city: string;
}

export function useCheckout(locale: Locale) {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const subtotalBase = useCartStore((state) => state.subtotalBase());
  const clear = useCartStore((state) => state.clear);
  const marketId = useMarketStore((state) => state.marketId);
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});

  function clearFieldError(field: keyof CheckoutFormValues) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function placeOrder(values: CheckoutFormValues, errorMessages: CheckoutErrorMessages): boolean {
    const parsed = checkoutFormSchema.safeParse({
      customerName: values.customerName.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
    });

    if (!parsed.success) {
      const next: CheckoutFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (key === 'customerName' || key === 'address' || key === 'city') {
          next[key] = errorMessages[key];
        }
      }
      setFieldErrors(next);
      return false;
    }

    setFieldErrors({});
    setPending(true);
    const market = getMarket(marketId);
    const order: LocalOrder = {
      id: `ord-${Date.now().toString(36)}`,
      status: 'success',
      currency: market.currency,
      amount: convertFromBase(subtotalBase, marketId),
      baseTotal: subtotalBase,
      locale,
      customerName: parsed.data.customerName,
      address: parsed.data.address,
      city: parsed.data.city,
      items: lines.map((line) => ({
        productId: line.productId,
        title: line.title,
        quantity: line.quantity,
        unitPrice: line.basePrice,
      })),
      createdAt: new Date().toISOString(),
    };

    window.setTimeout(() => {
      saveLocalOrder(order);
      trackPurchase({
        transactionId: order.id,
        value: order.amount,
        currency: order.currency,
      });
      clear();
      router.push(`/${locale}/payment?orderId=${order.id}`);
    }, PAYMENT_PROCESSING_MS);

    return true;
  }

  return {
    lines,
    subtotalBase,
    pending,
    isEmpty: lines.length === 0,
    fieldErrors,
    clearFieldError,
    placeOrder,
  };
}
