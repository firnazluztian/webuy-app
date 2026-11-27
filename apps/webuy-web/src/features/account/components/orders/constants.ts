import type { AccountOrder } from '@/features/account/types';

/** Seed orders for the account page when local checkout history is empty. */
export const DUMMY_ACCOUNT_ORDERS: AccountOrder[] = [
  {
    id: 'WB-10482',
    status: 'delivered',
    currency: 'SGD',
    amount: 69.97,
    placedAt: '2026-03-12T09:20:00.000Z',
    items: [
      {
        productId: 1,
        title: 'Essence Mascara Lash Princess',
        quantity: 2,
        unitPrice: 9.99,
        thumbnail:
          'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
      },
      {
        productId: 6,
        title: 'Calvin Klein CK One',
        quantity: 1,
        unitPrice: 49.99,
        thumbnail:
          'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp',
      },
    ],
  },
  {
    id: 'WB-10517',
    status: 'shipped',
    currency: 'SGD',
    amount: 2499.99,
    placedAt: '2026-03-20T14:05:00.000Z',
    items: [
      {
        productId: 12,
        title: 'Annibale Colombo Sofa',
        quantity: 1,
        unitPrice: 2499.99,
        thumbnail:
          'https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp',
      },
    ],
  },
  {
    id: 'WB-10544',
    status: 'processing',
    currency: 'SGD',
    amount: 24.46,
    placedAt: '2026-03-26T08:40:00.000Z',
    items: [
      {
        productId: 27,
        title: 'Honey Jar',
        quantity: 3,
        unitPrice: 6.99,
        thumbnail:
          'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp',
      },
      {
        productId: 32,
        title: 'Milk',
        quantity: 1,
        unitPrice: 3.49,
        thumbnail:
          'https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp',
      },
    ],
  },
  {
    id: 'WB-10301',
    status: 'cancelled',
    currency: 'SGD',
    amount: 12.99,
    placedAt: '2026-02-28T11:10:00.000Z',
    items: [
      {
        productId: 4,
        title: 'Red Lipstick',
        quantity: 1,
        unitPrice: 12.99,
        thumbnail:
          'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp',
      },
    ],
  },
];
