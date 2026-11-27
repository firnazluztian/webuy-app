import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Checkout } from '@/features/checkout';
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
  return routeMetadata(locale, (messages) => messages.checkout.title);
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return (
    <Suspense fallback={<PageSectionSkeleton rows={5} />}>
      <Checkout locale={raw as Locale} />
    </Suspense>
  );
}
