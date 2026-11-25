import { notFound } from 'next/navigation';
import { FeaturedProducts } from '@/features/catalog';
import { HomeShopCta } from '@/features/catalog/components/home-shop-cta';
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-light to-neutral-100 px-6 py-16 sm:px-10">
        <div className="relative z-10 flex max-w-xl flex-col gap-4">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">{t.shell.brand}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            {t.home.heroTitle}
          </h1>
          <p className="text-base text-neutral-600">{t.home.heroSubtitle}</p>
          <HomeShopCta locale={locale} label={t.home.shopNow} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-neutral-900">{t.home.featuredHeading}</h2>
        <FeaturedProducts locale={locale} />
      </section>
    </div>
  );
}
