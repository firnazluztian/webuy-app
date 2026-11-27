import { Skeleton } from '@kiichan/design-system';

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton = ({
  count = 8,
  className = 'grid grid-cols-2 gap-4 md:grid-cols-4',
}: ProductGridSkeletonProps) => (
  <div className={className} aria-hidden>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="flex flex-col gap-3">
        <Skeleton className="aspect-[4/5] w-full rounded-3xl" fullWidth />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    ))}
  </div>
);
