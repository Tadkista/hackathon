import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/* ───────────── Modal: dims the whole screen, closes on backdrop click and Escape ───────────── */
const modalStack = [];

export function Modal({ onClose, children, size = 'md', center = false, locked = false, labelledBy }) {
  const idRef = React.useRef(Symbol('modal'));
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  const lockedRef = React.useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    const id = idRef.current;
    modalStack.push(id);
    const onKey = (e) => {
      if (e.key !== 'Escape' || modalStack[modalStack.length - 1] !== id || lockedRef.current) return;
      e.preventDefault();
      closeRef.current?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      const i = modalStack.indexOf(id);
      if (i >= 0) modalStack.splice(i, 1);
    };
  }, []);

  const width = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }[size] || 'max-w-md';
  return (
    <div
      data-shared-modal=""
      className={`!m-0 fixed inset-0 z-50 flex ${center ? 'items-center' : 'items-end sm:items-center'} justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn`}
      onClick={(e) => { if (e.target === e.currentTarget && !locked) onClose?.(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`bg-surface-container-lowest w-full ${width} ${center ? 'rounded-2xl' : 'rounded-t-2xl sm:rounded-2xl'} p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, icon, onClose, id }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        {icon && <span aria-hidden="true" className="material-symbols-outlined text-fs-22 text-on-surface-variant">{icon}</span>}
        <h3 id={id} className="font-title-lg text-title-lg text-on-surface font-semibold truncate">{title}</h3>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Zamknij"
          className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer shrink-0"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-fs-18">close</span>
        </button>
      )}
    </div>
  );
}

/* ───────────── Controls ───────────── */
export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 disabled:opacity-50 ${checked ? 'bg-emerald-500' : 'bg-surface-container-high'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </button>
  );
}

export function Segmented({ value, options, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex sm:inline-flex flex-wrap gap-1 p-1 bg-surface-container rounded-xl">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            value === o.value ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-secondary hover:text-on-surface'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({ active, onClick, children, icon, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
        active ? 'bg-primary text-white' : 'bg-surface-container text-secondary hover:text-on-surface'
      }`}
    >
      {icon && <span aria-hidden="true" className="material-symbols-outlined text-fs-14">{icon}</span>}
      {children}
      {count != null && <span className="opacity-70">{count}</span>}
    </button>
  );
}

export function PageHeader({ title, subtitle, icon, right }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1 pb-1">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-22">{icon}</span>
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">{title}</h1>
          {subtitle && <p className="text-secondary text-body-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function Avatar({ user, size = 36, className = '' }) {
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}` : '?';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-surface-container-high text-on-surface font-bold shrink-0 select-none ${className}`}
      style={{ width: `${size / 16}rem`, height: `${size / 16}rem`, fontSize: `calc(${size / 16 * 0.38}rem * var(--font-scale, 1))` }}
      aria-hidden="true"
    >
      {initials.toUpperCase()}
    </span>
  );
}

/* ───────────── Real, scannable QR code ───────────── */
export function QrCode({ value, size = 220, label = 'Kod QR', className = '' }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, { margin: 1, width: size * 2, errorCorrectionLevel: 'M', color: { dark: '#0f172a', light: '#ffffff' } })
      .then((u) => { if (alive) setSrc(u); })
      .catch(() => { if (alive) setSrc(''); });
    return () => { alive = false; };
  }, [value, size]);
  return src ? (
    <img src={src} alt={label} width={size} height={size} className={`block bg-white ${className}`} style={{ imageRendering: 'pixelated' }} />
  ) : (
    <div className={`bg-white ${className}`} style={{ width: size, height: size }} aria-label={label} />
  );
}

export function Spinner({ className = '' }) {
  return <span className={`material-symbols-outlined animate-spin ${className}`} aria-hidden="true">progress_activity</span>;
}

export const maskPesel = (p) => (p ? `${p.slice(0, 6)}•••••` : '');
export const formatDatePl = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};
