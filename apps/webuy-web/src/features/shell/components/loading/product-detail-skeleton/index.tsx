'use client';

import { Skeleton } from '@kiichan/design-system';

export const ProductDetailSkeleton = () => (
  <div
    className="flex flex-col gap-12 md:gap-16"
    role="status"
    aria-busy="true"
    aria-label="Loading"
  >
    <Skeleton className="h-4 w-48" />
    <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="flex flex-col gap-3">
        <Skeleton className="aspect-4/5 w-full rounded-3xl" fullWidth />
        <div className="grid grid-cols-4 gap-2">
          <Skeleton className="aspect-square w-full rounded-2xl" fullWidth />
          <Skeleton className="aspect-square w-full rounded-2xl" fullWidth />
          <Skeleton className="aspect-square w-full rounded-2xl" fullWidth />
          <Skeleton className="aspect-square w-full rounded-2xl" fullWidth />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-4/5" fullWidth />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-28" />
        <Skeleton className="mt-4 h-px w-full" fullWidth />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-24 w-full" fullWidth />
        <Skeleton className="mt-2 h-12 w-full" fullWidth />
      </div>
    </div>
  </div>
);
