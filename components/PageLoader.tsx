import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardLoader() {
  return (
    <div className="p-8">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      {/* Alerts Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>

      {/* Objectives Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableLoader() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <Skeleton className="h-12 w-full" />

      {/* Rows Skeleton */}
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}

export function ObjectivesLoader() {
  return (
    <div className="p-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      {/* Filters */}
      <Skeleton className="h-20 mb-6" />

      {/* Objectives Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-56" />
        ))}
      </div>

      {/* Summary */}
      <Skeleton className="h-32" />
    </div>
  );
}

export function FormLoader() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
