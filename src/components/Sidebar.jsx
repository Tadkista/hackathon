import React from 'react';
import { useTheme } from '../ThemeContext.jsx';

export default function Sidebar({ currentTab, onNavigate, onOpenNotifications }) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Strona główna', icon: 'home' },
    { id: 'parking', label: 'Parkowanie i Mapa', icon: 'local_parking' },
    { id: 'tickets', label: 'Bilety i Karta', icon: 'confirmation_number' },
    { id: 'votes', label: 'Budżet i Inwestycje', icon: 'how_to_vote' },
  ];

  return (
    <aside className="desktop-sidebar bg-surface-container-lowest border-r border-outline-variant/60 shadow-sm">
      {/* Brand Header */}
      <button
        type="button"
        onClick={() => onNavigate('home')}
        aria-label="MójToruń – strona główna"
        className="w-full p-6 flex items-center gap-3.5 border-b border-outline-variant/60 text-left cursor-pointer hover:bg-surface-container-low transition-colors focus:outline-none"
      >
        <img
          alt="Herb Torunia"
          className="h-10 w-auto object-contain"
          src="/herb_torunia.svg"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-on-surface tracking-tight leading-none">
              MójToruń
            </span>
          </div>
          <span className="text-xs text-secondary mt-1 font-medium">
            Portal Mieszkańca
          </span>
        </div>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 px-3.5 py-5 flex flex-col space-y-1.5">
        <span className="px-3 pb-1 text-[11px] font-bold text-secondary uppercase tracking-wider">
          Menu główne
        </span>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left group ${
                isActive
                  ? 'bg-rose-50 text-primary dark:bg-rose-950/40 dark:text-rose-300 font-semibold shadow-xs ring-1 ring-primary/10 dark:ring-rose-500/20'
                  : 'text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[21px] transition-transform ${
                  isActive ? 'scale-105 text-primary dark:text-rose-300' : 'text-secondary group-hover:text-primary'
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">
                {item.label}
              </span>
              {item.id === 'votes' && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-primary text-white font-bold text-[10px]">
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User & Preferences */}
      <div className="px-3.5 pb-5 flex flex-col space-y-2 border-t border-outline-variant/60 pt-4">
        {/* Notifications Shortcut */}
        <button
          onClick={onOpenNotifications}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-all cursor-pointer text-left group"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary group-hover:text-primary">
            notifications
          </span>
          <span className="text-xs text-secondary font-medium group-hover:text-on-surface">
            Powiadomienia
          </span>
          <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-all cursor-pointer text-left group"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary group-hover:text-primary">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="text-xs text-secondary font-medium group-hover:text-on-surface">
            {isDark ? 'Motyw jasny' : 'Motyw ciemny'}
          </span>
          <div className="ml-auto">
            <div
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                isDark ? 'bg-primary' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${
                  isDark ? 'translate-x-4' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </div>
        </button>

        {/* Resident profile preview */}
        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low border transition-all cursor-pointer text-left mt-2 ${
            currentTab === 'profile'
              ? 'bg-surface-container border-outline-variant/60'
              : 'border-transparent hover:border-outline-variant/60'
          }`}
        >
          <div className="relative">
            <img
              alt="Profil Aleksandry"
              className="w-9 h-9 rounded-full object-cover shadow-xs ring-1 ring-outline-variant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpu-CxsyYFROnKC97ZISDGnAVNZJSMO-8gzdhVX_hJsHeoNzLMhxb_HuGomq6MuXzDWJsYFO02qtqSykSyAfyiDForQCPK7jJUwBYKRRmVP9b89KyQIkOanKnTcPBzrWG1ojpKD2XMg0fKxxJd2pRE1AHV-7TFgpUhQPzXf2L1-cI2uokJMq9outTy9noRn3_tnowuOuQBcZhyYyuK1DLMFrIQNe8nORieBDcAGPx34bVSyrAB-VQ"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-on-surface truncate">
              Aleksandra W.
            </span>
            <span className="text-[11px] text-secondary truncate">
              Mieszkanka Torunia
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}
