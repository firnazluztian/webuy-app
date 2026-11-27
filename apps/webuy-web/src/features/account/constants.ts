import type { AccountNavItem, AccountSection } from '@/features/account/types';
import { ACCOUNT_SECTIONS } from '@/features/account/types';
import type { Locale } from '@/i18n/types';

export const ACCOUNT_INSIGHTS_STORAGE_PREFIX = 'webuy_account_insights';

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  {
    id: 'dashboard',
    icon: 'mdi:view-dashboard-outline',
    labelKey: 'navDashboard',
  },
  {
    id: 'profile',
    icon: 'mdi:account-outline',
    labelKey: 'navProfile',
  },
  {
    id: 'orders',
    icon: 'mdi:package-variant-closed',
    labelKey: 'navOrders',
  },
  {
    id: 'wishlist',
    icon: 'mdi:heart-outline',
    labelKey: 'navWishlist',
  },
];

export function isAccountSection(value: string): value is AccountSection {
  return (ACCOUNT_SECTIONS as readonly string[]).includes(value);
}

export function accountPath(
  locale: Locale,
  section: AccountSection = 'dashboard',
): string {
  return `/${locale}/account/${section}`;
}

export function accountSectionFromPathname(
  pathname: string,
): AccountSection | null {
  const segments = pathname.split('/').filter(Boolean);
  const accountIndex = segments.indexOf('account');
  if (accountIndex < 0) {
    return null;
  }
  const section = segments[accountIndex + 1];
  return section && isAccountSection(section) ? section : null;
}
