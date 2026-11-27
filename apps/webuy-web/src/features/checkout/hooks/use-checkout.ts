'use client';

import { useState } from 'react';
import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import {
  getLocalOrder,
  saveLocalOrder,
  updateLocalOrder,
} from '@/features/checkout/hooks/use-local-order';
import {
  checkoutFormSchema,
  type CheckoutFormValues,
  type LocalOrder,
} from '@/features/checkout/schema';
import {
  discountFromVoucher,
  findVoucher,
  type CheckoutVoucher,
} from '@/features/checkout/vouchers';
import { useMarketStore } from '@/features/shell/hooks/use-market-store';
import { convertFromBase, getMarket } from '@/i18n/markets';
import type { Locale } from '@/i18n/types';
import { trackPurchase } from '@/lib/gtm';

export type CheckoutFieldErrors = Partial<
  Record<keyof CheckoutFormValues, string>
>;

export interface CheckoutErrorMessages {
  customerName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StartPaymentOptions {
  values: CheckoutFormValues;
  errorMessages: CheckoutErrorMessages;
  voucher: CheckoutVoucher | null;
  customerEmail?: string;
  phone?: string;
}

export function useCheckout(locale: Locale) {
  const lines = useCartStore((state) => state.lines);
  const subtotalBase = useCartStore((state) => state.subtotalBase());
  const clear = useCartStore((state) => state.clear);
  const marketId = useMarketStore((state) => state.marketId);
  const [pending, setPending] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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

  function buildOrder(
    values: CheckoutFormValues,
    voucher: CheckoutVoucher | null,
    phone?: string
  ): LocalOrder {
    const discountBase = discountFromVoucher(subtotalBase, voucher);
    const totalBase = Math.max(0, subtotalBase - discountBase);
    const market = getMarket(marketId);

    return {
      id: `ord-${Date.now().toString(36)}`,
      status: 'pending',
      currency: market.currency,
      amount: convertFromBase(totalBase, marketId),
      baseTotal: totalBase,
      subtotalBase,
      discountBase,
      voucherCode: voucher?.code,
      locale,
      customerName: values.customerName,
      address: values.address,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      phone,
      items: lines.map((line) => ({
        productId: line.productId,
        title: line.title,
        quantity: line.quantity,
        unitPrice: line.basePrice,
        imageUrl: line.imageUrl,
      })),
      createdAt: new Date().toISOString(),
    };
  }

  async function startPayment({
    values,
    errorMessages,
    voucher,
    customerEmail,
    phone,
  }: StartPaymentOptions): Promise<boolean> {
    const parsed = checkoutFormSchema.safeParse({
      customerName: values.customerName.trim(),
      address: values.address.trim(),
      city: values.city.trim(),
      state: values.state.trim(),
      postalCode: values.postalCode.trim(),
      country: values.country.trim(),
    });

    if (!parsed.success) {
      const next: CheckoutFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (
          key === 'customerName' ||
          key === 'address' ||
          key === 'city' ||
          key === 'state' ||
          key === 'postalCode' ||
          key === 'country'
        ) {
          next[key] = errorMessages[key];
        }
      }
      setFieldErrors(next);
      return false;
    }

    setFieldErrors({});
    setPaymentError(null);
    setPending(true);

    const order = buildOrder(parsed.data, voucher, phone);
    saveLocalOrder(order);

    const pieceCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const lineSummary =
      pieceCount === 1
        ? lines[0]?.title.slice(0, 100) || 'KiichanMart order'
        : `KiichanMart · ${pieceCount} pieces`;

    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          locale,
          currency: order.currency,
          amount: order.amount,
          customerEmail,
          customerName: order.customerName,
          lineSummary,
        }),
      });

      const payload = (await response.json()) as {
        url?: string;
        sessionId?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok || !payload.url) {
        updateLocalOrder(order.id, { status: 'cancelled' });
        setPaymentError(payload.error || 'Payment could not be started.');
        setPending(false);
        return false;
      }

      if (payload.sessionId) {
        updateLocalOrder(order.id, { stripeSessionId: payload.sessionId });
      }

      window.location.assign(payload.url);
      return true;
    } catch {
      updateLocalOrder(order.id, { status: 'cancelled' });
      setPaymentError('Payment could not be started. Try again.');
      setPending(false);
      return false;
    }
  }

  function finalizePaidOrder(orderId: string): LocalOrder | undefined {
    const existing = getLocalOrder(orderId);
    if (!existing) {
      return undefined;
    }
    if (existing.status === 'success') {
      return existing;
    }

    const finalized = updateLocalOrder(orderId, { status: 'success' });
    if (!finalized) {
      return undefined;
    }

    trackPurchase({
      transactionId: finalized.id,
      value: finalized.amount,
      currency: finalized.currency,
    });
    clear();
    return finalized;
  }

  function cancelPendingOrder(orderId: string) {
    updateLocalOrder(orderId, { status: 'cancelled' });
  }

  return {
    lines,
    subtotalBase,
    pending,
    paymentError,
    isEmpty: lines.length === 0,
    fieldErrors,
    clearFieldError,
    startPayment,
    finalizePaidOrder,
    cancelPendingOrder,
    findVoucher,
    discountFromVoucher,
  };
}
