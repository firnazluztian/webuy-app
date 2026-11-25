import { notFound } from 'next/navigation';
import { Cart } from '@/features/cart';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return <Cart locale={raw as Locale} />;
}
