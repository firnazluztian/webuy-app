import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/features/catalog';
import { isLocale } from '@/i18n/config';
import type { Locale } from '@/i18n/types';
import { fetchProduct } from '@/lib/client-api';
import { routeMetadata } from '@/lib/route-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  return routeMetadata(locale, async (messages) => {
    try {
      const product = await fetchProduct(id);
      return product.title;
    } catch {
      return messages.product.notFound;
    }
  });
}

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
