'use client';

import { useEffect, useState } from 'react';

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
}

/**
 * Always starts false so SSR and the first client paint match.
 * Persist may finish before React hydrates; do not read hasHydrated() in useState.
 */
export function usePersistHydrated(persist: PersistApi): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const markReady = () => setHydrated(true);

    if (persist.hasHydrated()) {
      markReady();
      return;
    }

    return persist.onFinishHydration(markReady);
  }, [persist]);

  return hydrated;
}
