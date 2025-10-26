'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, Lightbulb, Info } from 'lucide-react';

interface AlertCardProps {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AlertCard({ type, title, message, action }: AlertCardProps) {
  const config = {
    warning: {
      icon: AlertTriangle,
      bg: 'bg-warning-50 dark:bg-warning-900',
      border: 'border-warning-200 dark:border-warning-800',
      text: 'text-warning-700 dark:text-warning-400',
      iconColor: 'text-warning-500 dark:text-warning-400',
    },
    info: {
      icon: Lightbulb,
      bg: 'bg-primary-50 dark:bg-primary-900',
      border: 'border-primary-200 dark:border-primary-800',
      text: 'text-primary-700 dark:text-primary-400',
      iconColor: 'text-primary-500 dark:text-primary-400',
    },
    success: {
      icon: Info,
      bg: 'bg-success-50 dark:bg-success-900',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-700 dark:text-success-400',
      iconColor: 'text-success-500 dark:text-success-400',
    },
  };

  const { icon: Icon, bg, border, text, iconColor } = config[type];

  return (
    <div className={cn('rounded-lg p-4 border', bg, border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 mt-0.5', iconColor)} />
        <div className="flex-1">
          <h4 className={cn('font-semibold text-sm mb-1', text)}>{title}</h4>
          <p className={cn('text-sm', text)}>{message}</p>

          {action && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={action.onClick}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {action.label}
              </button>
              <button className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                Ignorar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
