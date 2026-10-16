import React from 'react';
import { useTheme } from '../ThemeContext.jsx';

export default function Header({ currentTab, onNavigate, onOpenNotifications, unreadNotificationsCount = 2 }) {
  const { isDark, toggleTheme } = useTheme();

  const tabTitles = {
    home: 'Główna',
    parking: 'Parkowanie i Mapa SPP',
    tickets: 'Bilety i Karta',
    votes: 'Budżet i Inwestycje',
    profile: 'Mój Profil'
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/60 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer focus:outline-none"
        >
          <img
            alt="Herb Torunia"
            className="h-8 w-auto object-contain"
            src="/herb_torunia.svg"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-on-surface tracking-tight leading-none">
                MójToruń
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-primary dark:bg-rose-950/60 dark:text-rose-300">
                MIASTO
              </span>
            </div>
            <span className="text-[11px] text-secondary truncate mt-0.5 font-medium">
              {tabTitles[currentTab] || 'Główna'}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus:outline-none"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            aria-label="Powiadomienia miejskie"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus:outline-none"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span>
            )}
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            aria-label="Profil mieszkańca"
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none ${
              currentTab === 'profile' ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/20'
            }`}
            type="button"
          >
            <img
              alt="Profil Aleksandry"
              className="w-8 h-8 rounded-full object-cover shadow-xs"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpu-CxsyYFROnKC97ZISDGnAVNZJSMO-8gzdhVX_hJsHeoNzLMhxb_HuGomq6MuXzDWJsYFO02qtqSykSyAfyiDForQCPK7jJUwBYKRRmVP9b89KyQIkOanKnTcPBzrWG1ojpKD2XMg0fKxxJd2pRE1AHV-7TFgpUhQPzXf2L1-cI2uokJMq9outTy9noRn3_tnowuOuQBcZhyYyuK1DLMFrIQNe8nORieBDcAGPx34bVSyrAB-VQ"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
