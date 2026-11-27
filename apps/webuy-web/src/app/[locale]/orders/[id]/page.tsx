import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OrderDetail } from '@/features/checkout/components/order-detail';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  return routeMetadata(locale, (messages) => `${messages.order.title} ${id}`);
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return <OrderDetail locale={raw as Locale} orderId={id} />;
}
