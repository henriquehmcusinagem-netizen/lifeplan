'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '@/components/ui/Toast';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
}

interface ToastContextType {
  showToast: (variant: ToastVariant, message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (variant: ToastVariant, message: string) => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, variant, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            message={toast.message}
            onClose={() => {
              setToasts(prev => prev.filter(t => t.id !== toast.id));
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
