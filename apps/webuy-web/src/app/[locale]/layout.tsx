import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { AssistantFab } from '@/features/assistant';
import { AppProviders, Footer, Topbar } from '@/features/shell';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function LocaleLayout({
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
  const locale = raw as Locale;

  return (
    <AppProviders>
      <div className="flex min-h-screen flex-col">
        <Topbar locale={locale} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-24 sm:pb-8">
          {children}
        </main>
        <Footer locale={locale} />
        <AssistantFab locale={locale} />
      </div>
    </AppProviders>
  );
}
