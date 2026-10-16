import React from 'react';

export default function NotificationsModal({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Czasowa zmiana organizacji ruchu',
      desc: 'Most im. Józefa Piłsudskiego – prace serwisowe oświetlenia od godz. 21:00.',
      time: '15 min temu',
      icon: 'warning',
      color: 'text-error bg-error-container',
      actionTab: 'parking',
      actionText: 'Sprawdź objazd'
    },
    {
      id: 2,
      title: 'Odpady komunalne – jutro wywóz',
      desc: 'Rejon 4: Papier i Bioodpady. Wystaw pojemniki przed 6:00.',
      time: '1 godz. temu',
      icon: 'delete',
      color: 'text-tertiary-container bg-tertiary-fixed',
      actionTab: 'home',
      actionText: 'Zobacz harmonogram'
    },
    {
      id: 3,
      title: 'Budżet Obywatelski 2025',
      desc: 'Pozostało tylko 3 dni na oddanie głosu na projekty ogólnomiejskie!',
      time: '3 godz. temu',
      icon: 'how_to_vote',
      color: 'text-primary bg-primary-fixed',
      actionTab: 'votes',
      actionText: 'Oddaj głos'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto">
        <div className="w-12 h-1 bg-surface-container-high rounded-full mx-auto sm:hidden mb-2"></div>
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">notifications</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Powiadomienia miejskie</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 py-3">
          {notifications.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2 hover:bg-surface-container transition-colors">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md font-semibold text-on-surface truncate">
                      {item.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigate(item.actionTab);
                }}
                className="self-end px-3 py-1 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
              >
                {item.actionText} →
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors font-semibold"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
}
