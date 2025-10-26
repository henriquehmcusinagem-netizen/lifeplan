import { formatCurrency } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
}

export function ProgressBar({ current, target, label }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 dark:bg-primary-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(current)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(target)}</p>
      </div>
    </div>
  );
}
