import type { Locale } from '@/i18n/types';

export interface CartLine {
  productId: number;
  title: string;
  imageUrl: string;
  /** Catalog unit price (base) — converted per market for display. */
  basePrice: number;
  quantity: number;
}

export interface CartProps {
  locale: Locale;
}
