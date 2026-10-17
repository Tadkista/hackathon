import React, { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext();

const ICON = { success: 'check_circle', error: 'error', info: 'info' };
const COLOR = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-surface-container-highest text-on-surface',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback((message, { type = 'success', duration = 3200 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-fadeIn ${COLOR[t.type] || COLOR.success}`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-fs-20">{ICON[t.type] || ICON.success}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}
