'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@kiichan/design-system';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

export const HomeCyberMondayBanner = ({ locale }: { locale: Locale }) => {
  const t = useTranslations(locale);
  const router = useRouter();

  return (
    <section
      aria-label={t.home.cyberMondayTitle}
      className="relative -mx-4 overflow-hidden bg-neutral-950 text-white sm:mx-0 sm:rounded-2xl"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 60% at 15% 50%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 70%), radial-gradient(ellipse 50% 80% at 90% 20%, rgba(255,255,255,0.12), transparent 55%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)',
        }}
      />

      <div className="relative flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-10 sm:py-12 md:px-14">
        <div className="flex max-w-xl flex-col gap-3">
          <p className="text-[11px] font-medium tracking-[0.28em] text-primary-200 uppercase">
            {t.home.cyberMondayEyebrow}
          </p>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {t.home.cyberMondayTitle}
            </h2>
            <span className="mb-1 animate-pulse text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
              {t.home.cyberMondayBadge}
            </span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-neutral-300 sm:text-base">
            {t.home.cyberMondaySubtitle}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          className="shrink-0 self-start sm:self-center"
          onClick={() => router.push(`/${locale}/search`)}
        >
          {t.home.cyberMondayCta}
        </Button>
      </div>
    </section>
  );
};
