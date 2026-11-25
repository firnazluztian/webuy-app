import type { Locale } from '@/i18n/types';

export interface CheckoutProps {
  locale: Locale;
}

export interface PaymentResultProps {
  locale: Locale;
  orderId: string;
}

export interface OrderDetailProps {
  locale: Locale;
  orderId: string;
}
