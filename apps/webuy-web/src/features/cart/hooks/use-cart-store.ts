'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartLine } from '@/features/cart/types';

interface CartState {
  lines: CartLine[];
  addItem: (item: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  totalQuantity: () => number;
  subtotalBase: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.lines.find((line) => line.productId === item.productId);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.productId === item.productId
                  ? { ...line, quantity: line.quantity + quantity }
                  : line
              ),
            };
          }
          return { lines: [...state.lines, { ...item, quantity }] };
        });
      },
      setQuantity: (productId, quantity) => {
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.productId !== productId)
              : state.lines.map((line) =>
                  line.productId === productId ? { ...line, quantity } : line
                ),
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          lines: state.lines.filter((line) => line.productId !== productId),
        }));
      },
      clear: () => set({ lines: [] }),
      totalQuantity: () => get().lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotalBase: () =>
        get().lines.reduce((sum, line) => sum + line.basePrice * line.quantity, 0),
    }),
    { name: 'webuy-cart-v2' }
  )
);
