import { notFound } from 'next/navigation';
import { Login } from '@/features/account/components/login';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return <Login locale={raw as Locale} />;
}
