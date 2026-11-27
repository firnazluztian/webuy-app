'use client';

import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';
import type { Product } from '@/lib/schemas';

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-neutral-200 py-4 last:border-b-0 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-6">
      <dt className="text-xs font-medium tracking-[0.14em] text-neutral-500 uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-neutral-900">{value}</dd>
    </div>
  );
}

export const ProductSpecs = ({
  locale,
  product,
}: {
  locale: Locale;
  product: Product;
}) => {
  const t = useTranslations(locale);

  const rows: Array<{ label: string; value: string }> = [];

  if (product.sku) {
    rows.push({ label: t.product.sku, value: product.sku });
  }
  if (product.brand) {
    rows.push({ label: t.product.brand, value: product.brand });
  }
  if (product.category) {
    rows.push({ label: t.product.category, value: product.category });
  }
  if (product.availabilityStatus) {
    rows.push({
      label: t.product.availability,
      value: product.availabilityStatus,
    });
  }
  if (product.stock !== undefined) {
    rows.push({ label: t.product.stock, value: String(product.stock) });
  }
  if (product.minimumOrderQuantity !== undefined) {
    rows.push({
      label: t.product.minimumOrder,
      value: String(product.minimumOrderQuantity),
    });
  }
  if (product.weight !== undefined) {
    rows.push({
      label: t.product.weight,
      value: `${product.weight}`,
    });
  }
  if (product.dimensions) {
    const { width, height, depth } = product.dimensions;
    rows.push({
      label: t.product.dimensions,
      value: `${width} × ${height} × ${depth}`,
    });
  }
  if (product.shippingInformation) {
    rows.push({
      label: t.product.shipping,
      value: product.shippingInformation,
    });
  }
  if (product.warrantyInformation) {
    rows.push({
      label: t.product.warranty,
      value: product.warrantyInformation,
    });
  }
  if (product.returnPolicy) {
    rows.push({
      label: t.product.returnPolicy,
      value: product.returnPolicy,
    });
  }
  if (product.tags && product.tags.length > 0) {
    rows.push({ label: t.product.tags, value: product.tags.join(', ') });
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="product-specs">
      <h2
        id="product-specs"
        className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase"
      >
        {t.product.specifications}
      </h2>
      <dl>{rows.map((row) => (
        <SpecRow key={row.label} label={row.label} value={row.value} />
      ))}</dl>
    </section>
  );
};
