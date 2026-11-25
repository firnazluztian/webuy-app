import { notFound } from 'next/navigation';
import { PaymentResult } from '@/features/checkout/components/payment-result';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

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
  return <PaymentResult locale={raw as Locale} orderId={orderId} />;
}
