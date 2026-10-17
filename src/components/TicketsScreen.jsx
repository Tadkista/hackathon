import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';

// A QR code must always be dark modules on a light background to stay scannable,
// regardless of the app theme, so colours are fixed here on purpose.
function QrGraphic({ className = '' }) {
  return (
    <img
      src="/qr.png"
      alt="Kod QR Karty Torunianina"
      className={`${className} block bg-white object-contain`}
      style={{ imageRendering: 'pixelated' }}
      draggable={false}
    />
  );
}

const MZK_PRICE_LIST = [
  { name: 'Bilet 30-minutowy', normal: '3,80 zł', reduced: '1,90 zł' },
  { name: 'Bilet 90-minutowy', normal: '6,80 zł', reduced: '3,40 zł' },
  { name: 'Bilet dobowy (24h)', normal: '12,00 zł', reduced: '6,00 zł' },
  { name: 'Bilet miesięczny', normal: '88,00 zł', reduced: '—' },
];

const fmtPrice = (n) => `${n.toFixed(2).replace('.', ',')} zł`;

const TICKET_CATEGORIES = [
  { id: 'czasowe', label: 'Czasowe', hint: 'Ważne określoną liczbę minut lub godzin od skasowania, bez limitu przesiadek.' },
  { id: 'jednorazowe', label: 'Jednorazowe', hint: 'Jeden przejazd na wybranej linii. Skasuj po wejściu do pojazdu.' },
  { id: 'okresowe', label: 'Okresowe', hint: 'Na dni, miesiące lub rok. Przypisane do Karty Torunianina.' },
];

const TICKETS = [
  { id: 't30', category: 'czasowe', name: 'Bilet 30-minutowy', desc: 'Autobusy i tramwaje w I strefie', icon: 'schedule', normal: 3.8, reduced: 1.9, badge: 'Popularny' },
  { id: 't90', category: 'czasowe', name: 'Bilet 90-minutowy', desc: 'Wszystkie linie dzienne i nocne', icon: 'hub', normal: 6.8, reduced: 3.4 },
  { id: 't24', category: 'czasowe', name: 'Bilet dobowy (24h)', desc: 'Dowolna liczba przesiadek', icon: 'all_inclusive', normal: 12, reduced: 6 },
  { id: 't72', category: 'czasowe', name: 'Bilet 72-godzinny', desc: 'Dla turystów i gości miasta', icon: 'luggage', normal: 24, reduced: 12 },

  { id: 's1', category: 'jednorazowe', name: 'Przejazd jednorazowy', desc: 'Jedna linia, bez przesiadek (I strefa)', icon: 'confirmation_number', normal: 3.2, reduced: 1.6 },
  { id: 's2', category: 'jednorazowe', name: 'Przejazd nocny (N1–N3)', desc: 'Linie nocne w całym mieście', icon: 'bedtime', normal: 4.5, reduced: 2.25 },
  { id: 's3', category: 'jednorazowe', name: 'Strefa II (gminy podmiejskie)', desc: 'Przejazd do Łysomic, Osieka i Czernikowa', icon: 'route', normal: 5.4, reduced: 2.7 },
  { id: 's4', category: 'jednorazowe', name: 'Przewóz roweru lub dużego bagażu', desc: 'Dodatkowa opłata za przejazd', icon: 'pedal_bike', normal: 2, reduced: null },

  { id: 'm1', category: 'okresowe', name: 'Bilet miesięczny sieciowy', desc: 'Wszystkie linie, 30 dni od aktywacji', icon: 'calendar_month', normal: 88, reduced: 44, badge: 'Najczęściej wybierany' },
  { id: 'm2', category: 'okresowe', name: 'Bilet miesięczny na 1 linię', desc: 'Jedna wybrana linia dzienna', icon: 'looks_one', normal: 62, reduced: 31 },
  { id: 'm3', category: 'okresowe', name: 'Bilet semestralny (3 miesiące)', desc: 'Dla uczniów i studentów, rok akademicki', icon: 'school', normal: 240, reduced: 120 },
  { id: 'm4', category: 'okresowe', name: 'Bilet roczny Karty Torunianina', desc: 'Najniższy koszt przejazdu, wszystkie linie', icon: 'workspace_premium', normal: 780, reduced: 390 },
];

export default function TicketsScreen({ openQrRequested = false, onQrHandled }) {
  const { user, isChild } = useAuth();
  const fullName = `${user.firstName} ${user.lastName}`;
  const cardNo = `TRN-${new Date().getFullYear()}-${(user.pesel || '00000').slice(-5)}`;
  // Live ticking clock for resident card security
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  // Live ticket countdown in seconds (18 mins 42 secs = 1122 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(1122);
  const [ticketCategory, setTicketCategory] = useState('czasowe');
  const [selectedTariff30, setSelectedTariff30] = useState(isChild ? 'ulgowy' : 'normalny'); // normalny or ulgowy
  const [purchaseToast, setPurchaseToast] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);

  // Opened from the home wallet card: jump straight to the QR code
  useEffect(() => {
    if (openQrRequested) {
      setIsQrModalOpen(true);
      onQrHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openQrRequested]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}:${s}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const formatCountdown = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `Pozostało: ${m} min ${String(s).padStart(2, '0')} sek`;
  };

  const handleBuyTicket = (ticketName, price) => {
    setPurchaseToast(`Zakupiono ${ticketName} (${price})! Dodano do Twojego portfela.`);
    setTimeout(() => {
      setPurchaseToast(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col w-full pb-10 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {purchaseToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-tertiary text-on-tertiary px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-label-md animate-fadeIn">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20">check_circle</span>
          <span>{purchaseToast}</span>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col pt-1 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Bilety MZK i Karta Mieszkańca
        </h1>
        <p className="text-secondary text-body-sm mt-0.5">
          Toruńska Karta Miejska, cyfrowy portfel uprawnień oraz zakup biletów online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Resident Card & Active Ticket */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Status Toast / Civic Bar */}
          <div className="mb-1">
            <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <p className="font-label-sm text-label-sm text-secondary truncate">
              {isChild ? 'Konto dziecka zatwierdzone przez opiekuna • bilety ulgowe' : 'System biletowy MZK: Sieć aktywna • Ważność PIT do 30.04.2025'}
            </p>
          </div>
          <button
            onClick={() => alert('Weryfikacja podatkowa PIT dla m. Toruń jest ważna do 30.04.2025. Uprawnia do toruńskich zniżek.')}
            className="font-label-sm text-label-sm text-primary font-semibold shrink-0 cursor-pointer hover:underline"
          >
            Szczegóły
          </button>
        </div>
      </div>

      {/* 1. Główny moduł: Cyfrowa Karta Mieszkańca Torunia */}
      <section>
        <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant text-on-surface shadow-card p-space-md">
          {/* Gothic watermark */}
          <div className="absolute -right-8 -bottom-10 w-44 h-44 opacity-5 text-on-surface pointer-events-none">
            <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
              <path d="M50 0 L58 35 L93 35 L65 55 L76 90 L50 70 L24 90 L35 55 L7 35 L42 35 Z"></path>
              <circle cx="50" cy="50" fill="none" r="46" stroke="currentColor" strokeWidth="4"></circle>
              <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="2"></path>
            </svg>
          </div>

          {/* Top Row: Civic Brand */}
          <div className="relative z-10 flex items-start justify-between mb-space-md">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface text-fs-22">
                  account_balance
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-title-lg text-title-lg leading-tight tracking-tight font-bold text-on-surface">
                    Karta Torunianina
                  </span>
                </div>
                <p className="font-label-sm text-label-sm text-secondary">
                  Oficjalny Miejski Identyfikator
                </p>
              </div>
            </div>
          </div>

          {/* Resident Info & QR Panel */}
          <div className="relative z-10 grid grid-cols-12 gap-space-sm items-center bg-surface-container-low border border-outline-variant/60 rounded-xl p-3.5">
            {/* Text metadata */}
            <div className="col-span-7 flex flex-col justify-between min-w-0 pr-1">
              <div>
                <span className="font-label-sm text-label-sm text-secondary block uppercase tracking-wider">
                  Imię i nazwisko
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate tracking-tight font-bold">
                  {fullName}
                </h2>
              </div>
              <div className="mt-2.5">
                <span className="font-label-sm text-label-sm text-secondary block">
                  Numer identyfikatora
                </span>
                <p className="font-title-md text-title-md font-mono text-on-surface tracking-wide font-semibold">
                  {cardNo}
                </p>
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1.5 bg-surface-container rounded-lg px-2 py-1 self-start">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-15 text-secondary">group</span>
                <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                  KDR Toruń: -50%
                </span>
              </div>
            </div>

            {/* High-contrast QR (always dark on white so it stays scannable) */}
            <div className="col-span-5 flex flex-col items-center">
              <div
                onClick={() => setIsQrModalOpen(true)}
                className="bg-white border border-slate-200 p-2 rounded-xl shadow-sm w-full max-w-[118px] flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              >
                <QrGraphic className="w-full h-auto" />
                <div className="mt-1 w-full text-center">
                  <span className="font-label-sm text-fs-9 font-semibold text-slate-600 block tracking-tight uppercase">
                    Skanuj kontrolerem
                  </span>
                </div>
              </div>

              {/* Live pulse timestamp */}
              <div className="flex items-center gap-1 mt-1.5 text-center">
                <span className="font-label-sm text-fs-10 text-secondary font-mono tracking-tight">
                  Ważny: dzisiaj, {currentTimeStr || '14:32:05'}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons on card */}
          <div className="relative z-10 flex items-center justify-end mt-3 pt-2">
            <button
              onClick={() => setIsBenefitsModalOpen(true)}
              className="flex items-center gap-1 font-label-md text-label-md text-secondary hover:text-on-surface transition-colors cursor-pointer"
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-fs-16">info</span>
              <span>Katalog uprawnień</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Mój aktywny bilet */}
      <section>
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-transparent">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-20"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  directions_bus
                </span>
              </span>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  Mój aktywny bilet MZK
                </h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  30-minutowy miejski (Autobus / Tramwaj)
                </p>
              </div>
            </div>
          </div>

          {/* Countdown Banner */}
          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary">Czas ważności:</span>
              <span className="font-headline-sm text-headline-sm text-emerald-700 dark:text-emerald-400 font-mono font-bold tracking-tight">
                {secondsRemaining > 0 ? formatCountdown(secondsRemaining) : 'Bilet wygasł'}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, Math.max(0, (secondsRemaining / 1800) * 100))}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-secondary font-label-sm text-label-sm">
              <span>Skasowano: 14:13 (Linia 10)</span>
              <span>Ważny do: 14:43</span>
            </div>
          </div>

        </div>
      </section>
    </div>

    {/* Right Column: Ticket Purchase & Benefits & History */}
    <div className="lg:col-span-7 flex flex-col space-y-6">
      {/* 3. Szybki zakup biletów komunikacji miejskiej */}
      <section>
        <div className="flex items-center justify-between mb-space-sm">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Kup bilet MZK Toruń
            </h2>
            <p className="font-body-sm text-body-sm text-secondary">
              Toruńska Karta Miejska • Błyskawiczny zakup
            </p>
          </div>
          <button
            onClick={() => setIsPriceListOpen(true)}
            className="font-label-md text-label-md text-primary font-semibold flex items-center gap-0.5 cursor-pointer hover:underline"
            type="button"
          >
            Cennik MZK
            <span aria-hidden="true" className="material-symbols-outlined text-fs-16">chevron_right</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div role="tablist" aria-label="Rodzaj biletu" className="flex items-center bg-surface-container-low p-1 rounded-xl mb-space-md text-center">
          {TICKET_CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={ticketCategory === c.id}
              onClick={() => setTicketCategory(c.id)}
              className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                ticketCategory === c.id
                  ? 'bg-surface-container-lowest shadow-sm font-semibold text-primary'
                  : 'text-secondary hover:text-on-surface'
              }`}
              type="button"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Tariff + category description */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-space-sm">
          <p className="font-body-sm text-body-sm text-secondary min-w-0 flex-1">
            {TICKET_CATEGORIES.find((c) => c.id === ticketCategory).hint}
          </p>
          <div role="radiogroup" aria-label="Taryfa" className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg shrink-0">
            {[['normalny', 'Normalny'], ['ulgowy', 'Ulgowy']].map(([id, label]) => (
              <button
                key={id}
                role="radio"
                aria-checked={selectedTariff30 === id}
                onClick={() => setSelectedTariff30(id)}
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors cursor-pointer ${
                  selectedTariff30 === id
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                    : 'text-secondary hover:text-on-surface'
                }`}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Stack */}
        <ul className="flex flex-col gap-space-sm list-none p-0 m-0" aria-label={`Bilety: ${TICKET_CATEGORIES.find((c) => c.id === ticketCategory).label}`}>
          {TICKETS.filter((t) => t.category === ticketCategory).map((t) => {
            const price = selectedTariff30 === 'ulgowy' ? t.reduced : t.normal;
            const unavailable = price == null;
            return (
              <li key={t.id} className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-20">{t.icon}</span>
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-title-md text-title-md text-on-surface font-semibold">{t.name}</h4>
                      {t.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-semibold">{t.badge}</span>
                      )}
                    </div>
                    <p className="font-body-sm text-body-sm text-secondary">{t.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-title-lg text-title-lg text-on-surface font-bold">{unavailable ? '—' : fmtPrice(price)}</span>
                    <span className="font-label-sm text-label-sm text-secondary block">
                      {unavailable ? 'brak ulgi' : selectedTariff30 === 'ulgowy' ? 'Taryfa ulgowa' : t.reduced != null ? `Ulgowy: ${fmtPrice(t.reduced)}` : 'Bez ulgi'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleBuyTicket(`${t.name} (${selectedTariff30})`, fmtPrice(price))}
                    disabled={unavailable}
                    aria-label={`Kup: ${t.name}`}
                    className="w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    type="button"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-20">add_shopping_cart</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 4. Moje zniżki i benefity */}
      <section>
        <div className="flex items-center justify-between mb-space-sm">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Korzyści Karty Torunianina
            </h2>
            <p className="font-body-sm text-body-sm text-secondary">
              Zniżki miejskie po okazaniu weryfikacji
            </p>
          </div>
          <button
            onClick={() => setIsBenefitsModalOpen(true)}
            className="font-label-md text-label-md text-primary font-semibold hover:underline cursor-pointer"
          >
            Wszystkie (28)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          {/* Benefit 1 */}
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
            <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt="Teatr Horzycy"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtSSyqsHnWQAIi7JCf8QLxH9401WSP_bTqddzattJQ4xyZTHby84bMTZlH4tLT7tu0X3aAx7O4pf5gqHBbZ3XGsRbm9fJMwPI1Qm1CiEchQsk8gtpepJ5joZC2re82pntQyhmUBPYptswaXjFi4xmWcq56Ixna_W6ZNPfBCVjtpPzlIv5yp3irTyVaI3t-wlpweHsZQtSL-ZJ7afDjFJXLxobHYYn_d5PTQgKfOcc_LVWbALeFEpYY"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-fs-11 font-bold shadow-sm">
                -20%
              </span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md text-on-surface line-clamp-1 font-semibold">
                Teatr im. Wilama Horzycy
              </h4>
              <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                Bilety na spektakle własne
              </p>
            </div>
            <button
              onClick={() => alert('Zniżka -20% w kasie Teatru im. Wilama Horzycy naliczana automatycznie po zeskanowaniu Karty Torunianina.')}
              className="mt-2.5 w-full py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors text-center font-medium cursor-pointer"
              type="button"
            >
              Szczegóły
            </button>
          </div>

          {/* Benefit 2 */}
          <div className="bg-surface-container-lowest rounded-xl p-3 shadow-sm flex flex-col justify-between">
            <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2 bg-surface-container flex items-center justify-center bg-secondary-container">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-42 text-primary">science</span>
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-fs-11 font-bold shadow-sm">
                -30%
              </span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md text-on-surface line-clamp-1 font-semibold">
                Młyn Wiedzy
              </h4>
              <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                Wystawy stałe i warsztaty
              </p>
            </div>
            <button
              onClick={() => alert('Centrum Nowoczesności Młyn Wiedzy: -30% na bilety ulgowe i normalne dla posiadaczy Karty Torunianina.')}
              className="mt-2.5 w-full py-1.5 rounded-lg bg-surface-container-low text-primary font-label-md text-label-md hover:bg-surface-container transition-colors text-center font-medium cursor-pointer"
              type="button"
            >
              Szczegóły
            </button>
          </div>
        </div>
      </section>

      {/* 5. Historia biletów i opłat */}
      <section id="historia-biletow" className="scroll-mt-24">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm">
          Historia biletów i transakcji
        </h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm divide-y divide-surface-container overflow-hidden">
          {/* Item 1 */}
          <div className="p-space-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-20">theater_comedy</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  Teatr Horzycy (2x Bilet)
                </h4>
                <p className="font-body-sm text-body-sm text-secondary truncate">
                  18 maja 2024 • Zniżka Karta Torunianina
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="font-title-md text-title-md text-on-surface font-semibold block">
                  -96,00 zł
                </span>
                <span className="font-label-sm text-label-sm text-emerald-700 dark:text-emerald-400 font-medium">
                  Zniżka -20%
                </span>
              </div>
              <button
                onClick={() => alert('Pobieranie e-biletu PDF...')}
                className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                title="Pobierz bilet PDF"
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">download</span>
              </button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-space-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-20">badge</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  Bilet Miesięczny Sieciowy
                </h4>
                <p className="font-body-sm text-body-sm text-secondary truncate">
                  01.05 - 31.05 • Karta Dużej Rodziny
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="font-title-md text-title-md text-on-surface font-semibold block">
                  -52,00 zł
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  Zarchiwizowany
                </span>
              </div>
              <button
                onClick={() => alert('Pobieranie faktury VAT w formacie PDF...')}
                className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer"
                title="Pobierz fakturę VAT"
                type="button"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">picture_as_pdf</span>
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  </div>

      {/* QR Code Inspection Modal */}
      {isQrModalOpen && (
        <div
          className="!m-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) setIsQrModalOpen(false); }}
        >
          <div role="dialog" aria-modal="true" aria-label="Kod QR Karty Torunianina" className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-between w-full">
              <span className="font-title-lg text-title-lg font-bold text-on-surface">
                Karta Torunianina
              </span>
              <button
                onClick={() => setIsQrModalOpen(false)}
                aria-label="Zamknij"
                type="button"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">close</span>
              </button>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-lg border-4 border-slate-200">
              <QrGraphic className="w-60 h-60" />
            </div>

            <div>
              <p className="font-headline-sm font-bold text-on-surface">{fullName}</p>
              <p className="font-title-md font-mono text-secondary mt-0.5">{cardNo}</p>
              <p className="font-label-sm text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                Ważny: {currentTimeStr} • Zabezpieczenie dynamiczne
              </p>
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-title-md font-semibold hover:opacity-90"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* MZK Price List Modal */}
      {isPriceListOpen && (
        <div
          className="!m-0 fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsPriceListOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cennik biletów MZK Toruń"
            className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-title-lg font-bold text-on-surface">Cennik biletów MZK Toruń</h3>
              <button
                onClick={() => setIsPriceListOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
                type="button"
                aria-label="Zamknij cennik"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">close</span>
              </button>
            </div>

            <div className="rounded-xl border border-outline overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3.5 py-2 bg-surface-container-low text-fs-11 font-semibold uppercase tracking-wider text-secondary">
                <span>Bilet</span>
                <span className="text-right">Normalny</span>
                <span className="text-right">Ulgowy</span>
              </div>
              {MZK_PRICE_LIST.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-3.5 py-3 border-t border-outline-variant text-sm"
                >
                  <span className="text-on-surface font-medium">{row.name}</span>
                  <span className="text-on-surface font-bold text-right">{row.normal}</span>
                  <span className="text-on-surface-variant font-semibold text-right">{row.reduced}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsPriceListOpen(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md font-semibold cursor-pointer"
              type="button"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}

      {/* Benefits Catalog Modal */}
      {isBenefitsModalOpen && (
        <div
          className="!m-0 fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) setIsBenefitsModalOpen(false); }}
        >
          <div role="dialog" aria-modal="true" aria-label="Katalog zniżek mieszkańca" className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-title-lg font-bold text-on-surface">Katalog zniżek mieszkańca</h3>
              <button
                onClick={() => setIsBenefitsModalOpen(false)}
                aria-label="Zamknij"
                type="button"
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-surface-container-low">
                <span className="font-title-md font-semibold block">Teatr im. Wilama Horzycy</span>
                <span className="font-body-sm text-secondary">Zniżka -20% na spektakle repertuarowe</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low">
                <span className="font-title-md font-semibold block">Centrum Nowoczesności Młyn Wiedzy</span>
                <span className="font-body-sm text-secondary">Zniżka -30% na wejścia stałe i czasowe</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low">
                <span className="font-title-md font-semibold block">Muzeum Okręgowe w Toruniu</span>
                <span className="font-body-sm text-secondary">Wstęp bezpłatny w każdą pierwszą środę miesiąca</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-container-low">
                <span className="font-title-md font-semibold block">Baseny Miejskie MOSiR Toruń</span>
                <span className="font-body-sm text-secondary">Bilety ulgowe dla wszystkich rezydentów</span>
              </div>
            </div>
            <button
              onClick={() => setIsBenefitsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-surface-container text-on-surface font-label-md font-semibold"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
