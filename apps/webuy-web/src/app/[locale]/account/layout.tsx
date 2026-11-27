import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { AccountLayout } from '@/features/account';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function AccountSectionLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }

  return <AccountLayout locale={raw as Locale}>{children}</AccountLayout>;
}
