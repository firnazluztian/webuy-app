'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import type { Product } from '@/lib/schemas';

const AUTO_ADVANCE_MS = 5_500;

export function useHomeHeroCarousel(products: Product[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = products.length;

  const goTo = (index: number) => {
    if (count === 0) {
      return;
    }
    setActiveIndex(((index % count) + count) % count);
  };

  const advance = useEffectEvent(() => {
    if (count <= 1 || paused) {
      return;
    }
    setActiveIndex((current) => (current + 1) % count);
  });

  useEffect(() => {
    if (count <= 1 || paused) {
      return;
    }
    const timer = window.setInterval(() => advance(), AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [advance, count, paused]);

  useEffect(() => {
    if (activeIndex >= count && count > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, count]);

  return {
    activeIndex,
    goTo,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
}
