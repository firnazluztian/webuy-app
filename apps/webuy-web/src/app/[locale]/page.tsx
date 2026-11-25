import { notFound } from 'next/navigation';
import { FeaturedProducts, HomeHeroCarousel } from '@/features/catalog';
import { getMessages, isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale = raw as Locale;
  const t = getMessages(locale);

  return (
    <div className="flex flex-col gap-10">
      <HomeHeroCarousel locale={locale} />

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-neutral-900">{t.home.featuredHeading}</h2>
        <FeaturedProducts locale={locale} />
      </section>
    </div>
  );
}
