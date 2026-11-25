"use client";

import { useEffect, useState, type RefObject } from "react";

export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = "200px 0px",
  enabled = true,
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled || inView) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, inView, ref, rootMargin]);

  return inView;
}
