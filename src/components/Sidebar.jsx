import React from 'react';
import { useTheme } from '../ThemeContext.jsx';

export default function Sidebar({ currentTab, onNavigate, onOpenNotifications }) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Główna', icon: 'home' },
    { id: 'votes', label: 'Głos', icon: 'how_to_vote' },
    { id: 'tickets', label: 'Bilety', icon: 'confirmation_number' },
    { id: 'explore', label: 'Odkrywaj', icon: 'explore' },
    { id: 'profile', label: 'Profil', icon: 'person' },
  ];

  return (
    <aside className="desktop-sidebar bg-surface-container-lowest border-r border-surface-container">
      {/* Brand */}
      <div className="p-5 flex items-center gap-3 border-b border-surface-container">
        <img
          alt="Logo MójToruń"
          className="h-9 w-auto object-contain"
          src="https://lh3.googleusercontent.com/aida/AEtjO1XbbDUDijFFVjYry5j7-RPfXDcGGsfPxaoNp1Yq5-L1Zoa7bQkASm0j-1NoRsEBWOUrM-Y-wSawLrPRyy-IAXtDTRh-trd2qCUVAYocP74BckJ0-iq8vvSuC756id5GPDKPXaFnv-iF_9pPulj56iwMDRRdyA3irXXzV--Kxx4RO-nevTkfJr8a8JnWUC-wjfpJtT5rroJAcrahwuUNh7HWzk8db2norc-42_rweRuQJ4m6eDBA6niT-w8"
        />
        <div className="flex flex-col">
          <span className="font-title-lg text-title-lg text-on-surface tracking-tight font-semibold leading-none">
            MójToruń
          </span>
          <span className="font-label-sm text-label-sm text-secondary mt-0.5">
            Portal Mieszkańca
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer text-left group ${
                isActive
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-lg text-label-lg">
                {item.label}
              </span>
              {item.id === 'votes' && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold">
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 flex flex-col gap-2 border-t border-surface-container pt-3">
        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface hover:bg-surface-container-low transition-all cursor-pointer text-left"
        >
          <span className="material-symbols-outlined text-[22px] text-secondary">notifications</span>
          <span className="font-label-lg text-label-lg text-secondary">Powiadomienia</span>
          <span className="ml-auto w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-on-surface hover:bg-surface-container-low transition-all cursor-pointer text-left"
        >
          <span className="material-symbols-outlined text-[22px] text-secondary">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="font-label-lg text-label-lg text-secondary">
            {isDark ? 'Motyw jasny' : 'Motyw ciemny'}
          </span>
          <div className="ml-auto">
            <div
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                isDark ? 'bg-primary-container' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  isDark ? 'translate-x-4' : 'translate-x-0'
                }`}
              ></div>
            </div>
          </div>
        </button>

        {/* User card */}
        <button
          onClick={() => onNavigate('profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-low transition-all cursor-pointer text-left mt-1"
        >
          <img
            alt="Profil Aleksandry"
            className="w-9 h-9 rounded-full object-cover shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpu-CxsyYFROnKC97ZISDGnAVNZJSMO-8gzdhVX_hJsHeoNzLMhxb_HuGomq6MuXzDWJsYFO02qtqSykSyAfyiDForQCPK7jJUwBYKRRmVP9b89KyQIkOanKnTcPBzrWG1ojpKD2XMg0fKxxJd2pRE1AHV-7TFgpUhQPzXf2L1-cI2uokJMq9outTy9noRn3_tnowuOuQBcZhyYyuK1DLMFrIQNe8nORieBDcAGPx34bVSyrAB-VQ"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
              Aleksandra W.
            </span>
            <span className="font-label-sm text-label-sm text-secondary truncate">
              Stare Miasto
            </span>
          </div>
        </button>
      </div>
    </aside>
  );
}
