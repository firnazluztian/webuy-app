'use client';

import { Button, Input, Text } from '@kiichan/design-system';
import {
  CHECKOUT_VOUCHERS,
  type CheckoutVoucher,
} from '@/features/checkout/vouchers';
import type { Messages } from '@/i18n/types';

interface VoucherSectionProps {
  copy: Messages['checkout']['vouchers'];
  voucherInput: string;
  appliedVoucher: CheckoutVoucher | null;
  voucherError: string | null;
  onInputChange: (value: string) => void;
  onApply: (code: string) => void;
  onRemove: () => void;
}

export const VoucherSection = ({
  copy,
  voucherInput,
  appliedVoucher,
  voucherError,
  onInputChange,
  onApply,
  onRemove,
}: VoucherSectionProps) => {
  const voucherCopy = {
    welcome: copy.welcome,
    luxe: copy.luxe,
    kiichan: copy.kiichan,
  } as const;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white/90 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <Text
          variant="caption"
          className="uppercase tracking-[0.2em] text-neutral-500"
        >
          {copy.title}
        </Text>
        <Text variant="body2" className="text-neutral-500">
          {copy.hint}
        </Text>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            label={copy.placeholder}
            name="voucher"
            value={voucherInput}
            onChange={(event) => onInputChange(event.target.value.toUpperCase())}
            error={Boolean(voucherError)}
            errorText={voucherError ?? undefined}
            fullWidth
          />
        </div>
        {appliedVoucher ? (
          <Button type="button" variant="outline" onClick={onRemove}>
            {copy.remove}
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline-primary"
            onClick={() => onApply(voucherInput)}
          >
            {copy.apply}
          </Button>
        )}
      </div>

      {appliedVoucher ? (
        <p className="text-sm text-success-700">
          {copy.applied}: {voucherCopy[appliedVoucher.labelKey]}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2">
        {CHECKOUT_VOUCHERS.map((voucher) => {
          const selected = appliedVoucher?.code === voucher.code;
          return (
            <li key={voucher.code}>
              <button
                type="button"
                onClick={() => onApply(voucher.code)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition ${
                  selected
                    ? 'bg-primary-50 ring-1 ring-primary-200'
                    : 'bg-neutral-50 hover:bg-primary-50/70'
                }`}
              >
                <span className="min-w-0 flex flex-col gap-0.5">
                  <span className="text-sm font-medium tracking-wide text-neutral-900">
                    {voucher.code}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {voucherCopy[voucher.labelKey]}
                  </span>
                </span>
                <span className="shrink-0 text-xs font-medium uppercase tracking-[0.14em] text-primary">
                  −{voucher.value}%
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
