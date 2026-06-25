'use client';

interface CartSkeletonProps {
  count?: number;
}

export function CartSkeleton({ count = 3 }: CartSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 rounded-2xl border border-border bg-card p-4 animate-pulse">
          <div className="h-24 w-24 rounded-lg bg-secondary/70" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-1/2 rounded bg-secondary/70" />
            <div className="h-4 w-24 rounded bg-secondary/60" />
            <div className="h-10 w-28 rounded bg-secondary/70" />
          </div>
          <div className="w-20 space-y-3">
            <div className="ml-auto h-8 w-8 rounded bg-secondary/70" />
            <div className="h-4 w-full rounded bg-secondary/60" />
            <div className="h-5 w-full rounded bg-secondary/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
