import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  FeaturedProducts,
  HomeCyberMondayBanner,
  HomeHeroCarousel,
} from '@/features/catalog';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return routeMetadata(locale, (messages) => messages.shell.home);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <HomeHeroCarousel locale={locale} />
      <HomeCyberMondayBanner locale={locale} />
      <FeaturedProducts locale={locale} />
    </div>
  );
}
