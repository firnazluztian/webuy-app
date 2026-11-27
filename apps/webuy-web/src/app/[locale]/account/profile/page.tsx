import { notFound } from 'next/navigation';
import { AccountProfile } from '@/features/account';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function AccountProfileRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }

  return <AccountProfile locale={raw as Locale} />;
}
