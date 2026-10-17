import React from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { Avatar } from './ui.jsx';

export default function Header({ currentTab, onNavigate, onOpenNotifications, unreadNotificationsCount = 2 }) {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/60 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="MójToruń – strona główna"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer focus:outline-none"
        >
          <img alt="Herb Torunia" className="h-8 w-auto object-contain" src="/herb_torunia.svg" />
          <span className="text-base font-bold text-on-surface tracking-tight leading-none">MójToruń</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus:outline-none"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-fs-20">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Powiadomienia miejskie"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus:outline-none"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-fs-22">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="Profil"
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none ${
              currentTab === 'profile' ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/20'
            }`}
          >
            <Avatar user={user} size={32} />
          </button>
        </div>
      </div>
    </header>
  );
}
