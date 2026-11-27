import { notFound, redirect } from 'next/navigation';
import { accountPath } from '@/features/account';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function AccountIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }

  redirect(accountPath(raw as Locale, 'dashboard'));
}
