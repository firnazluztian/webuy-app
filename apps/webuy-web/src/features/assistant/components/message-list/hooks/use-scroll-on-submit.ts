'use client';

import { useLayoutEffect, useRef } from 'react';

/**
 * Snap the message list to the bottom after the user submits.
 * Re-runs when `messageCount` catches up so the new bubble is in the DOM.
 * Streaming token updates do not change count, so reading history mid-reply stays put.
 */
export const useScrollOnSubmit = (
  scrollNonce: number,
  messageCount: number,
) => {
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollNonce === 0) {
      return;
    }
    const element = listRef.current;
    if (!element) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [scrollNonce, messageCount]);

  return listRef;
};
