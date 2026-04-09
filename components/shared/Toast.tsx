'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-2xl animate-stakeConfirm min-w-[300px]",
              t.type === 'success' ? "bg-surface border-primary/40 text-text-primary" :
              t.type === 'error' ? "bg-surface border-accent-rose/40 text-text-primary" :
              "bg-surface border-accent-indigo/40 text-text-primary"
            )}
          >
            {t.type === 'success' && <CheckCircle className="text-primary shrink-0" size={20} />}
            {t.type === 'error' && <AlertCircle className="text-accent-rose shrink-0" size={20} />}
            {t.type === 'info' && <Info className="text-accent-indigo shrink-0" size={20} />}
            <p className="text-sm font-semibold">{t.message}</p>
            <button 
              onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
              className="ml-auto text-text-muted hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
