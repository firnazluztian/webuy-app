'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Clears leaked Dialog body locks (overflow:hidden / inert overlays). */
function unlockDocumentScroll() {
  if (typeof document === 'undefined') {
    return;
  }
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

/**
 * Safety net while design-system Dialog can leave body scroll locked after
 * close / remount. Runs on route change and when the tab becomes visible again.
 */
export const BodyScrollGuard = () => {
  const pathname = usePathname();

  useEffect(() => {
    unlockDocumentScroll();
  }, [pathname]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        unlockDocumentScroll();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', unlockDocumentScroll);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', unlockDocumentScroll);
      unlockDocumentScroll();
    };
  }, []);

  return null;
};
