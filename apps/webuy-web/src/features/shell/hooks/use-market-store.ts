'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultMarketId } from '@/i18n/markets';
import type { MarketId } from '@/i18n/types';

interface MarketState {
  marketId: MarketId;
  setMarketId: (marketId: MarketId) => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      marketId: defaultMarketId,
      setMarketId: (marketId) => set({ marketId }),
    }),
    { name: 'webuy-market-v1' }
  )
);
