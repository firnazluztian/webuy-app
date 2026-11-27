'use client';

import { useMarketHydrated } from '@/features/shell/hooks/use-market-hydrated';
import { useMarketStore } from '@/features/shell/hooks/use-market-store';
import {
  convertFromBase,
  defaultMarketId,
  formatMoney,
  getMarket,
} from '@/i18n/markets';
import type { MarketId } from '@/i18n/types';

export function useFormatMoney() {
  const hydrated = useMarketHydrated();
  const persistedId = useMarketStore((state) => state.marketId);
  const marketId = hydrated ? persistedId : defaultMarketId;
  const market = getMarket(marketId);

  return {
    marketId,
    market,
    currency: market.currency,
    format: (amountBase: number) => formatMoney(amountBase, marketId),
    convert: (amountBase: number) => convertFromBase(amountBase, marketId),
  };
}

export function useMarketId(): MarketId {
  const hydrated = useMarketHydrated();
  const persistedId = useMarketStore((state) => state.marketId);
  return hydrated ? persistedId : defaultMarketId;
}
