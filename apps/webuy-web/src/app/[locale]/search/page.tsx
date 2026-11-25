import { notFound } from 'next/navigation';
import { Search } from '@/features/search';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const { q = '' } = await searchParams;
  return <Search locale={raw as Locale} query={q} />;
}
