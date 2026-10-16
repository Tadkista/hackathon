import React from 'react';

export default function HomeScreen({ onNavigate, onTriggerVoteModal }) {
  return (
    <div className="flex flex-col w-full px-margin pb-6 gap-space-lg max-w-2xl mx-auto">
      {/* Header Welcome & Weather/Eco Pill */}
      <section className="flex flex-col gap-space-xs mt-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
              Toruń, Stare Miasto
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mt-0.5 font-bold">
              Dzień dobry, Aleksandro!
            </h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
          </div>
        </div>

        {/* Weather & Air Quality Badge */}
        <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container self-start shadow-sm mt-1">
          <span className="font-label-md text-label-md text-on-surface font-semibold">18°C</span>
          <span className="w-1 h-1 rounded-full bg-secondary"></span>
          <span className="material-symbols-outlined text-[16px] text-tertiary">eco</span>
          <span className="font-label-md text-label-md text-on-surface">
            Jakość powietrza: <span className="font-semibold text-tertiary">Bardzo dobra (AQI 22)</span>
          </span>
        </div>
      </section>

      {/* City Alert Banner */}
      <section className="rounded-xl bg-error-container text-on-error-container p-space-md shadow-sm flex items-start gap-space-md relative overflow-hidden">
        <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center shrink-0 text-error">
          <span className="material-symbols-outlined text-[22px]">warning</span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-error">
              Komunikat drogowy
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            <span className="font-label-sm text-label-sm text-secondary">Dzisiaj</span>
          </div>
          <p className="font-title-md text-title-md font-semibold text-on-surface mt-0.5 leading-snug">
            Czasowa zmiana organizacji ruchu
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
            Most im. Józefa Piłsudskiego – prace serwisowe oświetlenia od godz. 21:00. Zwężenie do jednego pasa.
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="mt-2.5 self-start px-3 py-1 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md font-medium shadow-sm active:scale-95 transition-transform flex items-center gap-1 cursor-pointer"
          >
            <span>Szczegóły objazdów</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Quick Access Grid (Thumb friendly) */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Szybki dostęp</h2>
          <span className="font-label-md text-label-md text-secondary">Kluczowe usługi</span>
        </div>
        <div className="grid grid-cols-2 gap-space-sm">
          {/* Buy Ticket Button (Hero Primary Action) */}
          <button
            onClick={() => onNavigate('tickets')}
            className="group flex flex-col justify-between p-space-md rounded-xl bg-primary-container text-on-primary text-left shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-on-primary/10 flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[24px]">directions_transit</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-on-primary-container group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </div>
            <div className="mt-4">
              <span className="font-title-md text-title-md font-semibold block leading-tight text-white">
                Kup bilet MZK
              </span>
              <span className="font-label-sm text-label-sm text-on-primary-container block mt-0.5">
                Autobus &amp; Tramwaj
              </span>
            </div>
          </button>

          {/* Resident Card / QR */}
          <button
            onClick={() => onNavigate('tickets')}
            className="group flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest text-on-surface text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-secondary group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </div>
            <div className="mt-4">
              <span className="font-title-md text-title-md font-semibold block leading-tight">
                Karta Torunianina
              </span>
              <span className="font-label-sm text-label-sm text-secondary block mt-0.5">
                Pokaż kod QR
              </span>
            </div>
          </button>

          {/* Report Case / Idea */}
          <button
            onClick={() => onNavigate('votes')}
            className="group flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest text-on-surface text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[24px]">lightbulb</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-secondary group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </div>
            <div className="mt-4">
              <span className="font-title-md text-title-md font-semibold block leading-tight">
                Zgłoś sprawę
              </span>
              <span className="font-label-sm text-label-sm text-secondary block mt-0.5">
                Usterki i inicjatywy
              </span>
            </div>
          </button>

          {/* City Map & Parking */}
          <button
            onClick={() => onNavigate('explore')}
            className="group flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest text-on-surface text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">local_parking</span>
              </div>
              <span className="material-symbols-outlined text-[20px] text-secondary group-hover:translate-x-0.5 transition-transform">
                chevron_right
              </span>
            </div>
            <div className="mt-4">
              <span className="font-title-md text-title-md font-semibold block leading-tight">
                Parkowanie &amp; Mapa
              </span>
              <span className="font-label-sm text-label-sm text-secondary block mt-0.5">
                Wolne miejsca SPP
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Waste Management Status Tile */}
      <section className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[26px]">delete</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label-sm text-label-sm font-semibold uppercase text-tertiary tracking-wide">
                Odpady komunalne
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high font-label-sm text-label-sm text-secondary">
                Rejon 4
              </span>
            </div>
            <p className="font-title-md text-title-md font-semibold text-on-surface mt-0.5 truncate">
              Jutro: Papier i Bioodpady
            </p>
            <span className="font-body-sm text-body-sm text-secondary truncate">
              Przygotuj pojemniki do godz. 06:00
            </span>
          </div>
        </div>
        <button
          aria-label="Harmonogram wywozu"
          onClick={() => alert('Harmonogram Rejonu 4 (Stare Miasto):\n• Poniedziałek: Papier i Bio\n• Środa: Tworzywa sztuczne\n• Piątek: Odpady zmieszane')}
          className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 hover:bg-surface-container-high transition-colors cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
        </button>
      </section>

      {/* Civic Budget Highlight */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[20px] text-primary">how_to_vote</span>
            <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Budżet Obywatelski 2025</h2>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
            Aktywne
          </span>
        </div>

        {/* Featured Consultation Card */}
        <div className="rounded-xl bg-surface-container-lowest overflow-hidden shadow-sm flex flex-col">
          <div className="relative h-40 w-full bg-surface-container-high overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Zielone bulwary nad Wisłą"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTltgh5A9Hnb1xvzYvKW7YIe9-JmTv5pDh8IihoB2i8b-6w7BJnxuhaZYCo8YEOfRqQ7AO2S7O5sPNH4DsOdLSRZQ6LXobKzbQKICpu9oZiJe8le5fHT57vBaPW51vhU5RMrTqwSWPmh5NN5rf4_qCLzrvCZ6Il5V1PfZtZEsUiK3Fbifej4I2YzzIkG9ULbS4aS0_bQiZgMQHtYysIhzs8gr3iVP8iOwXPZYLYjTTgSq1jTbb_sX9"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span className="px-2 py-0.5 rounded bg-on-background/60 backdrop-blur-md font-label-sm text-label-sm">
                Projekt ogólnomiejski #14
              </span>
              <span className="flex items-center gap-1 font-label-sm text-label-sm text-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                Pozostało 3 dni
              </span>
            </div>
          </div>
          <div className="p-space-md flex flex-col gap-space-sm">
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-bold">
                Zielone bulwary nad Wisłą – etap II
              </h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Nowe strefy rekreacyjne, 120 rodzimych drzew, sensoryczny plac zabaw oraz energooszczędne oświetlenie parkowe.
              </p>
            </div>
            {/* Progress bar & Votes */}
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between items-center text-secondary font-label-sm text-label-sm">
                <span>Dotychczas oddano: <strong className="text-on-surface font-semibold">1 842 głosy</strong></span>
                <span>Cel: 2 500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '74%' }}></div>
              </div>
            </div>
            {/* Voting Action */}
            <div className="flex items-center gap-space-sm pt-2">
              <button
                onClick={() => {
                  if (onTriggerVoteModal) {
                    onTriggerVoteModal();
                  } else {
                    onNavigate('votes');
                  }
                }}
                className="flex-1 h-11 px-4 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
                <span>Oddaj swój głos</span>
              </button>
              <button
                onClick={() => onNavigate('votes')}
                aria-label="Więcej informacji o projekcie"
                className="h-11 w-11 rounded-lg bg-surface-container flex items-center justify-center text-secondary active:scale-95 transition-transform hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">info</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Municipal Stats / Toruń w Liczbach */}
      <section className="grid grid-cols-2 gap-space-sm">
        <button
          onClick={() => onNavigate('votes')}
          className="rounded-xl bg-surface-container-low p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between text-secondary mb-2">
            <span className="font-label-sm text-label-sm font-medium">Konsultacje</span>
            <span className="material-symbols-outlined text-[18px] text-primary">forum</span>
          </div>
          <div>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">12</span>
            <p className="font-label-sm text-label-sm text-secondary mt-0.5">Aktywnych tematów</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('votes')}
          className="rounded-xl bg-surface-container-low p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
        >
          <div className="flex items-center justify-between text-secondary mb-2">
            <span className="font-label-sm text-label-sm font-medium">Sprawy Torunian</span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">task_alt</span>
          </div>
          <div>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">87%</span>
            <p className="font-label-sm text-label-sm text-secondary mt-0.5">Zrealizowanych w terminie</p>
          </div>
        </button>
      </section>

      {/* Municipal News & Upcoming Events */}
      <section className="flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Aktualności &amp; Wydarzenia</h2>
          <button
            onClick={() => onNavigate('explore')}
            className="font-label-md text-label-md text-primary font-medium flex items-center hover:underline cursor-pointer"
          >
            Wszystkie
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-sm">
          {/* News 1: Inwestycje */}
          <div
            onClick={() => onNavigate('explore')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex gap-space-sm items-center cursor-pointer active:scale-[0.99] transition-transform hover:shadow-md"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Nowe tramwaje niskopodłogowe"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARx_H-XS4Ca2tUVYPq8dsxd7M96RE9QSU07K4RUPk7WhQdqaWrcuChPV29i7rKn5aeCEUSwnBwygcIPE6ooM1Oklq4XhHq3nDAJNFLwWrRBc-P4xcYMyOoQLyrmESzYRgVCqGT286CsFMGpi_24KHs3-pOZ0Ls43QHjqmhVNqy9n8sPMN5VDtTioRGJ0tG9pl09kcFkepl-0XM6Byz_j2P0ZFIWhEa0V-JwtPG4M31setV-or_eO5w"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  Inwestycje
                </span>
                <span className="font-label-sm text-label-sm text-secondary">2 godz. temu</span>
              </div>
              <h4 className="font-title-md text-title-md font-semibold text-on-surface mt-1 line-clamp-2 leading-tight">
                Nowe tramwaje niskopodłogowe dotarły do Torunia
              </h4>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5 truncate">
                Flota MZK zyskała 5 nowoczesnych składów klimatyzowanych.
              </span>
            </div>
          </div>

          {/* News 2: Kultura */}
          <div
            onClick={() => onNavigate('explore')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex gap-space-sm items-center cursor-pointer active:scale-[0.99] transition-transform hover:shadow-md"
          >
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Święto Miasta Torunia"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTZmdRD0mDoXH9U_qjk7sjUiKAIe1aFYMVvkMnsQOzmtMZaiwskQaEDw7kEjUphHZBcvqIi9AzcNNQetAdo0bWi4d-g9ZdMu5JBxutrTGUhZE57wZ-wNnVyVgGaMytKCJDxja8WdWIs1MS4thcS7oJ5hNLT61Pddsy7Xirr7kahFUzDSHSc_qFmqMhKtYgT7gCEQqv64HIxj7QPH7P_P3DF41Uv-9KnX_ljCDlWaGeXaj3K3PPP3l_"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
                  Kultura
                </span>
                <span className="font-label-sm text-label-sm text-secondary">12-14 Czerwca</span>
              </div>
              <h4 className="font-title-md text-title-md font-semibold text-on-surface mt-1 line-clamp-2 leading-tight">
                Święto Miasta Torunia – program i bezpłatne wejściówki
              </h4>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5 truncate">
                Koncerty plenerowe, teatr światła i piernikowy festyn.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
