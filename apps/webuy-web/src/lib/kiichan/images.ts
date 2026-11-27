import type { NegativeCaseVariant } from '@kiichan/design-system';

/** Matches vinove / page-mascot reactions sheet order (3×3, row-major). */
export const KIICHAN_REACTIONS = [
  'blink',
  'heart',
  'sparkle',
  'surprised',
  'wink',
  'bashful',
  'sleepy',
  'dizzy',
  'delighted',
] as const;

export type KiichanReaction = (typeof KIICHAN_REACTIONS)[number];

const FRAME_BASE = '/mascots/kiichan';

export const KIICHAN_IMAGES: Record<KiichanReaction, string> = {
  blink: `${FRAME_BASE}/blink.webp`,
  heart: `${FRAME_BASE}/heart.webp`,
  sparkle: `${FRAME_BASE}/sparkle.webp`,
  surprised: `${FRAME_BASE}/surprised.webp`,
  wink: `${FRAME_BASE}/wink.webp`,
  bashful: `${FRAME_BASE}/bashful.webp`,
  sleepy: `${FRAME_BASE}/sleepy.webp`,
  dizzy: `${FRAME_BASE}/dizzy.webp`,
  delighted: `${FRAME_BASE}/delighted.webp`,
};

/** Semantic defaults: NegativeCase variant → Kiichan reaction frame. */
export const NEGATIVE_CASE_KIICHAN: Record<NegativeCaseVariant, KiichanReaction> =
  {
    'no-internet': 'sleepy',
    'data-not-found': 'dizzy',
    'under-development': 'sleepy',
    'information-unavailable': 'dizzy',
    'payment-success': 'delighted',
    'payment-failed': 'surprised',
    'no-order': 'dizzy',
    timeout: 'sleepy',
    'on-process': 'sleepy',
    'page-not-found': 'dizzy',
    'page-not-found-v2': 'dizzy',
    'no-seat-available': 'dizzy',
    'change-price': 'surprised',
    'help-desk': 'wink',
    approved: 'delighted',
    rejected: 'surprised',
    'check-order': 'bashful',
  };

export const getKiichanImage = (reaction: KiichanReaction): string =>
  KIICHAN_IMAGES[reaction];

export const getNegativeCaseImage = (variant: NegativeCaseVariant): string =>
  getKiichanImage(NEGATIVE_CASE_KIICHAN[variant]);
