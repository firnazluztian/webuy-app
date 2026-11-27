import type { WishlistItem } from '@/features/account/types';

export const DUMMY_WISHLIST: WishlistItem[] = [
  {
    productId: 2,
    title: 'Eyeshadow Palette with Mirror',
    price: 19.99,
    currency: 'SGD',
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp',
    inStock: true,
  },
  {
    productId: 7,
    title: 'Chanel Coco Noir Eau De',
    price: 129.99,
    currency: 'SGD',
    thumbnail:
      'https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp',
    inStock: true,
  },
  {
    productId: 14,
    title: 'Knoll Saarinen Executive Conference Chair',
    price: 499.99,
    currency: 'SGD',
    thumbnail:
      'https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp',
    inStock: false,
  },
  {
    productId: 21,
    title: 'Cucumber',
    price: 1.49,
    currency: 'SGD',
    thumbnail:
      'https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp',
    inStock: true,
  },
];
