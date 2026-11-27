"use client";

import {
  Card,
  Chip,
  Icon,
  Notification,
  Progress,
  Text,
} from "@kiichan/design-system";
import type { AccountInsights } from "@/features/account/types";

const TIER_PROGRESS: Record<AccountInsights["tier"], number> = {
  Explorer: 20,
  Member: 40,
  Silver: 60,
  Gold: 80,
  Platinum: 100,
};

interface InsightsBodyProps {
  insights: AccountInsights;
  highlightsLabel: string;
  tipLabel: string;
  cachedHint: string;
}

export const InsightsBody = ({
  insights,
  highlightsLabel,
  tipLabel,
  cachedHint,
}: InsightsBodyProps) => {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-primary/10 text-primary rounded-full">
          <Icon icon="mdi:auto-fix" />
        </span>
        <Text variant="body1" className="min-w-0 text-neutral-900">
          {insights.headline}
        </Text>
      </div>

      <Progress
        variant="bar"
        color="primary"
        value={TIER_PROGRESS[insights.tier]}
        label={insights.tier}
        showValue
      />

      <Card variant="outline" className="flex flex-col gap-2 bg-primary/10 p-4">
        <div className="flex items-start gap-2 text-neutral-700">
          <Icon icon="mdi:chart-timeline-variant" className="mt-0.5 shrink-0" />
          <Text variant="subtitle2" className="min-w-0">
            {insights.spendingSummary}
          </Text>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-neutral-700">
          <Icon icon="mdi:star-four-points-outline" />
          <Text variant="subtitle2">{highlightsLabel}</Text>
        </div>
        <div className="flex flex-wrap gap-2">
          {insights.highlights.map((item) => (
            <Chip key={item} variant="soft" color="info" icon="mdi:check">
              {item}
            </Chip>
          ))}
        </div>
      </div>

      <Notification
        variant="info"
        icon="mdi:lightbulb-on-outline"
        title={tipLabel}
      >
        {insights.tip}
      </Notification>

      <Text variant="caption" className="text-neutral-400">
        {cachedHint}
      </Text>
    </div>
  );
};
