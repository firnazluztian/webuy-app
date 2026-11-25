'use client';

import { useMarketStore } from '@/features/shell/hooks/use-market-store';
import { convertFromBase, formatMoney, getMarket } from '@/i18n/markets';
import type { MarketId } from '@/i18n/types';

export function useFormatMoney() {
  const marketId = useMarketStore((state) => state.marketId);
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
  return useMarketStore((state) => state.marketId);
}
