'use client';

import { useCartStore } from '@/features/cart/hooks/use-cart-store';
import { usePersistHydrated } from '@/features/shell/hooks/use-persist-hydrated';

export function useCartHydrated(): boolean {
  return usePersistHydrated(useCartStore.persist);
}
