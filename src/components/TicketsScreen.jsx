import React, { useState, useEffect } from 'react';

// A QR code must always be dark modules on a light background to stay scannable,
// regardless of the app theme, so colours are fixed here on purpose.
function QrGraphic({ className = '' }) {
  return (
    <svg
      className={className}
      fill="#0f172a"
      viewBox="0 0 100 100"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Kod QR Karty Torunianina"
    >
      <rect height="28" width="28" x="5" y="5"></rect>
      <rect fill="#ffffff" height="20" width="20" x="9" y="9"></rect>
      <rect height="12" width="12" x="13" y="13"></rect>
      <rect height="28" width="28" x="67" y="5"></rect>
      <rect fill="#ffffff" height="20" width="20" x="71" y="9"></rect>
      <rect height="12" width="12" x="75" y="13"></rect>
      <rect height="28" width="28" x="5" y="67"></rect>
      <rect fill="#ffffff" height="20" width="20" x="9" y="71"></rect>
      <rect height="12" width="12" x="13" y="75"></rect>
      <rect height="6" width="6" x="38" y="10"></rect>
      <rect height="6" width="12" x="48" y="10"></rect>
      <rect height="6" width="12" x="38" y="22"></rect>
      <rect height="10" width="6" x="54" y="22"></rect>
      <rect height="8" width="8" x="10" y="38"></rect>
      <rect height="16" width="6" x="24" y="42"></rect>
      <rect height="10" width="10" x="36" y="36"></rect>
      <rect height="8" width="8" x="50" y="40"></rect>
      <rect height="6" width="12" x="66" y="38"></rect>
      <rect height="14" width="8" x="82" y="40"></rect>
      <rect height="6" width="16" x="42" y="52"></rect>
      <rect height="8" width="8" x="62" y="50"></rect>
      <rect height="6" width="14" x="38" y="66"></rect>
      <rect height="14" width="8" x="56" y="64"></rect>
      <rect height="6" width="10" x="68" y="66"></rect>
      <rect height="16" width="8" x="82" y="60"></rect>
      <rect height="14" width="6" x="40" y="78"></rect>
      <rect height="8" width="12" x="50" y="82"></rect>
      <rect height="6" width="14" x="66" y="78"></rect>
      <rect height="10" width="8" x="84" y="82"></rect>
    </svg>
  );
}

const MZK_PRICE_LIST = [
  { name: 'Bilet 30-minutowy', normal: '3,80 zł', reduced: '1,90 zł' },
  { name: 'Bilet 90-minutowy', normal: '6,80 zł', reduced: '3,40 zł' },
  { name: 'Bilet dobowy (24h)', normal: '12,00 zł', reduced: '6,00 zł' },
  { name: 'Bilet miesięczny', normal: '88,00 zł', reduced: '—' },
];

export default function TicketsScreen({ openQrRequested = false, onQrHandled }) {
  // Live ticking clock for resident card security
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  // Live ticket countdown in seconds (18 mins 42 secs = 1122 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(1122);
  const [ticketCategory, setTicketCategory] = useState('czasowe');
  const [selectedTariff30, setSelectedTariff30] = useState('normalny'); // normalny or ulgowy
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
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
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
              System biletowy MZK: Sieć aktywna • Ważność PIT do 30.04.2025
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
                <span className="material-symbols-outlined text-on-surface text-[22px]">
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
                  Aleksandra Wiśniewska
                </h2>
              </div>
              <div className="mt-2.5">
                <span className="font-label-sm text-label-sm text-secondary block">
                  Numer identyfikatora
                </span>
                <p className="font-title-md text-title-md font-mono text-on-surface tracking-wide font-semibold">
                  TRN-2024-88492
                </p>
              </div>
              <div className="mt-2.5 inline-flex items-center gap-1.5 bg-surface-container rounded-lg px-2 py-1 self-start">
                <span className="material-symbols-outlined text-[15px] text-secondary">group</span>
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
                  <span className="font-label-sm text-[9px] font-semibold text-slate-500 block tracking-tight uppercase">
                    Skanuj kontrolerem
                  </span>
                </div>
              </div>

              {/* Live pulse timestamp */}
              <div className="flex items-center gap-1 mt-1.5 text-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-label-sm text-[10px] text-secondary font-mono tracking-tight">
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
              <span className="material-symbols-outlined text-[16px]">info</span>
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
                <span
                  className="material-symbols-outlined text-[20px]"
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
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl mb-space-md text-center">
          <button
            onClick={() => setTicketCategory('czasowe')}
            className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
              ticketCategory === 'czasowe'
                ? 'bg-surface-container-lowest shadow-sm font-semibold text-primary'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            Czasowe
          </button>
          <button
            onClick={() => setTicketCategory('jednorazowe')}
            className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
              ticketCategory === 'jednorazowe'
                ? 'bg-surface-container-lowest shadow-sm font-semibold text-primary'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            Jednorazowe
          </button>
          <button
            onClick={() => setTicketCategory('okresowe')}
            className={`flex-1 py-2 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
              ticketCategory === 'okresowe'
                ? 'bg-surface-container-lowest shadow-sm font-semibold text-primary'
                : 'text-secondary hover:text-on-surface'
            }`}
            type="button"
          >
            Okresowe / Miesięczne
          </button>
        </div>

        {/* Ticket Stack */}
        <div className="flex flex-col gap-space-sm">
          {/* Fast Buy Card 1: 30-minutowy */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                      Bilet 30-minutowy miejski
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-semibold">
                      Popularny
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">
                    Autobusy i tramwaje w I strefie Toruń
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {selectedTariff30 === 'normalny' ? '3,80 zł' : '1,90 zł'}
                </span>
                <span className="font-label-sm text-label-sm text-secondary block">
                  {selectedTariff30 === 'normalny' ? 'Ulgowy: 1,90 zł' : 'Normalny: 3,80 zł'}
                </span>
              </div>
            </div>

            {/* Tariff Switch */}
            <div className="flex items-center justify-between gap-2 pt-2 pb-3">
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                <button
                  onClick={() => setSelectedTariff30('normalny')}
                  className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors cursor-pointer ${
                    selectedTariff30 === 'normalny'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Normalny (3,80 zł)
                </button>
                <button
                  onClick={() => setSelectedTariff30('ulgowy')}
                  className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors cursor-pointer ${
                    selectedTariff30 === 'ulgowy'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Ulgowy (1,90 zł)
                </button>
              </div>
              <span className="font-label-sm text-label-sm text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">check</span>
                KDR Aktywna
              </span>
            </div>

            {/* Purchase Button */}
            <button
              onClick={() =>
                handleBuyTicket(
                  `Bilet 30-minutowy (${selectedTariff30})`,
                  selectedTariff30 === 'normalny' ? '3,80 zł' : '1,90 zł'
                )
              }
              className="w-full h-11 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg font-semibold flex items-center justify-center gap-2 active:bg-primary-container shadow-sm hover:opacity-95 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Kup 1 kliknięciem (BLIK / Karta)</span>
            </button>
          </div>

          {/* Ticket Card 2: 90-minutowy */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </span>
              <div className="min-w-0">
                <h4 className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  Bilet 90-minutowy sieciowy
                </h4>
                <p className="font-body-sm text-body-sm text-secondary truncate">
                  Wszystkie linie dzienne i nocne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-title-lg text-title-lg text-on-surface font-bold">6,80 zł</span>
                <span className="font-label-sm text-label-sm text-secondary block">Ulgowy: 3,40 zł</span>
              </div>
              <button
                onClick={() => handleBuyTicket('Bilet 90-minutowy', '6,80 zł')}
                className="w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Ticket Card 3: 24h */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[20px]">all_inclusive</span>
              </span>
              <div className="min-w-0">
                <h4 className="font-title-md text-title-md text-on-surface truncate font-semibold">
                  Bilet dobowy (24h)
                </h4>
                <p className="font-body-sm text-body-sm text-secondary truncate">
                  Dowolna liczba przesiadek
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="font-title-lg text-title-lg text-on-surface font-bold">12,00 zł</span>
                <span className="font-label-sm text-label-sm text-secondary block">Ulgowy: 6,00 zł</span>
              </div>
              <button
                onClick={() => handleBuyTicket('Bilet dobowy 24h', '12,00 zł')}
                className="w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              </button>
            </div>
          </div>
        </div>
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
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold shadow-sm">
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
              <span className="material-symbols-outlined text-[42px] text-primary">science</span>
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[11px] font-bold shadow-sm">
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
      <section>
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-sm">
          Historia biletów i transakcji
        </h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm divide-y divide-surface-container overflow-hidden">
          {/* Item 1 */}
          <div className="p-space-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">theater_comedy</span>
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
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-space-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">badge</span>
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
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
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
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-between w-full">
              <span className="font-title-lg text-title-lg font-bold text-on-surface">
                Karta Torunianina
              </span>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-lg border-4 border-slate-200">
              <QrGraphic className="w-60 h-60" />
            </div>

            <div>
              <p className="font-headline-sm font-bold text-on-surface">Aleksandra Wiśniewska</p>
              <p className="font-title-md font-mono text-secondary mt-0.5">TRN-2024-88492</p>
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
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="rounded-xl border border-outline overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-3.5 py-2 bg-surface-container-low text-[11px] font-semibold uppercase tracking-wider text-secondary">
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
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto gap-4">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <h3 className="font-title-lg font-bold text-on-surface">Katalog zniżek mieszkańca</h3>
              <button
                onClick={() => setIsBenefitsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
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
