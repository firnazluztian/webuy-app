'use client';

import { Skeleton, Text } from '@kiichan/design-system';

interface CartSkeletonProps {
  title: string;
}

export const CartSkeleton = ({ title }: CartSkeletonProps) => (
  <div
    className="flex flex-col gap-6 sm:gap-8"
    role="status"
    aria-busy="true"
    aria-label={title}
  >
    <div className="flex flex-col gap-2">
      <Text variant="heading2" as="h1">
        {title}
      </Text>
      <Skeleton className="h-4 w-24" />
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8">
      <ul className="flex flex-col gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <li
            key={index}
            className="flex gap-3 rounded-2xl bg-primary-50 p-3 sm:gap-4 sm:p-4"
          >
            <Skeleton className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Skeleton className="h-5 w-3/4" fullWidth />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-9 w-28" />
            </div>
          </li>
        ))}
      </ul>
      <aside className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5 sm:p-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-8 w-full" fullWidth />
        <Skeleton className="h-11 w-full" fullWidth />
        <Skeleton className="h-10 w-full" fullWidth />
      </aside>
    </div>
  </div>
);
