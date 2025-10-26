'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'rect';
}

export function LoadingSkeleton({ className, variant = 'rect' }: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 w-full',
    card: 'h-32 w-full rounded-xl',
    circle: 'h-12 w-12 rounded-full',
    rect: 'h-12 w-full rounded-lg',
  };

  return (
    <div className={cn('skeleton', variants[variant], className)} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" className="w-24 h-3" />
        <LoadingSkeleton variant="circle" className="w-5 h-5" />
      </div>
      <LoadingSkeleton variant="text" className="w-32 h-8" />
      <LoadingSkeleton variant="text" className="w-40 h-3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton className="flex-1" />
          <LoadingSkeleton className="w-24" />
          <LoadingSkeleton className="w-20" />
        </div>
      ))}
    </div>
  );
}
