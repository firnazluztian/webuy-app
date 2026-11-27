import { z } from 'zod';

export const accountInsightsSchema = z.object({
  tier: z.enum(['Explorer', 'Member', 'Silver', 'Gold', 'Platinum']),
  headline: z.string().min(1).max(120),
  spendingSummary: z.string().min(1).max(280),
  tip: z.string().min(1).max(200),
  highlights: z.array(z.string().min(1).max(120)).min(1).max(4),
});

export const accountInsightsResponseSchema = accountInsightsSchema.extend({
  generatedAt: z.string(),
});

export type AccountInsightsPayload = z.infer<typeof accountInsightsSchema>;
