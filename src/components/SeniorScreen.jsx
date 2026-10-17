import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { usePrefs } from '../PrefsContext.jsx';
import { EVENTS, STOPS, DISRUPTIONS, nextBusDepartures, fmtTime } from '../data/city.js';

// Short list of key stops for seniors (central hubs, hospitals, clinic) instead of all ~390 MZK stops.
const SENIOR_STOP_IDS = ['plac-rapackiego', 'dworzec-glowny', 'waly-gen-sikorskiego', 'uniwersytet', 'szpital-bielany', 'szpital-miejski', 'przychodnia'];
const SENIOR_STOPS = SENIOR_STOP_IDS.map((id) => STOPS.find((s) => s.id === id)).filter(Boolean);

export default function SeniorScreen() {
  const { user, logout } = useAuth();
  const { prefs, setPref } = usePrefs();

  // Active subview: 'home' | 'card' | 'mzk' | 'phone' | 'events' | 'disruptions' | 'budget'
  const [activeView, setActiveView] = useState('home');
  const [selectedStop, setSelectedStop] = useState('plac-rapackiego');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [votedProjects, setVotedProjects] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [enlargedQr, setEnlargedQr] = useState(false);

  // High contrast / large text toggles directly in senior UI
  const isHighContrast = !!prefs.hc;
  const isExtraLarge = prefs.font === 'xlarge';

  const toggleHighContrast = () => {
    setPref('hc', !isHighContrast);
  };

  const toggleFontSize = () => {
    setPref('font', isExtraLarge ? 'normal' : 'xlarge');
  };

  const changeView = (nextView) => {
    setActiveView(nextView);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeView]);

  const playAudio = () => {
    if (!audioElement) {
      const audio = new Audio('/audio/demo.wav');
      audio.onended = () => setAudioPlaying(false);
      audio.play().catch(() => { });
      setAudioElement(audio);
      setAudioPlaying(true);
    } else {
      if (audioPlaying) {
        audioElement.pause();
        setAudioPlaying(false);
      } else {
        audioElement.play().catch(() => { });
        setAudioPlaying(true);
      }
    }
  };

  const toggleVote = (id) => {
    if (votedProjects.includes(id)) {
      setVotedProjects(votedProjects.filter((p) => p !== id));
    } else {
      setVotedProjects([...votedProjects, id]);
    }
  };

  // Pre-filtered events most interesting for seniors
  const seniorEvents = EVENTS.filter((e) =>
    e.id === 'e14' || e.id === 'e5' || e.id === 'e15' || e.id === 'e1' || e.id === 'e6' || e.id === 'e10'
  );

  return (
    <div className={`min-h-screen w-full transition-colors ${isHighContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-900'}`}>

      {/* ── TOP ACCESSIBILITY & HEADER BAR ── */}
      <header className={`w-full border-b-4 sticky top-0 z-30 px-4 py-3 sm:py-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900 shadow-md'}`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-800 text-white border-slate-900'}`}>
              <span className="material-symbols-outlined text-3xl">elderly</span>
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold opacity-80 uppercase tracking-wide">Toruń dla Seniora</p>
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">
                Dzień dobry, Pani {user?.firstName || 'Zofio'}!
              </h1>
            </div>
          </div>

          {/* Accessibility Quick Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">


            <button
              type="button"
              onClick={toggleHighContrast}
              aria-label="Włącz lub wyłącz wysoki kontrast"
              className={`px-3 sm:px-4 py-2.5 rounded-xl font-black text-base sm:text-lg border-2 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${isHighContrast
                ? 'bg-yellow-300 text-black border-yellow-300'
                : 'bg-slate-900 text-yellow-400 border-slate-900'
                }`}
            >
              <span className="material-symbols-outlined text-xl">contrast</span>
              <span className="hidden sm:inline">{isHighContrast ? 'Kontrast: WŁ' : 'Kontrast'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              aria-label="Wyloguj się z aplikacji"
              className={`p-2.5 rounded-xl border-2 flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${isHighContrast ? 'bg-red-600 text-white border-yellow-300' : 'bg-red-100 text-red-900 border-red-700'
                }`}
              title="Wyloguj się"
            >
              <span className="material-symbols-outlined text-2xl font-bold">logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">

        {/* ── BACK BUTTON (Visible in subviews) ── */}
        {activeView !== 'home' && (
          <button
            type="button"
            onClick={() => changeView('home')}
            className={`w-full py-4 px-6 rounded-2xl font-black text-xl sm:text-2xl border-4 flex items-center justify-center gap-3 transition-transform active:scale-98 shadow-md cursor-pointer ${isHighContrast
              ? 'bg-yellow-300 text-black border-yellow-300 hover:bg-yellow-400'
              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              }`}
          >
            <span className="material-symbols-outlined text-3xl font-bold">arrow_back</span>
            <span>WRÓĆ DO MENU GŁÓWNEGO</span>
          </button>
        )}

        {/* ── 1. HOME VIEW (MAIN SENIOR DASHBOARD) ── */}
        {activeView === 'home' && (
          <div className="space-y-6">

            {/* SENIOR CARD BANNER — HIGHEST IMPORTANCE */}
            <section
              aria-labelledby="senior-card-status"
              className={`p-5 sm:p-6 rounded-3xl border-4 shadow-lg ${isHighContrast
                ? 'bg-black border-yellow-300 text-yellow-300'
                : 'bg-emerald-50 border-emerald-700 text-emerald-950'
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-yellow-300">verified</span>
                    <span id="senior-card-status" className="text-xl sm:text-2xl font-black uppercase tracking-wide">
                      Karta Seniora: Aktywna
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold">
                    Pani Zofio, jako senior 70+ podróżuje Pani komunikacją miejską w Toruniu <span className="underline decoration-4">całkowicie bezpłatnie</span>!
                  </p>
                  <p className="text-base sm:text-lg font-medium opacity-90">
                    Wystarczy mieć przy sobie telefon z tą kartą lub dowód tożsamości.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => changeView('card')}
                  className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-lg sm:text-xl border-3 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shrink-0 shadow-md ${isHighContrast
                    ? 'bg-yellow-300 text-black border-yellow-300'
                    : 'bg-emerald-700 text-white border-emerald-900 hover:bg-emerald-800'
                    }`}
                >
                  <span className="material-symbols-outlined text-2xl font-bold">qr_code</span>
                  <span>POKAŻ KOD KARTY</span>
                </button>
              </div>
            </section>

            {/* BIG TILES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              {/* TILE: ROZKŁAD JAZDY MZK */}
              <button
                type="button"
                onClick={() => changeView('mzk')}
                className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between gap-4 transition-all active:scale-98 shadow-md hover:shadow-xl cursor-pointer min-h-[160px] ${isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-950/20'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-blue-50/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">departure_board</span>
                  </span>
                  <span className="material-symbols-outlined text-3xl font-bold">chevron_right</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">Rozkład jazdy MZK</h2>
                  <p className="text-base sm:text-lg font-semibold opacity-85 mt-1">
                    Najbliższe tramwaje i autobusy z Twojego przystanku
                  </p>
                </div>
              </button>

              {/* TILE: WAŻNE TELEFONY I POMOC */}
              <button
                type="button"
                onClick={() => changeView('phone')}
                className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between gap-4 transition-all active:scale-98 shadow-md hover:shadow-xl cursor-pointer min-h-[160px] ${isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-950/20'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-amber-50/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-amber-500 text-slate-950 border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">phone_in_talk</span>
                  </span>
                  <span className="material-symbols-outlined text-3xl font-bold">chevron_right</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">Ważne telefony</h2>
                  <p className="text-base sm:text-lg font-semibold opacity-85 mt-1">
                    Pomoc seniora, Urząd Miasta, pogotowie i dyżury
                  </p>
                </div>
              </button>

              {/* TILE: WYDARZENIA DLA SENIORÓW */}
              <button
                type="button"
                onClick={() => changeView('events')}
                className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between gap-4 transition-all active:scale-98 shadow-md hover:shadow-xl cursor-pointer min-h-[160px] ${isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-950/20'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-purple-50/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-purple-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">event</span>
                  </span>
                  <span className="material-symbols-outlined text-3xl font-bold">chevron_right</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">Wydarzenia i kultura</h2>
                  <p className="text-base sm:text-lg font-semibold opacity-85 mt-1">
                    Spotkania, koncerty i prelekcje z bezpłatnym wstępem
                  </p>
                </div>
              </button>

              {/* TILE: UTRUDNIENIA I KOMUNIKATY */}
              <button
                type="button"
                onClick={() => changeView('disruptions')}
                className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between gap-4 transition-all active:scale-98 shadow-md hover:shadow-xl cursor-pointer min-h-[160px] ${isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-950/20'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-orange-50/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-orange-600 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">warning</span>
                  </span>
                  <span className="material-symbols-outlined text-3xl font-bold">chevron_right</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">Komunikaty miejskie</h2>
                  <p className="text-base sm:text-lg font-semibold opacity-85 mt-1">
                    Zmiany w trasach tramwajów i remonty ulic
                  </p>
                </div>
              </button>

              {/* TILE: BUDŻET OBYWATELSKI */}
              <button
                type="button"
                onClick={() => changeView('budget')}
                className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between gap-4 transition-all active:scale-98 shadow-md hover:shadow-xl cursor-pointer min-h-[160px] ${isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-950/20'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-emerald-50/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-emerald-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">how_to_vote</span>
                  </span>
                  <span className="material-symbols-outlined text-3xl font-bold">chevron_right</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">Głosowanie seniora</h2>
                  <p className="text-base sm:text-lg font-semibold opacity-85 mt-1">
                    Wybierz nowe ławki, zieleń i oświetlenie w Toruniu
                  </p>
                </div>
              </button>

              {/* TILE: POSŁUCHAJ OPOWIEŚCI O TORUNIU */}
              <button
                type="button"
                onClick={playAudio}
                className={`p-6 rounded-3xl border-4 text-left flex flex-col justify-between gap-4 transition-all active:scale-98 shadow-md hover:shadow-xl cursor-pointer min-h-[160px] ${isHighContrast
                  ? 'bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-950/20'
                  : 'bg-white border-slate-900 text-slate-900 hover:bg-indigo-50/50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-indigo-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">{audioPlaying ? 'pause' : 'volume_up'}</span>
                  </span>
                  <span className="font-bold text-base px-3 py-1 rounded-full border-2 border-slate-900">
                    {audioPlaying ? 'GRA' : 'POSŁUCHAJ'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black">Opowieści o Toruniu</h2>
                  <p className="text-base sm:text-lg font-semibold opacity-85 mt-1">
                    {audioPlaying ? 'Kliknij, aby zatrzymać odtwarzanie' : 'Kliknij i posłuchaj legendy o Starym Mieście'}
                  </p>
                </div>
              </button>

            </div>

            {/* QUICK CONTACT HELP CARD */}
            <div className={`p-5 rounded-2xl border-3 flex items-center justify-between gap-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-slate-200 border-slate-800'
              }`}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl font-bold">support_agent</span>
                <div>
                  <p className="font-extrabold text-lg">Potrzebujesz pomocy?</p>
                  <p className="text-base font-medium">Zadzwoń do Toruńskiego Centrum Wsparcia: <strong>56 611 89 00</strong></p>
                </div>
              </div>
              <a
                href="tel:566118900"
                className={`px-5 py-3 rounded-xl font-black text-lg border-2 flex items-center gap-2 cursor-pointer shrink-0 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-slate-900 text-white border-slate-900'
                  }`}
              >
                <span className="material-symbols-outlined text-xl">call</span>
                <span className="hidden sm:inline">Zadzwoń</span>
              </a>
            </div>

          </div>
        )}

        {/* ── 2. VIEW: SENIOR CARD & QR DETAILS ── */}
        {activeView === 'card' && (
          <div className="space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl border-4 shadow-xl text-center space-y-6 ${isHighContrast ? 'bg-black border-yellow-300 text-yellow-300' : 'bg-white border-slate-900 text-slate-900'
              }`}>

              <div className="inline-block px-4 py-1.5 rounded-full border-2 border-current font-extrabold text-lg uppercase">
                Oficjalna Karta Miejska Seniora
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black">Zofia Nowicka</h2>
                <p className="text-xl sm:text-2xl font-bold opacity-80 mt-1">PESEL: 51072201262</p>
                <p className="text-lg font-semibold opacity-70">Adres: ul. Mickiewicza 8/15, Toruń</p>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border-4 border-slate-900 max-w-sm mx-auto shadow-inner">
                <img
                  src="/qr.png"
                  alt="Kod QR Karty Miejskiej Seniora"
                  className={`w-64 h-64 object-contain transition-transform ${enlargedQr ? 'scale-110' : ''}`}
                />
                <p className="text-slate-900 font-bold text-base mt-2">
                  Pokaż ten kod kontrolerowi w pojeździe
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setEnlargedQr(!enlargedQr)}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-lg border-3 flex items-center justify-center gap-2 cursor-pointer ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-700 text-white border-slate-900'
                    }`}
                >
                  <span className="material-symbols-outlined text-2xl">zoom_in</span>
                  <span>{enlargedQr ? 'Zmniejsz kod' : 'Powiększ kod'}</span>
                </button>
              </div>

              <div className={`p-4 rounded-2xl border-2 text-left space-y-2 ${isHighContrast ? 'border-yellow-300 bg-yellow-950/20' : 'border-emerald-700 bg-emerald-50 text-emerald-950'
                }`}>
                <p className="font-extrabold text-lg">Ważne uprawnienia seniora:</p>
                <ul className="list-disc list-inside space-y-1 text-base font-semibold">
                  <li>Bezpłatne przejazdy wszystkimi liniami tramwajowymi i autobusowymi MZK Toruń.</li>
                  <li>Zniżki na bilety do Teatru Baj Pomorski, CKK Jordanki i Muzeum Okręgowego.</li>
                  <li>Bezpłatny wstęp na miejskie zajęcia gimnastyczne i basen w wyznaczonych godzinach.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* ── 3. VIEW: ROZKŁAD JAZDY MZK ── */}
        {activeView === 'mzk' && (
          <div className="space-y-6">

            <div className={`p-5 rounded-3xl border-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900'}`}>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">Wybierz przystanek:</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SENIOR_STOPS.map((stop) => {
                  const isSel = selectedStop === stop.id;
                  return (
                    <button
                      key={stop.id}
                      type="button"
                      onClick={() => setSelectedStop(stop.id)}
                      className={`p-4 rounded-2xl font-black text-lg sm:text-xl border-3 text-left flex items-center justify-between cursor-pointer transition-all ${isSel
                        ? (isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-800 text-white border-slate-900')
                        : (isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-slate-100 text-slate-900 border-slate-400')
                        }`}
                    >
                      <span>{stop.name}</span>
                      <span className="material-symbols-outlined text-2xl font-bold">{isSel ? 'check_circle' : 'radio_button_unchecked'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Departures for Selected Stop */}
            <div className={`p-6 rounded-3xl border-4 space-y-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900'}`}>
              <h3 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl font-bold">schedule</span>
                <span>Najbliższe odjazdy: {SENIOR_STOPS.find((s) => s.id === selectedStop)?.name}</span>
              </h3>

              <div className="space-y-3">
                {nextBusDepartures(SENIOR_STOPS.find((s) => s.id === selectedStop), new Date(), 1).slice(0, 6).map((dep, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-2xl border-3 flex items-center justify-between gap-4 ${isHighContrast ? 'border-yellow-300 bg-yellow-950/10' : 'border-slate-800 bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Big Line Number */}
                      <span className={`w-14 h-14 rounded-2xl font-black text-2xl flex items-center justify-center border-2 ${dep.type === 'bus'
                        ? (isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-700 text-white border-slate-900')
                        : (isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-red-700 text-white border-slate-900')
                        }`}>
                        {dep.line}
                      </span>
                      <div>
                        <p className="text-xl sm:text-2xl font-black leading-tight">kierunek: {dep.to}</p>
                        <p className="text-base font-semibold opacity-80 flex items-center gap-1.5 mt-0.5">
                          <span className="material-symbols-outlined text-lg">accessible</span>
                          <span>{dep.type === 'tram' ? 'Tramwaj' : 'Autobus'} • Pojazd niskopodłogowy</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider block opacity-75">Odjazd</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-yellow-300">
                        {dep.inMin === 0 ? 'teraz' : dep.inMin < 60 ? `za ${dep.inMin} min` : fmtTime(dep.at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── 4. VIEW: WAŻNE TELEFONY I POMOC ── */}
        {activeView === 'phone' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border-4 space-y-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900'}`}>
              <h2 className="text-2xl sm:text-3xl font-black">Ważne numery telefonów</h2>
              <p className="text-lg font-semibold opacity-80">
                Dotknij wybranego numeru, aby natychmiast zadzwonić:
              </p>

              <div className="grid grid-cols-1 gap-3">

                {/* Telefon Seniora */}
                <a
                  href="tel:566118900"
                  className={`p-5 rounded-2xl border-3 flex items-center justify-between gap-4 cursor-pointer transition-transform active:scale-98 ${isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-emerald-50 text-emerald-950 border-emerald-800 hover:bg-emerald-100'
                    }`}
                >
                  <div className="space-y-1">
                    <p className="text-2xl font-black">Toruńskie Centrum Wsparcia Seniora</p>
                    <p className="text-lg font-semibold opacity-90">Pomoc w zakupach, wsparcie psychologiczne, wolontariusze</p>
                    <p className="text-2xl font-black text-emerald-700 dark:text-yellow-300">56 611 89 00</p>
                  </div>
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-emerald-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">call</span>
                  </span>
                </a>

                {/* Urząd Miasta Torunia */}
                <a
                  href="tel:566118777"
                  className={`p-5 rounded-2xl border-3 flex items-center justify-between gap-4 cursor-pointer transition-transform active:scale-98 ${isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-blue-50 text-blue-950 border-blue-800 hover:bg-blue-100'
                    }`}
                >
                  <div className="space-y-1">
                    <p className="text-2xl font-black">Informacja Urzędu Miasta Torunia</p>
                    <p className="text-lg font-semibold opacity-90">Sprawy meldunkowe, dowody osobiste, sprawy lokalowe</p>
                    <p className="text-2xl font-black text-blue-700 dark:text-yellow-300">56 611 87 77</p>
                  </div>
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-blue-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">call</span>
                  </span>
                </a>

                {/* Pogotowie Ratunkowe */}
                <a
                  href="tel:999"
                  className={`p-5 rounded-2xl border-3 flex items-center justify-between gap-4 cursor-pointer transition-transform active:scale-98 ${isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-red-50 text-red-950 border-red-800 hover:bg-red-100'
                    }`}
                >
                  <div className="space-y-1">
                    <p className="text-2xl font-black">Pogotowie Ratunkowe (Alarmowy)</p>
                    <p className="text-lg font-semibold opacity-90">W nagłych wypadkach i zagrożeniu życia</p>
                    <p className="text-2xl font-black text-red-700 dark:text-yellow-300">999 lub 112</p>
                  </div>
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-red-700 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">emergency</span>
                  </span>
                </a>

                {/* Straż Miejska */}
                <a
                  href="tel:986"
                  className={`p-5 rounded-2xl border-3 flex items-center justify-between gap-4 cursor-pointer transition-transform active:scale-98 ${isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-slate-100 text-slate-950 border-slate-800 hover:bg-slate-200'
                    }`}
                >
                  <div className="space-y-1">
                    <p className="text-2xl font-black">Straż Miejska Toruń</p>
                    <p className="text-lg font-semibold opacity-90">Zgłoszenia porządkowe, pomoc w trudnych warunkach</p>
                    <p className="text-2xl font-black">986</p>
                  </div>
                  <span className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-slate-800 text-white border-slate-900'}`}>
                    <span className="material-symbols-outlined text-3xl">local_police</span>
                  </span>
                </a>

                {/* Apteka Całodobowa */}
                <div className={`p-5 rounded-2xl border-3 ${isHighContrast ? 'border-yellow-300 bg-yellow-950/10' : 'border-slate-700 bg-slate-50'}`}>
                  <p className="text-2xl font-black">Apteka Całodobowa w Toruniu</p>
                  <p className="text-lg font-semibold opacity-85">Apteka Pod Orłem, Rynek Staromiejski 4 (czynna 24h na dobę)</p>
                  <p className="text-xl font-bold mt-1">Tel. 56 622 28 32</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── 5. VIEW: WYDARZENIA DLA SENIORÓW ── */}
        {activeView === 'events' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border-4 space-y-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900'}`}>
              <h2 className="text-2xl sm:text-3xl font-black">Polecane wydarzenia dla Seniorów</h2>
              <p className="text-lg font-semibold opacity-80">
                Wybrane spotkania i koncerty w Toruniu z dogodnym dojazdem:
              </p>

              <div className="space-y-4">
                {seniorEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-5 rounded-2xl border-3 space-y-2 ${isHighContrast ? 'border-yellow-300 bg-yellow-950/10' : 'border-slate-800 bg-slate-50'
                      }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`px-3 py-1 rounded-full text-base font-black uppercase border ${evt.price.toLowerCase().includes('bezpłatn')
                        ? (isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-emerald-700 text-white border-slate-900')
                        : (isHighContrast ? 'border-yellow-300' : 'bg-blue-100 text-blue-900 border-blue-800')
                        }`}>
                        {evt.price}
                      </span>
                      <span className="text-lg font-extrabold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xl">schedule</span>
                        <span>Godzina {evt.time}</span>
                      </span>
                    </div>

                    <h3 className="text-2xl font-black">{evt.title}</h3>
                    <p className="text-lg font-medium opacity-90">{evt.desc}</p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-base font-bold opacity-80">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-lg">pin_drop</span>
                        <span>{evt.place} ({evt.address})</span>
                      </span>
                      <span>Organizator: {evt.organizer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 6. VIEW: KOMUNIKATY I UTRUDNIENIA ── */}
        {activeView === 'disruptions' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border-4 space-y-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900'}`}>
              <h2 className="text-2xl sm:text-3xl font-black">Komunikaty drogowe i remonty</h2>
              <p className="text-lg font-semibold opacity-80">
                Sprawdź, czy na Twojej trasie nie ma zmian w ruchu lub objazdów:
              </p>

              <div className="space-y-4">
                {DISRUPTIONS.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    className={`p-5 rounded-2xl border-3 space-y-2 ${isHighContrast ? 'border-yellow-300 bg-yellow-950/10' : 'border-slate-800 bg-slate-50'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-2xl font-bold text-orange-600 dark:text-yellow-300">warning</span>
                      <span className="text-xl sm:text-2xl font-black">{d.title}</span>
                    </div>
                    <p className="text-lg font-semibold opacity-90">{d.desc}</p>
                    <p className="text-base font-bold opacity-75">Lokalizacja: {d.street}</p>
                    {d.detour && d.detour !== 'Nie dotyczy' && (
                      <p className="text-base font-extrabold text-blue-700 dark:text-yellow-300">
                        Zalecany objazd: {d.detour}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 7. VIEW: BUDŻET OBYWATELSKI / GŁOSOWANIE ── */}
        {activeView === 'budget' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border-4 space-y-4 ${isHighContrast ? 'bg-black border-yellow-300' : 'bg-white border-slate-900'}`}>
              <h2 className="text-2xl sm:text-3xl font-black">Budżet Obywatelski Torunia</h2>
              <p className="text-lg font-semibold opacity-80">
                Jako mieszkanka Torunia możesz oddać głos na projekty ważne dla seniorów. Wybierz projekty i kliknij &quot;Głosuj&quot;:
              </p>

              <div className="space-y-4">
                {[
                  { id: 'b1', title: 'Wygodne ławki z oparciami w Parku Bydgoskim i na Skarpie', desc: 'Montaż 40 nowych ławek przystosowanych dla seniorów oraz dodatkowe kosze na śmieci.', cost: '85 000 zł' },
                  { id: 'b2', title: 'Doświetlenie przejść dla pieszych na Bydgoskim Przedmieściu', desc: 'Nowoczesne lampy LED i pasy ostrzegawcze na ul. Mickiewicza i Słowackiego.', cost: '120 000 zł' },
                  { id: 'b3', title: 'Bezpłatne warsztaty cyfrowe i kluby brydżowe dla seniorów', desc: 'Cotygodniowe spotkania w filiach biblioteki z nauką obsługi smartfona i komputera.', cost: '45 000 zł' },
                ].map((proj) => {
                  const isVoted = votedProjects.includes(proj.id);
                  return (
                    <div
                      key={proj.id}
                      className={`p-5 rounded-2xl border-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isVoted
                        ? (isHighContrast ? 'border-yellow-300 bg-yellow-950/30' : 'border-emerald-700 bg-emerald-50')
                        : (isHighContrast ? 'border-yellow-300 bg-black' : 'border-slate-800 bg-slate-50')
                        }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase px-2 py-0.5 rounded border border-current">Koszt: {proj.cost}</span>
                        <h3 className="text-2xl font-black">{proj.title}</h3>
                        <p className="text-lg font-medium opacity-90">{proj.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleVote(proj.id)}
                        className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-lg border-3 flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95 ${isVoted
                          ? (isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-emerald-700 text-white border-slate-900')
                          : (isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-slate-900 text-white border-slate-900')
                          }`}
                      >
                        <span className="material-symbols-outlined text-2xl font-bold">{isVoted ? 'check_box' : 'check_box_outline_blank'}</span>
                        <span>{isVoted ? 'ODDANO GŁOS' : 'ODDAJ GŁOS'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {votedProjects.length > 0 && (
                <div className={`p-4 rounded-2xl border-2 text-center font-extrabold text-xl ${isHighContrast ? 'bg-yellow-300 text-black border-yellow-300' : 'bg-emerald-100 text-emerald-950 border-emerald-800'
                  }`}>
                  Dziękujemy! Twój głos został zapisany w systemie Budżetu Obywatelskiego Torunia.
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border-4 space-y-6 ${isHighContrast ? 'bg-black border-yellow-300 text-yellow-300' : 'bg-white border-slate-900 text-slate-900'
            }`}>
            <h3 className="text-3xl font-black">Czy na pewno chcesz się wylogować?</h3>
            <p className="text-xl font-semibold opacity-90">
              Po wylogowaniu trzeba będzie ponownie zalogować się za pomocą profilu zaufanego lub banku.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className={`w-full py-4 rounded-2xl font-black text-xl border-3 cursor-pointer ${isHighContrast ? 'bg-black text-yellow-300 border-yellow-300' : 'bg-slate-200 text-slate-900 border-slate-700'
                  }`}
              >
                NIE, ZOSTAŃ
              </button>
              <button
                type="button"
                onClick={() => { setShowLogoutConfirm(false); logout(); }}
                className={`w-full py-4 rounded-2xl font-black text-xl border-3 cursor-pointer ${isHighContrast ? 'bg-red-600 text-white border-yellow-300' : 'bg-red-700 text-white border-red-900'
                  }`}
              >
                TAK, WYLOGUJ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
