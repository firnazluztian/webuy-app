'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';

interface ProductGalleryProps {
  locale: Locale;
  title: string;
  images: string[];
}

export const ProductGallery = ({
  locale,
  title,
  images,
}: ProductGalleryProps) => {
  const t = useTranslations(locale);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : [];
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  if (!activeImage) {
    return (
      <div
        className="aspect-4/5 w-full rounded-3xl bg-neutral-50"
        aria-hidden
      />
    );
  }

  return (
    <div className="flex flex-col gap-3" aria-label={t.product.galleryLabel}>
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-3xl bg-neutral-50">
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-3xl object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {safeImages.length > 1 ? (
        <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {safeImages.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={`${image}-${index}`}>
                <button
                  type="button"
                  aria-label={t.product.thumbnailLabel.replace(
                    '{index}',
                    String(index + 1),
                  )}
                  aria-pressed={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-50 transition ring-offset-2 ${
                    isActive
                      ? 'ring-2 ring-neutral-900'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="96px"
                    className="rounded-2xl object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
