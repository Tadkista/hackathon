import React, { useState } from 'react';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [registeredEco, setRegisteredEco] = useState(false);
  const [ecoSpots, setEcoSpots] = useState(18);

  const categories = [
    { id: 'kultura', label: 'Kultura & Eventy', count: '18 wydarzeń', icon: 'theater_comedy', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed-variant' },
    { id: 'inwestycje', label: 'Inwestycje', count: 'Budżet 2025', icon: 'account_balance', bg: 'bg-surface-container-high', text: 'text-primary-container' },
    { id: 'praca', label: 'Praca & Staże', count: '14 ofert', icon: 'work', bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { id: 'parkowanie', label: 'Parkowanie', count: 'Strefa A & B', icon: 'local_parking', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
    { id: 'eko', label: 'Eko Toruń', count: 'Wolontariat', icon: 'eco', bg: 'bg-surface-container-highest', text: 'text-primary' },
  ];

  const handleEcoRegister = () => {
    if (!registeredEco) {
      setRegisteredEco(true);
      setEcoSpots((prev) => prev - 1);
      alert('Zarejestrowano na akcję: Wiosenne sadzenie drzew miododajnych w Parku Tysiąclecia! Przypomnienie zostało dodane do kalendarza.');
    } else {
      setRegisteredEco(false);
      setEcoSpots((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col pt-1 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Odkrywaj Toruń
        </h1>
        <p className="text-secondary text-body-sm mt-0.5">
          Wydarzenia kulturalne, strefy parkowania SPP, inwestycje i inicjatywy miejskie.
        </p>
      </div>

      {/* Sekcja Wyszukiwania z Filtrami */}
      <section className="w-full pt-1">
        <div className="flex items-center gap-space-sm">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl text-body-md shadow-sm outline-none transition-all focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20"
              placeholder="Szukaj wydarzeń, pracy, inwestycji..."
              type="text"
            />
          </div>
          <button
            onClick={() => alert('Dostępne filtry:\n• Dzielnica\n• Typ usługi\n• Tylko bezpłatne wydarzenia')}
            aria-label="Filtry wyszukiwania"
            className="h-11 w-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-surface-container-lowest text-secondary shadow-sm active:scale-95 transition-all hover:text-primary cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">tune</span>
          </button>
        </div>
      </section>

      {/* Pigułki / Siatka Głównych Kategorii */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-space-sm">
          <span className="text-label-md font-label-md text-secondary uppercase tracking-wider font-semibold">
            Kategorie miejskie
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-label-sm font-label-sm text-primary font-semibold hover:underline cursor-pointer"
          >
            Wszystkie (12)
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((c) => {
            const isSel = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(isSel ? 'all' : c.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-sm flex-shrink-0 active:scale-95 transition-all text-left cursor-pointer border ${
                  isSel
                    ? 'bg-primary-container text-on-primary border-primary'
                    : 'bg-surface-container-lowest border-transparent hover:border-surface-container'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.bg} ${c.text}`}>
                  <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-title-md font-title-md font-semibold ${isSel ? 'text-white' : 'text-on-surface'}`}>
                    {c.label}
                  </span>
                  <span className={`text-label-sm font-label-sm ${isSel ? 'text-on-primary-container' : 'text-secondary'}`}>
                    {c.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Moduł: Narzędzia Mapowe & Parkowanie na Żywo */}
      {(selectedCategory === 'all' || selectedCategory === 'parkowanie') && (
        <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">local_parking</span>
              <span className="text-title-lg font-title-lg text-on-surface font-semibold">
                Parkowanie Starówka na żywo
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary text-label-sm font-label-sm flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-pulse"></span>
              Live
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low mb-space-sm">
            <div>
              <p className="text-label-md font-label-md text-secondary">Strefa Płatnego Parkowania A</p>
              <p className="text-headline-sm font-headline-sm text-on-surface font-bold">
                <span className="text-primary-container font-bold">142</span> wolne miejsca
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-label-sm font-label-sm text-secondary">Ostatnia sync: 2 min temu</span>
              <span className="text-label-md font-label-md text-tertiary-container font-semibold mt-0.5">
                Płynny ruch
              </span>
            </div>
          </div>

          {/* Interaktywna mini-mapa punktów parkingowych */}
          <div
            className="w-full h-32 rounded-lg bg-cover bg-center relative overflow-hidden flex items-end p-2.5 shadow-inner"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgRIOdrU5InaWaOwDbZSFLLYaXZOABtmz3WDq6DsEhAlYnLawjSWkOD7pi2vpuQ33j1H45QPeWApWAgfatxn0H1C-NDdhXMSRjNF2kgwzCCYY9LEV-LqbV49YhVSvRM-r7YY87lR0Ep0UQ555HH5HXmf7jRV9rF8La2HfVLBl_cgbSOMFT_8g3nA-9jnVW55TMG0MxvsWS93QLQA4_CR9ypi18c2FGFUZGoDmt-k8Gs-KmiBFrBsBI')",
            }}
          >
            <div className="w-full bg-surface-container-lowest/95 backdrop-blur-md px-3 py-2 rounded-lg flex items-center justify-between shadow-sm">
              <span className="text-label-sm font-label-sm text-on-surface flex items-center gap-1.5 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-primary">navigation</span>
                P1: Plac św. Katarzyny (64 wolne)
              </span>
              <button
                onClick={() => alert('Uruchamianie nawigacji do Parkingu Plac św. Katarzyny w Toruniu...')}
                className="text-label-sm font-label-sm text-primary font-bold hover:underline cursor-pointer"
              >
                Prowadź
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Moduł: Inwestycje i Finanse Torunia */}
      {(selectedCategory === 'all' || selectedCategory === 'inwestycje') && (
        <section className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider font-semibold">
                Transparentne Miasto
              </span>
              <h2 className="text-title-lg font-title-lg text-on-surface font-bold">
                Inwestycje i budżet 2025
              </h2>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">query_stats</span>
            </div>
          </div>

          {/* Mini-dashboard Budżetu */}
          <div className="bg-surface-container-low rounded-xl p-3.5 space-y-3">
            <div className="flex justify-between items-baseline">
              <div className="flex flex-col">
                <span className="text-label-sm font-label-sm text-secondary">Planowany budżet miejski</span>
                <span className="text-headline-sm font-headline-sm text-on-surface font-bold">
                  1.68 mld PLN
                </span>
              </div>
              <div className="text-right">
                <span className="text-label-sm font-label-sm text-secondary">Realizacja</span>
                <span className="text-title-lg font-title-lg text-primary-container font-bold">42%</span>
              </div>
            </div>

            {/* Segmentowy pasek postępu */}
            <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden flex">
              <div className="h-full bg-primary-container" style={{ width: '32%' }} title="Edukacja: 32%"></div>
              <div className="h-full bg-secondary" style={{ width: '28%' }} title="Transport: 28%"></div>
              <div className="h-full bg-tertiary-container" style={{ width: '15%' }} title="Ekologia: 15%"></div>
              <div className="h-full bg-surface-dim" style={{ width: '25%' }} title="Inne: 25%"></div>
            </div>

            {/* Legenda budżetowa */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-label-sm font-label-sm text-secondary font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary-container"></span> Edukacja
                </span>
                <span className="text-label-md font-label-md font-semibold text-on-surface">32%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-label-sm font-label-sm text-secondary font-medium">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span> Transport
                </span>
                <span className="text-label-md font-label-md font-semibold text-on-surface">28%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center gap-1 text-label-sm font-label-sm text-secondary font-medium">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container"></span> Ekologia
                </span>
                <span className="text-label-md font-label-md font-semibold text-on-surface">15%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Moduł: Miejskie Oferty Pracy i Staże */}
      {(selectedCategory === 'all' || selectedCategory === 'praca') && (
        <section className="w-full space-y-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-title-lg font-title-lg text-on-surface font-bold">
              Kariera w samorządzie
            </h2>
            <span className="text-label-sm font-label-sm text-secondary">Biuletyn BIP</span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm font-semibold">
                  Nabór otwarty
                </span>
                <h3 className="text-title-md font-title-md text-on-surface mt-1.5 font-bold">
                  Młodszy Geodeta
                </h3>
                <p className="text-body-sm font-body-sm text-secondary">
                  Wydział Geodezji i Kartografii UMT
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-label-sm font-label-sm text-secondary block">Wynagrodzenie</span>
                <span className="text-title-md font-title-md text-primary font-bold">
                  5 200 – 6 100 zł
                </span>
                <span className="text-label-sm font-label-sm text-secondary block">brutto / mies.</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-secondary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  Do 15 maja
                </span>
                <span>•</span>
                <span>Pełny etat</span>
              </div>
              <button
                onClick={() => alert('Przekierowywanie do formularza rekrutacyjnego w systemie ePUAP...')}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-label-sm font-label-sm font-semibold active:scale-95 transition-all cursor-pointer hover:bg-primary-container"
              >
                Aplikuj przez ePUAP
              </button>
            </div>
          </div>

          <div className="w-full bg-surface-container rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface truncate">
                Oznaczono <strong className="font-semibold text-primary">14 nowych ofert</strong> w jednostkach miejskich
              </p>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
          </div>
        </section>
      )}

      {/* Moduł: Akcje Ekologiczne & Wolontariat */}
      {(selectedCategory === 'all' || selectedCategory === 'eko') && (
        <section className="w-full space-y-space-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-title-lg font-title-lg text-on-surface font-bold">Zielony Toruń</h2>
            <span className="text-label-sm font-label-sm text-tertiary-container font-semibold">
              Wydział Środowiska
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-3">
            <div className="flex gap-space-sm items-start">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed flex-shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[24px]">forest</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary text-label-sm font-label-sm font-semibold">
                    Akcja Eko
                  </span>
                  <span className="text-label-sm font-label-sm text-secondary">Park Tysiąclecia</span>
                </div>
                <h3 className="text-title-md font-title-md text-on-surface mt-1 font-bold">
                  Wiosenne sadzenie drzew miododajnych
                </h3>
                <p className="text-body-sm font-body-sm text-secondary mt-0.5">
                  Dołącz do wspólnego zazieleniania Podgórza. Zapewniamy sprzęt i sadzonki lipy.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between">
              <div>
                <span className="text-label-sm font-label-sm text-secondary block">Dostępność miejsc</span>
                <span className="text-title-md font-title-md text-tertiary-container font-bold">
                  {ecoSpots} z 50 wolnych
                </span>
              </div>
              <button
                onClick={handleEcoRegister}
                className={`px-4 py-2 rounded-lg text-label-md font-label-md font-semibold active:scale-95 transition-all shadow-sm cursor-pointer ${
                  registeredEco
                    ? 'bg-surface-container text-secondary hover:bg-surface-container-high'
                    : 'bg-tertiary text-on-tertiary hover:opacity-95'
                }`}
              >
                {registeredEco ? 'Zrezygnuj' : 'Zarejestruj się'}
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
