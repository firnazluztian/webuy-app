'use client';

import { useQuery } from '@tanstack/react-query';
import {
  loadCachedInsights,
  saveCachedInsights,
} from '@/features/account/components/dashboard/insights-storage';
import { accountInsightsResponseSchema } from '@/features/account/components/dashboard/schema';
import type { AccountOrder } from '@/features/account/types';
import type { Locale } from '@/i18n/types';
import { getStoredToken } from '@/lib/commerce-api';
import { queryKeys } from '@/lib/query-keys';

interface UseAccountInsightsOptions {
  userId: number;
  firstName: string;
  locale: Locale;
  orders: AccountOrder[];
  enabled?: boolean;
}

async function fetchInsights(
  options: UseAccountInsightsOptions,
): Promise<ReturnType<typeof accountInsightsResponseSchema.parse>> {
  const cached = loadCachedInsights(options.userId);
  if (cached) {
    return cached;
  }

  const token = getStoredToken();
  const response = await fetch('/api/account/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      locale: options.locale,
      firstName: options.firstName,
      orders: options.orders.map((order) => ({
        id: order.id,
        status: order.status,
        currency: order.currency,
        amount: order.amount,
        placedAt: order.placedAt,
        itemTitles: order.items.map((item) => item.title),
      })),
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? 'Unable to generate insights.');
  }

  const insights = accountInsightsResponseSchema.parse(await response.json());
  saveCachedInsights(options.userId, insights);
  return insights;
}

export function useAccountInsights(options: UseAccountInsightsOptions) {
  return useQuery({
    queryKey: queryKeys.accountInsights(options.userId, options.locale),
    queryFn: () => fetchInsights(options),
    enabled: options.enabled ?? true,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
