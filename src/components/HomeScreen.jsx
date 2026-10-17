import React from 'react';

export default function HomeScreen({ onNavigate, onTriggerVoteModal, onOpenQr }) {
  const openQr = onOpenQr || (() => onNavigate('tickets'));

  return (
    <div className="flex flex-col w-full pb-10 space-y-7 max-w-7xl mx-auto">
      {/* ── Welcome & City Greeting ── */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1 pb-2">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-secondary text-label-md font-medium mb-1">
            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
            <span>Toruń • Stare Miasto</span>
            <span className="w-1 h-1 rounded-full bg-secondary/50"></span>
            <span>Województwo kujawsko-pomorskie</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Dzień dobry, Aleksandro!
          </h1>
          <p className="text-secondary text-body-sm mt-0.5">
            Sprawdź dzisiejsze usługi miejskie, bilety MZK i bieżące konsultacje.
          </p>
        </div>

        {/* Live Weather Compact Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card self-start sm:self-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">wb_sunny</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-on-surface text-body-md">18°C</span>
              <span className="text-xs text-secondary">Słonecznie</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-tertiary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span>AQI 22 • Czyste powietrze</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Dashboard Responsive Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* ═════════════════════════════════════════════
           LEFT COLUMN: Primary Services & Highlights (8 cols)
           ═════════════════════════════════════════════ */}
        <div className="lg:col-span-8 flex flex-col space-y-7">
          
          {/* Quick Access Grid (4 Key Services) */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Szybki dostęp</h2>
              <span className="text-xs text-secondary font-medium">Najczęściej wybierane</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* Buy Ticket - Primary Highlight Card */}
              <button
                onClick={() => onNavigate('tickets')}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-primary text-white shadow-card hover:shadow-card-hover transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[22px]">directions_bus</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-white/70 group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="mt-5">
                  <span className="font-semibold text-sm sm:text-base block leading-snug text-white">
                    Kup bilet MZK
                  </span>
                  <span className="text-[11px] text-white/80 block mt-0.5">
                    Autobus &amp; Tramwaj
                  </span>
                </div>
              </button>

              {/* Resident Card / QR */}
              <button
                onClick={() => onNavigate('tickets')}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="mt-5">
                  <span className="font-semibold text-sm sm:text-base text-on-surface block leading-snug">
                    Karta Torunianina
                  </span>
                  <span className="text-[11px] text-secondary block mt-0.5">
                    Twój kod mieszkańca
                  </span>
                </div>
              </button>

              {/* Report Issue / Civic Voice */}
              <button
                onClick={() => onNavigate('votes')}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">rate_review</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="mt-5">
                  <span className="font-semibold text-sm sm:text-base text-on-surface block leading-snug">
                    Zgłoś sprawę
                  </span>
                  <span className="text-[11px] text-secondary block mt-0.5">
                    Usterki &amp; Inicjatywy
                  </span>
                </div>
              </button>

              {/* City Map & Parking */}
              <button
                onClick={() => onNavigate('parking')}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">local_parking</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </div>
                <div className="mt-5">
                  <span className="font-semibold text-sm sm:text-base text-on-surface block leading-snug">
                    Parkowanie &amp; Mapa
                  </span>
                  <span className="text-[11px] text-secondary block mt-0.5">
                    Wolne miejsca SPP
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Featured Civic Spotlight: Budżet Obywatelski 2025 */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">Budżet Obywatelski 2025</h2>
              </div>
              <span className="text-xs text-primary font-semibold hover:underline cursor-pointer" onClick={() => onNavigate('votes')}>
                Wszystkie projekty →
              </span>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card overflow-hidden hover:border-outline transition-all">
              <div className="relative h-48 sm:h-56 w-full bg-surface-container overflow-hidden">
                <img
                  className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
                  alt="Zielone bulwary nad Wisłą"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTltgh5A9Hnb1xvzYvKW7YIe9-JmTv5pDh8IihoB2i8b-6w7BJnxuhaZYCo8YEOfRqQ7AO2S7O5sPNH4DsOdLSRZQ6LXobKzbQKICpu9oZiJe8le5fHT57vBaPW51vhU5RMrTqwSWPmh5NN5rf4_qCLzrvCZ6Il5V1PfZtZEsUiK3Fbifej4I2YzzIkG9ULbS4aS0_bQiZgMQHtYysIhzs8gr3iVP8iOwXPZYLYjTTgSq1jTbb_sX9"
                />
                <div className="absolute inset-0 bg-black/35"></div>
                
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide">
                    PROJEKT OGÓLNOMIEJSKI #14
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs text-slate-200">Rewitalizacja nabrzeża Wisły</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">hourglass_bottom</span>
                    Pozostało 3 dni
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-on-surface leading-snug">
                    Zielone bulwary nad Wisłą – etap II
                  </h3>
                  <p className="text-secondary text-sm mt-1 leading-relaxed">
                    Nowe strefy rekreacyjne, 120 rodzimych drzew, sensoryczny plac zabaw dla dzieci oraz energooszczędne oświetlenie parkowe.
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary">
                      Dotychczas oddano: <strong className="text-on-surface font-semibold">1 842 głosy</strong>
                    </span>
                    <span className="text-secondary font-medium">Cel: 2 500 (74%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: '74%' }}></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onTriggerVoteModal) {
                        onTriggerVoteModal();
                      } else {
                        onNavigate('votes');
                      }
                    }}
                    className="flex-1 h-11 px-5 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[19px]">how_to_vote</span>
                    <span>Oddaj swój głos</span>
                  </button>
                  <button
                    onClick={() => onNavigate('votes')}
                    className="h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    <span>Szczegóły</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Municipal News / Events */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Aktualności &amp; Wydarzenia</h2>
              <button
                onClick={() => onNavigate('votes')}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Inwestycje</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* News 1 */}
              <div
                onClick={() => onNavigate('votes')}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="w-full h-36 rounded-xl overflow-hidden bg-surface-container mb-3.5">
                  <img
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    alt="Nowe tramwaje niskopodłogowe"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuARx_H-XS4Ca2tUVYPq8dsxd7M96RE9QSU07K4RUPk7WhQdqaWrcuChPV29i7rKn5aeCEUSwnBwygcIPE6ooM1Oklq4XhHq3nDAJNFLwWrRBc-P4xcYMyOoQLyrmESzYRgVCqGT286CsFMGpi_24KHs3-pOZ0Ls43QHjqmhVNqy9n8sPMN5VDtTioRGJ0tG9pl09kcFkepl-0XM6Byz_j2P0ZFIWhEa0V-JwtPG4M31setV-or_eO5w"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-[11px] font-semibold">
                      Inwestycje
                    </span>
                    <span className="text-[11px] text-secondary">2 godz. temu</span>
                  </div>
                  <h4 className="font-semibold text-on-surface text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    Nowe tramwaje niskopodłogowe dotarły do Torunia
                  </h4>
                  <p className="text-secondary text-xs mt-1 line-clamp-2">
                    Flota MZK zyskała 5 nowoczesnych składów klimatyzowanych obsługujących linie 1 i 5.
                  </p>
                </div>
              </div>

              {/* News 2 */}
              <div
                onClick={() => alert('Święto Miasta Torunia 2025:\nProgram koncertów plenerowych na Rynku Nowomiejskim oraz bezpłatne wejściówki na koncerty teatrów światła będą dostępne w czerwcu.')}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="w-full h-36 rounded-xl overflow-hidden bg-surface-container mb-3.5">
                  <img
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    alt="Święto Miasta Torunia"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTZmdRD0mDoXH9U_qjk7sjUiKAIe1aFYMVvkMnsQOzmtMZaiwskQaEDw7kEjUphHZBcvqIi9AzcNNQetAdo0bWi4d-g9ZdMu5JBxutrTGUhZE57wZ-wNnVyVgGaMytKCJDxja8WdWIs1MS4thcS7oJ5hNLT61Pddsy7Xirr7kahFUzDSHSc_qFmqMhKtYgT7gCEQqv64HIxj7QPH7P_P3DF41Uv-9KnX_ljCDlWaGeXaj3K3PPP3l_"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-primary text-[11px] font-semibold">
                      Kultura
                    </span>
                    <span className="text-[11px] text-secondary">12-14 Czerwca</span>
                  </div>
                  <h4 className="font-semibold text-on-surface text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    Święto Miasta Torunia – program i bezpłatne wejściówki
                  </h4>
                  <p className="text-secondary text-xs mt-1 line-clamp-2">
                    Koncerty plenerowe na Rynku Nowomiejskim, teatr światła i piernikowy festyn rodzinny.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ═════════════════════════════════════════════
           RIGHT COLUMN: Live Municipal Pulse Rail (4 cols)
           ═════════════════════════════════════════════ */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Card: Live City Pulse (Toruń na żywo) */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-sm text-on-surface uppercase tracking-wider">
                  Toruń na żywo
                </span>
              </div>
              <span className="text-[11px] text-secondary font-medium">Bieżący monitoring</span>
            </div>

            {/* Weather & Air Quality row */}
            <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-amber-500">wb_sunny</span>
                <div>
                  <div className="text-xs font-semibold text-on-surface">18°C, Słonecznie</div>
                  <div className="text-[11px] text-secondary">Stacja pomiarowa: Wały gen. Sikorskiego</div>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                  AQI 22 • Dobre
                </span>
              </div>
            </div>

            {/* City Traffic Alert - Refined, elegant tone */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                info
              </span>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Prace drogowe: Most im. J. Piłsudskiego
                </span>
                <p className="text-[12px] text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-snug">
                  Wymiana oświetlenia dziś od godz. 21:00. Zwężenie do jednego pasa.
                </p>
                <button
                  onClick={() => onNavigate('parking')}
                  className="mt-2 text-[11px] font-semibold text-amber-900 dark:text-amber-300 hover:underline self-start flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Mapa objazdów &amp; parkowanie</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card: Digital Resident Status */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-on-surface uppercase tracking-wider">
                Twój portfel miejski
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Aktywny
              </span>
            </div>

            <div
              role="button"
              tabIndex={0}
              aria-label="Pokaż kod QR Karty Torunianina"
              onClick={openQr}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQr(); } }}
              className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-outline text-on-surface flex flex-col justify-between relative overflow-hidden cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <div className="flex justify-between items-start z-10">
                <div>
                  <span className="text-[11px] text-secondary uppercase tracking-widest block font-medium">
                    Karta Torunianina
                  </span>
                  <span className="text-base font-bold text-on-surface block mt-0.5">
                    Aleksandra Wiśniewska
                  </span>
                </div>
                <span className="material-symbols-outlined text-[24px] text-secondary">
                  contactless
                </span>
              </div>

              <div className="mt-5 flex justify-between items-end z-10">
                <div>
                  <span className="text-[10px] text-secondary block">Ważność uprawnień PIT</span>
                  <span className="text-xs font-semibold text-on-surface">Do 30.04.2025</span>
                </div>
                <span className="material-symbols-outlined text-[26px] text-secondary">qr_code_2</span>
              </div>
            </div>

            {/* Active Ticket Status mini-tile */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary">directions_bus</span>
                <div>
                  <span className="font-semibold text-on-surface block">Bilet czasowy 30-minutowy</span>
                  <span className="text-secondary text-[11px]">Pozostało 18 min 42 sek</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('tickets')}
                className="text-primary font-semibold text-[11px] hover:underline cursor-pointer"
              >
                Szczegóły
              </button>
            </div>
          </div>

          {/* Card: Waste Management Schedule */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-on-surface uppercase tracking-wider">
                Odbiór odpadów
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container text-secondary font-medium">
                Rejon 4: Stare Miasto
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">delete_outline</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-on-surface block">
                  Jutro: Papier i Bioodpady
                </span>
                <span className="text-[11px] text-secondary block mt-0.5">
                  Wystaw pojemniki przed godz. 06:00
                </span>
              </div>
            </div>

            <button
              onClick={() => alert('Harmonogram Rejonu 4 (Stare Miasto):\n• Poniedziałek: Papier i Bioodpady\n• Środa: Metale i Tworzywa sztuczne\n• Piątek: Odpady zmieszane')}
              className="w-full py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors cursor-pointer text-center"
            >
              Zobacz pełny harmonogram rejonu
            </button>
          </div>

          {/* Municipal Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => onNavigate('votes')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-secondary mb-2">
                <span className="text-[11px] font-semibold uppercase">Konsultacje</span>
                <span className="material-symbols-outlined text-[17px] text-primary">forum</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">12</div>
              <span className="text-[11px] text-secondary mt-0.5 block">Aktywnych tematów</span>
            </div>

            <div
              onClick={() => onNavigate('votes')}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card hover:shadow-card-hover transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-secondary mb-2">
                <span className="text-[11px] font-semibold uppercase">Realizacja</span>
                <span className="material-symbols-outlined text-[17px] text-tertiary">check_circle</span>
              </div>
              <div className="text-2xl font-bold text-on-surface">87%</div>
              <span className="text-[11px] text-secondary mt-0.5 block">Spraw na czas</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
