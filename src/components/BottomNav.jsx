import React from 'react';

export default function BottomNav({ currentTab, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Główna', icon: 'home' },
    { id: 'votes', label: 'Głos', icon: 'how_to_vote' },
    { id: 'tickets', label: 'Bilety', icon: 'confirmation_number' },
    { id: 'explore', label: 'Odkrywaj', icon: 'explore' },
    { id: 'profile', label: 'Profil', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(11,28,48,0.06)] border-t border-surface-container">
      <div className="h-16 px-space-xs flex items-center justify-around max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[56px] h-14 transition-colors cursor-pointer focus:outline-none ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[24px] mb-0.5 transition-transform ${
                  isActive ? 'scale-110' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
