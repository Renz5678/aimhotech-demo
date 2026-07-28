import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const TOAST_ICONS = {
  error: 'error',
  success: 'check_circle',
  warning: 'warning',
  info: 'info',
};

const TOAST_STYLES = {
  error: 'bg-error text-white',
  success: 'bg-primary text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-surface-container-high text-on-surface',
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="absolute top-12 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto w-full max-w-[340px] flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-2xl shadow-lg cursor-pointer ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}`}
            style={{
              animation: toast.exiting
                ? 'slideOutUp 0.3s ease-in forwards'
                : 'slideInDown 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            <span className="material-symbols-outlined text-[22px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
              {TOAST_ICONS[toast.type] || 'info'}
            </span>
            <span className="font-body-md text-sm font-semibold flex-1 text-left">{toast.message}</span>
            <span className="material-symbols-outlined text-[18px] opacity-60 shrink-0">close</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInDown {
          from { transform: translateY(-24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutUp {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-16px); opacity: 0; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
