import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Search } from '@/features/search';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q = '' } = await searchParams;
  const query = q.trim();

  return routeMetadata(locale, (messages) =>
    query ? `${messages.search.resultsFor} "${query}"` : messages.search.title,
  );
}

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
