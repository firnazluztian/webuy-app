import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PaymentResult } from '@/features/checkout/components/payment-result';
import { PageSectionSkeleton } from '@/features/shell/components/loading/page-section-skeleton';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return routeMetadata(locale, (messages) => messages.payment.title);
}

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const { orderId = '' } = await searchParams;
  return (
    <Suspense fallback={<PageSectionSkeleton rows={4} />}>
      <PaymentResult locale={raw as Locale} orderId={orderId} />
    </Suspense>
  );
}
