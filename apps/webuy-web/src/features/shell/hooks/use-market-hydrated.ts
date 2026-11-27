'use client';

import { useMarketStore } from '@/features/shell/hooks/use-market-store';
import { usePersistHydrated } from '@/features/shell/hooks/use-persist-hydrated';

export function useMarketHydrated(): boolean {
  return usePersistHydrated(useMarketStore.persist);
}
