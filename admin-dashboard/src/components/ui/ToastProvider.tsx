'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  exiting: boolean;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useAdminToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useAdminToast must be used within ToastProvider');
  return ctx;
};

const ICONS: Record<ToastType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-[#4C7A5A] text-white',
  error: 'bg-[#B0523F] text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-[#1E3A2F] text-white',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter(t => t.id !== id)), 300);
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl cursor-pointer min-w-[260px] max-w-[380px] ${STYLES[toast.type]}`}
              style={{
                animation: toast.exiting
                  ? 'toastSlideOut 0.25s ease-in forwards'
                  : 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
              }}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                {ICONS[toast.type]}
              </span>
              <span className="text-sm font-semibold flex-1 leading-snug">{toast.message}</span>
              <span className="material-symbols-outlined text-[16px] opacity-60 shrink-0">close</span>
            </div>
          ))}
          <style>{`
            @keyframes toastSlideIn {
              from { transform: translateX(40px); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes toastSlideOut {
              from { transform: translateX(0); opacity: 1; }
              to { transform: translateX(40px); opacity: 0; }
            }
          `}</style>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
