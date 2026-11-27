import { Skeleton } from '@kiichan/design-system';

interface PageSectionSkeletonProps {
  rows?: number;
}

export const PageSectionSkeleton = ({ rows = 4 }: PageSectionSkeletonProps) => (
  <div
    className="flex flex-col gap-4"
    role="status"
    aria-busy="true"
    aria-label="Loading"
  >
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-72" />
    {Array.from({ length: rows }, (_, index) => (
      <Skeleton key={index} className="h-16 w-full" fullWidth />
    ))}
  </div>
);
