import { ACCOUNT_INSIGHTS_STORAGE_PREFIX } from '@/features/account/constants';
import { accountInsightsResponseSchema } from '@/features/account/components/dashboard/schema';
import type { AccountInsights } from '@/features/account/types';

function storageKey(userId: number) {
  return `${ACCOUNT_INSIGHTS_STORAGE_PREFIX}:${userId}`;
}

export function loadCachedInsights(userId: number): AccountInsights | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(storageKey(userId));
    if (!raw) {
      return null;
    }
    return accountInsightsResponseSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveCachedInsights(
  userId: number,
  insights: AccountInsights,
): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.sessionStorage.setItem(storageKey(userId), JSON.stringify(insights));
}
