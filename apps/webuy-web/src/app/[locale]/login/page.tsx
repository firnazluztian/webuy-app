import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Login } from '@/features/account/components/login';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return routeMetadata(locale, (messages) => messages.auth.loginTitle);
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return <Login locale={raw as Locale} />;
}
