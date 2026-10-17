import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const KEY = 'mojtorun-prefs';

export const FONT_SCALE = { small: 0.9, normal: 1, large: 1.15, xlarge: 1.3 };
export const UI_SCALE = { compact: 0.9, normal: 1, large: 1.12 };

const DEFAULTS = { hc: false, font: 'normal', ui: 'normal', biometrics: false, twoFA: false };

function read() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch (e) {
    return { ...DEFAULTS };
  }
}

const PrefsContext = createContext();

export function PrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(read);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('hc', !!prefs.hc);
    root.style.setProperty('--font-scale', String(FONT_SCALE[prefs.font] || 1));
    root.style.setProperty('--ui-scale', String(UI_SCALE[prefs.ui] || 1));
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }, [prefs]);

  const setPref = useCallback((key, value) => setPrefs((p) => ({ ...p, [key]: value })), []);
  const resetPrefs = useCallback(() => setPrefs({ ...DEFAULTS }), []);

  return (
    <PrefsContext.Provider value={{ prefs, setPref, resetPrefs }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
