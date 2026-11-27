export const ACCOUNT_SECTIONS = [
  'dashboard',
  'profile',
  'orders',
  'wishlist',
] as const;

export type AccountSection = (typeof ACCOUNT_SECTIONS)[number];

export interface AccountNavItem {
  id: AccountSection;
  icon: string;
  labelKey: 'navDashboard' | 'navProfile' | 'navOrders' | 'navWishlist';
}

export type OrderStatus =
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface AccountOrderItem {
  productId: number;
  title: string;
  quantity: number;
  unitPrice: number;
  thumbnail: string;
}

export interface AccountOrder {
  id: string;
  status: OrderStatus;
  currency: 'SGD' | 'KRW' | 'IDR';
  amount: number;
  placedAt: string;
  items: AccountOrderItem[];
}

export interface WishlistItem {
  productId: number;
  title: string;
  price: number;
  currency: 'SGD' | 'KRW' | 'IDR';
  thumbnail: string;
  inStock: boolean;
}

export interface AccountInsights {
  tier: 'Explorer' | 'Member' | 'Silver' | 'Gold' | 'Platinum';
  headline: string;
  spendingSummary: string;
  tip: string;
  highlights: string[];
  generatedAt: string;
}
