"use client";

import { Button, Card, Chip, Skeleton, Text } from "@kiichan/design-system";
import { InsightsBody } from "@/features/account/components/dashboard/components/insights-body";
import { useAccountInsights } from "@/features/account/components/dashboard/hooks/use-account-insights";
import { useAccountOrders } from "@/features/account/components/orders/hooks/use-account-orders";
import { useSession } from "@/features/account/hooks/use-session";
import { useTranslations } from "@/features/shell/hooks/use-translations";
import type { Locale } from "@/i18n/types";

interface AccountDashboardProps {
  locale: Locale;
}

export const AccountDashboard = ({ locale }: AccountDashboardProps) => {
  const t = useTranslations(locale);
  const session = useSession();
  const user = session.data;
  const orders = useAccountOrders();
  const insights = useAccountInsights({
    userId: user?.id ?? 0,
    firstName: user?.firstName ?? "",
    locale,
    orders,
    enabled: Boolean(user),
  });

  if (!user) {
    return null;
  }

  const openOrders = orders.filter(
    (order) => order.status === "processing" || order.status === "shipped",
  ).length;
  const delivered = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-1">
        <Text variant="heading3">{t.account.dashboardTitle}</Text>
        <Text variant="body2" className="text-neutral-500">
          {t.account.dashboardSubtitle}
        </Text>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card variant="outline" padding="md" className="flex flex-col gap-1 hover:bg-primary/10">
          <Text variant="caption" className="text-neutral-500">
            {t.account.statOrders}
          </Text>
          <Text variant="heading3">{orders.length}</Text>
        </Card>
        <Card variant="outline" padding="md" className="flex flex-col gap-1 hover:bg-primary/10">
          <Text variant="caption" className="text-neutral-500">
            {t.account.statOpen}
          </Text>
          <Text variant="heading3">{openOrders}</Text>
        </Card>
        <Card
          variant="outline"
          padding="md"
          className="col-span-2 flex flex-col gap-1 sm:col-span-1 hover:bg-primary/10"
        >
          <Text variant="caption" className="text-neutral-500">
            {t.account.statDelivered}
          </Text>
          <Text variant="heading3">{delivered}</Text>
        </Card>
      </div>

      <Card
        variant="outline"
        padding="md"
        className="flex min-w-0 flex-col gap-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Text variant="subtitle1">{t.account.insightsTitle}</Text>
          {insights.data ? (
            <Chip variant="soft" color="primary">
              {insights.data.tier}
            </Chip>
          ) : null}
        </div>

        {insights.isLoading ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 shrink-0" />
              <Skeleton className="h-5 w-3/4" fullWidth />
            </div>
            <Skeleton className="h-8 w-full" fullWidth />
            <Skeleton className="h-16 w-full" fullWidth />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-16 w-full" fullWidth />
            <Text variant="caption" className="text-neutral-500">
              {t.account.insightsLoading}
            </Text>
          </div>
        ) : null}

        {insights.isError ? (
          <div className="flex flex-col gap-3">
            <Text variant="body2" className="text-red-600">
              {t.account.insightsError}
            </Text>
            <Button
              type="button"
              variant="outline"
              onClick={() => insights.refetch()}
            >
              {t.common.retry}
            </Button>
          </div>
        ) : null}

        {insights.data ? (
          <InsightsBody
            insights={insights.data}
            highlightsLabel={t.account.insightsHighlightsLabel}
            tipLabel={t.account.insightsTipLabel}
            cachedHint={t.account.insightsCachedHint}
          />
        ) : null}
      </Card>
    </div>
  );
};
