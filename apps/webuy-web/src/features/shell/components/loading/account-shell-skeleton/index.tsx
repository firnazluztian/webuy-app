'use client';

import { Card, Skeleton, Text } from '@kiichan/design-system';

interface AccountShellSkeletonProps {
  title: string;
}

export const AccountShellSkeleton = ({ title }: AccountShellSkeletonProps) => (
  <div
    className="flex min-w-0 flex-col gap-4 sm:gap-6"
    role="status"
    aria-busy="true"
    aria-label={title}
  >
    <div className="flex flex-col gap-2">
      <Text variant="heading2" as="h1" className="text-2xl sm:text-3xl">
        {title}
      </Text>
      <Skeleton className="hidden h-4 w-72 sm:block" />
    </div>

    <div className="grid min-w-0 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="min-w-0">
        <Card
          variant="outline"
          padding="md"
          className="flex min-w-0 flex-col gap-4 overflow-hidden"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 max-w-full w-32" />
              <Skeleton className="h-3 max-w-full w-40" />
            </div>
          </div>
          <div className="h-px w-full bg-neutral-200" />
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-10 w-full" fullWidth />
            <Skeleton className="h-10 w-full" fullWidth />
            <Skeleton className="h-10 w-full" fullWidth />
            <Skeleton className="h-10 w-full" fullWidth />
          </div>
        </Card>
      </aside>

      <div className="flex min-w-0 flex-col gap-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Skeleton className="h-24 w-full" fullWidth />
          <Skeleton className="h-24 w-full" fullWidth />
          <Skeleton className="col-span-2 h-24 w-full sm:col-span-1" fullWidth />
        </div>
        <Skeleton className="h-48 w-full" fullWidth />
      </div>
    </div>
  </div>
);
