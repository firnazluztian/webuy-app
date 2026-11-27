import { generateText, Output } from 'ai';
import { z } from 'zod';
import { accountInsightsSchema } from '@/features/account/components/dashboard/schema';
import { BRAND_NAME } from '@/config/brand';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { assistantModel } from '@/lib/assistant/model';

export const maxDuration = 30;

const orderSummarySchema = z.object({
  id: z.string(),
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled']),
  currency: z.enum(['SGD', 'KRW', 'IDR']),
  amount: z.number(),
  placedAt: z.string(),
  itemTitles: z.array(z.string()),
});

const requestSchema = z.object({
  locale: z.string().optional(),
  firstName: z.string().min(1).max(80),
  orders: z.array(orderSummarySchema).max(20),
});

export async function POST(req: Request) {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return Response.json(
      { error: 'Sign in required to view account insights.' },
      { status: 401 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      {
        error:
          'Account insights are unavailable. ANTHROPIC_API_KEY is not configured.',
      },
      { status: 503 },
    );
  }

  const parsed = requestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: 'Invalid insights request.' }, { status: 400 });
  }

  const rawLocale = parsed.data.locale ?? 'en';
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'en';
  const { firstName, orders } = parsed.data;

  const orderLines =
    orders.length === 0
      ? 'No orders yet.'
      : orders
          .map(
            (order) =>
              `${order.id} | ${order.status} | ${order.currency} ${order.amount} | ${order.placedAt} | items: ${order.itemTitles.join(', ')}`,
          )
          .join('\n');

  const result = await generateText({
    model: assistantModel,
    output: Output.object({ schema: accountInsightsSchema }),
    prompt: `
You are writing a short shopping-account insight card for ${BRAND_NAME}.
Respond in locale "${locale}".
Shopper first name: ${firstName}

Order history:
${orderLines}

Rules:
- Be concise, warm, and useful — not salesy.
- Infer a membership tier from order volume/value (Explorer → Platinum).
- spendingSummary should mention patterns if possible (categories, open orders, recent spend).
- tip should be one practical next shopping action on ${BRAND_NAME}.
- highlights: 2–4 short bullets.
- Do not invent payment methods, addresses, or private data.
- Do not mention AI, models, tokens, or that this is generated.
`.trim(),
  });

  if (!result.output) {
    return Response.json(
      { error: 'Unable to generate account insights.' },
      { status: 502 },
    );
  }

  return Response.json({
    ...result.output,
    generatedAt: new Date().toISOString(),
  });
}
