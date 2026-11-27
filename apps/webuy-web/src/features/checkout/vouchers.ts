export type VoucherType = 'percent';

export interface CheckoutVoucher {
  code: string;
  type: VoucherType;
  /** Percent off subtotal (0–100). */
  value: number;
  /** Message key suffix under checkout.vouchers.* */
  labelKey: 'welcome' | 'luxe' | 'kiichan';
}

/** Curated showcase vouchers — client-side only for the demo checkout. */
export const CHECKOUT_VOUCHERS: readonly CheckoutVoucher[] = [
  { code: 'WELCOME10', type: 'percent', value: 10, labelKey: 'welcome' },
  { code: 'LUXE15', type: 'percent', value: 15, labelKey: 'luxe' },
  { code: 'KIICHAN', type: 'percent', value: 8, labelKey: 'kiichan' },
] as const;

export function findVoucher(code: string): CheckoutVoucher | undefined {
  const normalized = code.trim().toUpperCase();
  return CHECKOUT_VOUCHERS.find((voucher) => voucher.code === normalized);
}

export function discountFromVoucher(
  subtotalBase: number,
  voucher: CheckoutVoucher | null
): number {
  if (!voucher || subtotalBase <= 0) {
    return 0;
  }
  if (voucher.type === 'percent') {
    return Math.round(subtotalBase * (voucher.value / 100) * 100) / 100;
  }
  return 0;
}
