import type { CurrencyCode, Locale } from './types';

export interface MarketConfig {
  locale: Locale;
  market: 'singapore' | 'south_korea' | 'indonesia';
  label: string;
  currency: CurrencyCode;
  intlLocale: string;
  /** Static display FX from catalog base price — not live market rates. */
  fxFromBase: number;
}

export const markets: Record<Locale, MarketConfig> = {
  en: {
    locale: 'en',
    market: 'singapore',
    label: 'Singapore (SGD)',
    currency: 'SGD',
    intlLocale: 'en-SG',
    fxFromBase: 1.35,
  },
  ko: {
    locale: 'ko',
    market: 'south_korea',
    label: '한국 (KRW)',
    currency: 'KRW',
    intlLocale: 'ko-KR',
    fxFromBase: 1350,
  },
  id: {
    locale: 'id',
    market: 'indonesia',
    label: 'Indonesia (IDR)',
    currency: 'IDR',
    intlLocale: 'id-ID',
    fxFromBase: 16_000,
  },
};

export function getMarket(locale: Locale): MarketConfig {
  return markets[locale];
}

export function convertFromBase(amountBase: number, locale: Locale): number {
  const { fxFromBase, currency } = getMarket(locale);
  const converted = amountBase * fxFromBase;
  if (currency === 'KRW' || currency === 'IDR') {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/** @deprecated Prefer convertFromBase — alias kept for gradual renames. */
export const convertFromSgd = convertFromBase;

export function formatMoney(amountBase: number, locale: Locale): string {
  const market = getMarket(locale);
  const value = convertFromBase(amountBase, locale);
  return new Intl.NumberFormat(market.intlLocale, {
    style: 'currency',
    currency: market.currency,
  }).format(value);
}
