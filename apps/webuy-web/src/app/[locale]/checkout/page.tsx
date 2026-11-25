import { notFound } from 'next/navigation';
import { Checkout } from '@/features/checkout';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return <Checkout locale={raw as Locale} />;
}
