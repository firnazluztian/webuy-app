'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HomeShopCta } from '@/features/catalog/components/home-shop-cta';
import { useHomeHeroCarousel } from '@/features/catalog/components/home-hero-carousel/hooks/use-home-hero-carousel';
import { useHeroProducts } from '@/features/catalog/hooks/use-products';
import { useFormatMoney } from '@/features/shell/hooks/use-format-money';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const HomeHeroCarousel = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const { format } = useFormatMoney();
  const { data, isLoading, isError, refetch } = useHeroProducts();
  const products = data ?? [];
  const { activeIndex, goTo, pause, resume } = useHomeHeroCarousel(products);
  const activeProduct = products[activeIndex];

  if (isLoading) {
    return (
      <section className="relative -mt-8 ml-[calc(50%-50vw)] h-[70vh] w-screen animate-pulse bg-neutral-100" />
    );
  }

  if (isError || !products.length) {
    return (
      <section className="relative -mt-8 ml-[calc(50%-50vw)] flex h-[70vh] w-screen flex-col justify-end bg-neutral-900 py-16 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary-200">
            {t.shell.brand}
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            {t.home.heroTitle}
          </h1>
          <p className="max-w-2xl text-lg text-neutral-300 sm:text-xl">
            {t.home.heroSubtitle}
          </p>
          {isError ? (
            <button
              type="button"
              className="w-fit text-sm text-primary-200 underline"
              onClick={() => refetch()}
            >
              {t.common.retry}
            </button>
          ) : (
            <HomeShopCta locale={locale} label={t.home.shopNow} />
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className="group relative -mt-8 ml-[calc(50%-50vw)] h-[70vh] w-screen overflow-hidden bg-neutral-900"
      onMouseEnter={pause}
      onMouseLeave={resume}
      aria-roledescription="carousel"
      aria-label={t.home.heroTitle}
    >
      <div className="relative h-full w-full">
        {products.map((product, index) => {
          const image = product.images?.[0] ?? product.thumbnail;
          const isActive = index === activeIndex;

          return (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              <Image
                src={image}
                alt={product.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover transition-transform duration-[6s] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/45 to-neutral-900/10" />
        <div className="absolute inset-0 bg-linear-to-r from-neutral-900/70 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end pb-14 sm:justify-center sm:pb-16">
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
            <div className="flex max-w-2xl flex-col gap-5">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary-200">
                {t.shell.brand}
              </p>
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                {t.home.heroTitle}
              </h1>
              <p className="text-lg text-neutral-200 sm:text-xl">
                {t.home.heroSubtitle}
              </p>
              <div className="pt-1">
                <HomeShopCta locale={locale} label={t.home.shopNow} />
              </div>
            </div>

            {activeProduct ? (
              <Link
                href={`/${locale}/products/${activeProduct.id}`}
                className="flex max-w-sm flex-col gap-1 border-t border-white/20 pt-4 transition-opacity hover:opacity-80 sm:absolute sm:right-4 sm:bottom-0 sm:border-t-0 sm:pt-0"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-300">
                  {activeProduct.brand ??
                    activeProduct.category ??
                    t.home.featuredHeading}
                </span>
                <span className="text-lg font-medium text-white">
                  {activeProduct.title}
                </span>
                <span className="text-sm text-primary-200">
                  {format(activeProduct.price)}
                </span>
              </Link>
            ) : null}
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 sm:bottom-5"
          role="tablist"
          aria-label={t.home.featuredHeading}
        >
          {products.map((product, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={product.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={product.title}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
