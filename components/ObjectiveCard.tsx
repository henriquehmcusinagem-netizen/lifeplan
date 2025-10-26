'use client';

import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';
import { formatCurrency } from '@/lib/utils';

interface ObjectiveCardProps {
  title: string;
  icon: string;
  current: number;
  target: number;
  priority: number;
  timeRemaining: string;
  recommendation?: string;
}

export function ObjectiveCard({
  title,
  icon,
  current,
  target,
  priority,
  timeRemaining,
  recommendation,
}: ObjectiveCardProps) {
  const stars = '⭐'.repeat(Math.round(priority / 2));

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Prioridade: {stars} {priority}/10</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <ProgressBar current={current} target={target} />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>⏱️</span>
          <span>{timeRemaining}</span>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="bg-primary-50 dark:bg-primary-900 border border-primary-100 dark:border-primary-800 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-sm">💡</span>
            <p className="text-sm text-primary-700 dark:text-primary-400">{recommendation}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors">
          Ver Cenários
        </button>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Editar
        </button>
      </div>
    </div>
  );
}
