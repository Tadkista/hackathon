import React, { createContext, useCallback, useContext, useState } from 'react';

const KEY = 'mojtorun-session';
const AuthContext = createContext();

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(read);

  const login = useCallback((next) => {
    setSession(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }, []);

  const role = session?.role ?? null;
  const value = {
    session,
    role,
    user: session?.user ?? null,
    method: session?.method ?? null,
    isGuest: role === 'guest',
    isChild: role === 'child',
    isSenior: role === 'senior',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
