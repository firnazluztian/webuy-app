import { notFound } from 'next/navigation';
import { ProductDetail } from '@/features/catalog';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  return <ProductDetail locale={raw as Locale} productId={id} />;
}
