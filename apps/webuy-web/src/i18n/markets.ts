import type { CurrencyCode, MarketId } from './types';

export interface MarketConfig {
  id: MarketId;
  label: string;
  currency: CurrencyCode;
  intlLocale: string;
  /** Static display FX from catalog base price — not live market rates. */
  fxFromBase: number;
}

export const marketIds = ['singapore', 'south_korea', 'indonesia'] as const satisfies readonly MarketId[];

export const markets: Record<MarketId, MarketConfig> = {
  singapore: {
    id: 'singapore',
    label: 'Singapore',
    currency: 'SGD',
    intlLocale: 'en-SG',
    fxFromBase: 1.35,
  },
  south_korea: {
    id: 'south_korea',
    label: 'South Korea',
    currency: 'KRW',
    intlLocale: 'ko-KR',
    fxFromBase: 1350,
  },
  indonesia: {
    id: 'indonesia',
    label: 'Indonesia',
    currency: 'IDR',
    intlLocale: 'id-ID',
    fxFromBase: 16_000,
  },
};

export const defaultMarketId: MarketId = 'singapore';

export function isMarketId(value: string): value is MarketId {
  return (marketIds as readonly string[]).includes(value);
}

export function getMarket(marketId: MarketId): MarketConfig {
  return markets[marketId];
}

export function convertFromBase(amountBase: number, marketId: MarketId): number {
  const { fxFromBase, currency } = getMarket(marketId);
  const converted = amountBase * fxFromBase;
  if (currency === 'KRW' || currency === 'IDR') {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/** @deprecated Prefer convertFromBase — alias kept for gradual renames. */
export const convertFromSgd = convertFromBase;

export function formatMoney(amountBase: number, marketId: MarketId): string {
  const market = getMarket(marketId);
  const value = convertFromBase(amountBase, marketId);
  return new Intl.NumberFormat(market.intlLocale, {
    style: 'currency',
    currency: market.currency,
  }).format(value);
}
