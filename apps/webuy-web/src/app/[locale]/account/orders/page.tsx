import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccountOrders } from '@/features/account';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return routeMetadata(locale, (messages) => messages.account.ordersTitle);
}

export default async function AccountOrdersRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }

  return <AccountOrders locale={raw as Locale} />;
}
