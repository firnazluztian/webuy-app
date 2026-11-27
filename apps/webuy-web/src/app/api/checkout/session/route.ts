import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';

export const runtime = 'nodejs';

/**
 * Stripe zero-decimal presentment currencies we use.
 * IDR is NOT zero-decimal in Stripe — it still expects two fractional digits
 * (unit_amount 10000 = Rp100.00), even though rupiah is whole in daily use.
 * @see https://docs.stripe.com/currencies#zero-decimal
 */
const ZERO_DECIMAL = new Set(['krw']);

/**
 * Major-unit floors that usually clear Stripe's "must convert to ≥ $0.50 USD"
 * rule when the account settles in USD (sandbox / converted charges).
 */
const MIN_MAJOR_AMOUNT: Record<'SGD' | 'KRW' | 'IDR', number> = {
  SGD: 0.5,
  KRW: 700,
  IDR: 10_000,
};

const bodySchema = z.object({
  orderId: z.string().min(1),
  locale: z.enum(['en', 'ko', 'id']),
  currency: z.enum(['SGD', 'KRW', 'IDR']),
  /** Display / charge amount in major units for the market currency. */
  amount: z.number().positive(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().min(1),
  lineSummary: z.string().min(1).max(120),
});

function appOrigin(req: Request): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '');
  if (configured) {
    return configured;
  }
  const proto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'http';
  const host =
    req.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    req.headers.get('host')?.trim() ||
    'localhost:3000';
  return `${proto}://${host}`;
}

/** Stripe expects the smallest currency unit (cents), except zero-decimal currencies. */
function toStripeUnitAmount(
  amount: number,
  currency: 'SGD' | 'KRW' | 'IDR'
): number {
  const charged = Math.max(amount, MIN_MAJOR_AMOUNT[currency]);
  if (ZERO_DECIMAL.has(currency.toLowerCase())) {
    return Math.round(charged);
  }
  return Math.round(charged * 100);
}

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeSecret) {
    return NextResponse.json(
      {
        error: 'Stripe is not configured.',
        code: 'stripe_config',
      },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid checkout payload.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    orderId,
    locale,
    currency,
    amount,
    customerEmail,
    customerName,
    lineSummary,
  } = parsed.data;

  const stripe = new Stripe(stripeSecret);
  const origin = appOrigin(req);
  const unitAmount = toStripeUnitAmount(amount, currency);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      client_reference_id: orderId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: currency.toLowerCase(),
            unit_amount: unitAmount,
            product_data: {
              name: lineSummary,
              description: `Order ${orderId} · ${customerName}`,
            },
          },
        },
      ],
      success_url: `${origin}/${locale}/payment?orderId=${encodeURIComponent(orderId)}&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout?checkout=cancel&orderId=${encodeURIComponent(orderId)}`,
      metadata: {
        order_id: orderId,
        product: 'webuy_order',
      },
      shipping_address_collection: undefined,
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Checkout session missing URL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Checkout session failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
