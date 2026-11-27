'use client';

import { Button, Text } from '@kiichan/design-system';
import Link from 'next/link';
import type { CheckoutVoucher } from '@/features/checkout/vouchers';
import type { Locale, Messages } from '@/i18n/types';

interface OrderSummaryProps {
  locale: Locale;
  copy: Messages['checkout'];
  cartTitle: string;
  processingLabel: string;
  subtotalBase: number;
  discountBase: number;
  totalBase: number;
  appliedVoucher: CheckoutVoucher | null;
  pending: boolean;
  paymentError: string | null;
  format: (amountBase: number) => string;
}

export const OrderSummary = ({
  locale,
  copy,
  cartTitle,
  processingLabel,
  subtotalBase,
  discountBase,
  totalBase,
  appliedVoucher,
  pending,
  paymentError,
  format,
}: OrderSummaryProps) => (
  <aside className="flex flex-col gap-5 rounded-2xl border border-primary-100 bg-white p-5 sm:p-6 lg:sticky lg:top-24">
    <Text
      variant="caption"
      className="uppercase tracking-[0.18em] text-neutral-500"
    >
      {copy.orderSummary}
    </Text>

    <div className="flex flex-col gap-3 border-b border-primary-50 pb-4">
      <div className="flex items-center justify-between gap-4">
        <Text variant="body2" className="text-neutral-600">
          {copy.subtotal}
        </Text>
        <Text variant="body2">{format(subtotalBase)}</Text>
      </div>
      {discountBase > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <Text variant="body2" className="text-neutral-600">
            {copy.discount}
            {appliedVoucher ? ` · ${appliedVoucher.code}` : ''}
          </Text>
          <Text variant="body2" className="text-success-700">
            −{format(discountBase)}
          </Text>
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-4">
        <Text variant="body2" className="text-neutral-600">
          {copy.shipping}
        </Text>
        <Text variant="body2" className="text-neutral-900">
          {copy.shippingComplimentary}
        </Text>
      </div>
    </div>

    <div className="flex items-baseline justify-between gap-4">
      <Text variant="body2" className="text-neutral-600">
        {copy.total}
      </Text>
      <Text variant="heading4" className="text-primary">
        {format(totalBase)}
      </Text>
    </div>

    {paymentError ? (
      <p className="text-sm text-danger-600">
        {paymentError || copy.paymentError}
      </p>
    ) : null}

    <Button
      type="submit"
      variant="primary"
      fullWidth
      disabled={pending}
      isLoading={pending}
    >
      {pending ? processingLabel : copy.continuePayment}
    </Button>

    <ul className="flex flex-col gap-2 text-xs text-neutral-500">
      <li>{copy.secureNote}</li>
      <li>{copy.packagingNote}</li>
      <li>{copy.returnsNote}</li>
    </ul>

    <Link
      href={`/${locale}/cart`}
      className="text-center text-sm text-neutral-500 underline-offset-4 hover:text-primary hover:underline"
    >
      {cartTitle}
    </Link>
  </aside>
);
