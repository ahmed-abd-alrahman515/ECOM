'use client';

interface PageSkeletonProps {
  showSidebar?: boolean;
  cards?: number;
}

export function PageSkeleton({ showSidebar = false, cards = 6 }: PageSkeletonProps) {
  return (
    <div className="animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-10 w-56 rounded bg-secondary/70" />
        <div className="h-4 w-80 max-w-full rounded bg-secondary/60" />
      </div>

      <div className={`grid grid-cols-1 gap-8 ${showSidebar ? 'lg:grid-cols-4' : ''}`}>
        {showSidebar ? (
          <div className="space-y-4 rounded-2xl bg-secondary/50 p-6 lg:col-span-1">
            <div className="h-6 w-28 rounded bg-secondary/80" />
            <div className="h-24 rounded bg-secondary/70" />
            <div className="h-36 rounded bg-secondary/70" />
            <div className="h-10 rounded bg-secondary/70" />
          </div>
        ) : null}

        <div className={showSidebar ? 'lg:col-span-3' : ''}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: cards }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-64 bg-secondary/70" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 rounded bg-secondary/70" />
                  <div className="h-5 w-3/4 rounded bg-secondary/70" />
                  <div className="h-4 w-1/2 rounded bg-secondary/60" />
                  <div className="h-6 w-28 rounded bg-secondary/70" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
