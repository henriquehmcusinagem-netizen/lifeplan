'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from './AnimatedNumber';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
}

export function StatCard({
  label,
  value,
  change,
  icon,
  variant = 'default',
  animated = false
}: StatCardProps) {
  // Se o valor for um número e animated=true, usar AnimatedNumber
  const numericValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.-]/g, ''))
    : value;

  const shouldAnimate = animated && !isNaN(numericValue);

  const variantStyles = {
    default: 'text-gray-900 dark:text-gray-100',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-500',
    danger: 'text-danger-600 dark:text-danger-400'
  };

  const iconVariantStyles = {
    default: 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-400',
    success: 'text-success-400 dark:text-success-500 group-hover:text-success-500 dark:group-hover:text-success-400',
    warning: 'text-warning-400 dark:text-warning-500 group-hover:text-warning-500 dark:group-hover:text-warning-400',
    danger: 'text-danger-400 dark:text-danger-500 group-hover:text-danger-500 dark:group-hover:text-danger-400'
  };

  return (
    <div className="card group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {icon && (
          <div className={cn("transition-colors", iconVariantStyles[variant])}>
            {icon}
          </div>
        )}
      </div>

      <p className={cn("text-3xl font-bold mt-2", variantStyles[variant])}>
        {shouldAnimate ? (
          <AnimatedNumber value={numericValue} />
        ) : (
          value
        )}
      </p>

      {change !== undefined && (
        <div className="flex items-center mt-2">
          <span
            className={cn(
              "text-sm font-medium inline-flex items-center gap-1",
              change > 0 && "text-success-600 dark:text-success-400",
              change < 0 && "text-danger-600 dark:text-danger-400",
              change === 0 && "text-gray-500 dark:text-gray-400"
            )}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : "●"}
            <AnimatedNumber value={Math.abs(change)} decimals={1} suffix="%" />
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs período anterior</span>
        </div>
      )}
    </div>
  );
}
