import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { NAV, ROLE_MOBILE_PRIMARY, navFor } from '../navConfig.js';
import { Modal, ModalHeader } from './ui.jsx';

export default function BottomNav({ currentTab, onNavigate }) {
  const { role } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const primaryIds = ROLE_MOBILE_PRIMARY[role] || ROLE_MOBILE_PRIMARY.guest;
  const all = navFor(role);
  const primary = primaryIds.map((id) => ({ id, ...NAV[id] }));
  const rest = all.filter((i) => !primaryIds.includes(i.id));
  const moreActive = rest.some((i) => i.id === currentTab);

  const tabs = [
    ...primary.map((i) => ({ ...i, active: currentTab === i.id, onClick: () => onNavigate(i.id) })),
    ...(rest.length ? [{ id: 'more', short: 'Więcej', icon: 'apps', active: moreActive, onClick: () => setMoreOpen(true), expanded: moreOpen }] : []),
    { id: 'profile', ...NAV.profile, active: currentTab === 'profile', onClick: () => onNavigate('profile') },
  ];

  return (
    <>
      <nav aria-label="Menu dolne" className="fixed bottom-0 w-full z-40 pb-safe bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_-4px_16px_rgba(11,28,48,0.06)] border-t border-surface-container">
        <div className="h-16 px-space-xs flex items-center justify-around max-w-2xl mx-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-current={item.active && item.id !== 'more' ? 'page' : undefined}
              aria-haspopup={item.id === 'more' ? 'dialog' : undefined}
              className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 transition-colors cursor-pointer focus:outline-none ${item.active ? 'text-primary font-semibold' : 'text-secondary hover:text-on-surface'}`}
            >
              <span aria-hidden="true" className={`material-symbols-outlined text-fs-24 mb-0.5 transition-transform ${item.active ? 'scale-110' : ''}`}
                style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm leading-none">{item.short}</span>
            </button>
          ))}
        </div>
      </nav>

      {moreOpen && (
        <Modal onClose={() => setMoreOpen(false)} labelledBy="more-title">
          <ModalHeader id="more-title" title="Więcej" icon="apps" onClose={() => setMoreOpen(false)} />
          <ul className="grid grid-cols-2 gap-2.5">
            {rest.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  onClick={() => { setMoreOpen(false); onNavigate(i.id); }}
                  className={`w-full h-full min-h-[5.5rem] p-3.5 rounded-2xl border text-left flex flex-col items-start justify-between gap-2.5 cursor-pointer transition-colors ${currentTab === i.id ? 'bg-surface-container border-outline' : 'bg-surface-container-low border-transparent hover:border-outline-variant'}`}
                >
                  <span className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-20">{i.icon}</span>
                  </span>
                  <span className="text-sm font-semibold text-on-surface leading-tight max-w-full [overflow-wrap:anywhere] hyphens-auto" lang="pl">{i.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </>
  );
}
