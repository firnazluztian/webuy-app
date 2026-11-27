import { notFound } from 'next/navigation';
import { AccountWishlist } from '@/features/account';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function AccountWishlistRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }

  return <AccountWishlist locale={raw as Locale} />;
}
