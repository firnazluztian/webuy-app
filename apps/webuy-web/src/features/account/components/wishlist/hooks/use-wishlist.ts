'use client';

import { useState } from 'react';
import { DUMMY_WISHLIST } from '@/features/account/components/wishlist/constants';
import type { WishlistItem } from '@/features/account/types';

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(DUMMY_WISHLIST);

  const removeItem = (productId: number) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  };

  return { items, removeItem };
}
