import React from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { ROLE_LABEL } from '../data/identities.js';
import { navFor } from '../navConfig.js';
import { Avatar } from './ui.jsx';

export default function Sidebar({ currentTab, onNavigate, onOpenNotifications }) {
  const { isDark, toggleTheme } = useTheme();
  const { role, user, isGuest } = useAuth();
  const items = navFor(role);

  return (
    <aside className="desktop-sidebar bg-surface-container-lowest border-r border-outline-variant/60 shadow-sm">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        aria-label="MójToruń – strona główna"
        className="w-full p-6 flex items-center gap-3.5 border-b border-outline-variant/60 text-left cursor-pointer hover:bg-surface-container-low transition-colors focus:outline-none"
      >
        <img alt="Herb Torunia" className="h-10 w-auto object-contain" src="/herb_torunia.svg" />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-on-surface tracking-tight leading-none">MójToruń</span>
          <span className="text-xs text-secondary mt-1 font-medium">{isGuest ? 'Przewodnik po mieście' : 'Portal Mieszkańca'}</span>
        </div>
      </button>

      <nav className="flex-1 px-3.5 py-5 flex flex-col space-y-1.5 overflow-y-auto" aria-label="Menu główne">
        <span className="px-3 pb-1 text-fs-11 font-bold text-secondary uppercase tracking-wider">Menu główne</span>
        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer text-left group ${
                isActive
                  ? 'bg-surface-container text-on-surface dark:bg-surface-container-high dark:text-white font-semibold shadow-xs ring-1 ring-outline-variant/80 dark:ring-white/10'
                  : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface transition-colors'
              }`}
            >
              <span aria-hidden="true" className={`material-symbols-outlined text-fs-21 transition-transform ${isActive ? 'scale-105 text-on-surface dark:text-white' : 'text-secondary group-hover:text-on-surface'}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
              {item.id === 'votes' && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-primary text-white font-bold text-fs-10">3</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3.5 pb-5 flex flex-col space-y-2 border-t border-outline-variant/60 pt-4">
        <button onClick={onOpenNotifications} type="button" className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-all cursor-pointer text-left group">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20 text-secondary group-hover:text-on-surface">notifications</span>
          <span className="text-xs text-secondary font-medium group-hover:text-on-surface">Powiadomienia</span>
          <span className="ml-auto w-2 h-2 rounded-full bg-on-surface animate-pulse"></span>
        </button>

        <button onClick={toggleTheme} type="button" className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-on-surface hover:bg-surface-container-low transition-all cursor-pointer text-left group">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20 text-secondary group-hover:text-on-surface">{isDark ? 'light_mode' : 'dark_mode'}</span>
          <span className="text-xs text-secondary font-medium group-hover:text-on-surface">{isDark ? 'Motyw jasny' : 'Motyw ciemny'}</span>
          <div className="ml-auto">
            <div className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${isDark ? 'bg-primary' : 'bg-surface-container-high'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${isDark ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-current={currentTab === 'profile' ? 'page' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low border transition-all cursor-pointer text-left mt-2 ${
            currentTab === 'profile' ? 'bg-surface-container border-outline-variant/60' : 'border-transparent hover:border-outline-variant/60'
          }`}
        >
          <Avatar user={user} size={36} />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-on-surface truncate">
              {isGuest ? 'Gość' : `${user?.firstName} ${user?.lastName?.[0] ?? ''}.`}
            </span>
            <span className="text-fs-11 text-secondary truncate">{ROLE_LABEL[role] || 'Mieszkaniec'}</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
