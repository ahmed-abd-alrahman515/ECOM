'use client';

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-72 bg-secondary/70" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-20 rounded bg-secondary/70" />
            <div className="h-5 w-3/4 rounded bg-secondary/70" />
            <div className="h-4 w-24 rounded bg-secondary/60" />
            <div className="h-6 w-28 rounded bg-secondary/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
