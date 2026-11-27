import { notFound } from 'next/navigation';
import { AccountDashboard } from '@/features/account';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function AccountDashboardRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }

  return <AccountDashboard locale={raw as Locale} />;
}
