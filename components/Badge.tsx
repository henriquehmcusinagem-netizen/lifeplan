import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'danger' | 'default';
  icon?: string;
}

export function Badge({ children, variant, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        "badge",
        variant === 'success' && "badge-success",
        variant === 'warning' && "badge-warning",
        variant === 'danger' && "badge-danger",
        variant === 'default' && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
