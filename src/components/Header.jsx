import React from 'react';

export default function Header({ currentTab, onNavigate, onOpenNotifications, unreadNotificationsCount = 2 }) {
  const tabTitles = {
    home: 'Główna',
    votes: 'Głos',
    tickets: 'Bilety',
    explore: 'Odkrywaj',
    profile: 'Profil'
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(11,28,48,0.04)]">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-space-sm hover:opacity-90 transition-opacity text-left cursor-pointer focus:outline-none"
        >
          <img
            alt="Logo MójToruń"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XbbDUDijFFVjYry5j7-RPfXDcGGsfPxaoNp1Yq5-L1Zoa7bQkASm0j-1NoRsEBWOUrM-Y-wSawLrPRyy-IAXtDTRh-trd2qCUVAYocP74BckJ0-iq8vvSuC756id5GPDKPXaFnv-iF_9pPulj56iwMDRRdyA3irXXzV--Kxx4RO-nevTkfJr8a8JnWUC-wjfpJtT5rroJAcrahwuUNh7HWzk8db2norc-42_rweRuQJ4m6eDBA6niT-w8"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-title-lg text-title-lg text-on-surface tracking-tight leading-none font-semibold">
                MójToruń
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm leading-none font-semibold">
                Toruń
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary truncate mt-0.5">
              {tabTitles[currentTab] || 'Główna'}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-space-xs">
          <button
            onClick={onOpenNotifications}
            aria-label="Powiadomienia miejskie"
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer focus:outline-none"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => onNavigate('profile')}
            aria-label="Profil mieszkańca"
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all cursor-pointer focus:outline-none ${
              currentTab === 'profile' ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-2 hover:ring-primary/20'
            }`}
            type="button"
          >
            <img
              alt="Profil Aleksandry"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpu-CxsyYFROnKC97ZISDGnAVNZJSMO-8gzdhVX_hJsHeoNzLMhxb_HuGomq6MuXzDWJsYFO02qtqSykSyAfyiDForQCPK7jJUwBYKRRmVP9b89KyQIkOanKnTcPBzrWG1ojpKD2XMg0fKxxJd2pRE1AHV-7TFgpUhQPzXf2L1-cI2uokJMq9outTy9noRn3_tnowuOuQBcZhyYyuK1DLMFrIQNe8nORieBDcAGPx34bVSyrAB-VQ"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
