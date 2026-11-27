'use client';

import { StarRating } from '@kiichan/design-system';
import { useTranslations } from '@/features/shell/hooks/use-translations';
import type { Locale } from '@/i18n/types';
import type { ProductReview } from '@/lib/schemas';

function formatReviewDate(value: string, locale: Locale) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export const ProductReviews = ({
  locale,
  reviews,
}: {
  locale: Locale;
  reviews: ProductReview[];
}) => {
  const t = useTranslations(locale);

  return (
    <section className="flex flex-col gap-6" aria-labelledby="product-reviews">
      <h2
        id="product-reviews"
        className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase"
      >
        {t.product.reviews}
      </h2>

      {reviews.length === 0 ? (
        <p className="text-sm text-neutral-600">{t.product.reviewsEmpty}</p>
      ) : (
        <ul className="flex flex-col">
          {reviews.map((review) => (
            <li
              key={`${review.reviewerName}-${review.date}-${review.comment}`}
              className="flex flex-col gap-3 border-b border-neutral-200 py-6 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium text-neutral-900">
                  {review.reviewerName}
                </p>
                <StarRating rating={review.rating} readOnly color="warning" />
                <time
                  dateTime={review.date}
                  className="text-xs tracking-wide text-neutral-500"
                >
                  {formatReviewDate(review.date, locale)}
                </time>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-neutral-700">
                {review.comment}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
