"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NavigationProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;

  return (
    <div
      key={routeKey}
      aria-hidden
      className="pointer-events-none h-1 w-full overflow-hidden"
    >
      <div className="navigation-progress-bar h-full origin-left bg-primary" />
    </div>
  );
};

/** Progress sweep rendered directly under the topbar on load and route change. */
export const NavigationProgress = () => (
  <Suspense fallback={null}>
    <NavigationProgressBar />
  </Suspense>
);
