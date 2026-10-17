import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function VotesScreen({ isVoteModalOpen, setIsVoteModalOpen }) {
  const [activeTab, setActiveTab] = useState('glosowania');
  const [selectedDistrict, setSelectedDistrict] = useState('Wszystkie dzielnice');
  const [selectedTopic, setSelectedTopic] = useState('Zieleń miejska');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteCount, setVoteCount] = useState(3240);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newReportText, setNewReportText] = useState('');
  const [reportCategory, setReportCategory] = useState('Infrastruktura');
  const [reportSuccess, setReportSuccess] = useState(false);

  const districts = [
    'Wszystkie dzielnice',
    'Bydgoskie Przedmieście',
    'Mokre',
    'Stare Miasto',
    'Rubinkowo',
  ];

  const topics = [
    { name: 'Zieleń miejska', color: 'bg-tertiary' },
    { name: 'Transport & MPK', color: 'bg-secondary' },
    { name: 'Infrastruktura', color: 'bg-primary' },
    { name: 'Kultura & Sport', color: 'bg-secondary-container' },
  ];

  const handleConfirmVote = () => {
    setIsSubmittingVote(true);
    setTimeout(() => {
      setIsSubmittingVote(false);
      setIsVoteModalOpen(false);
      setHasVoted(true);
      setVoteCount((prev) => prev + 1);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }
    }, 700);
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!newReportText.trim()) return;
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setIsReportModalOpen(false);
      setNewReportText('');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-10">
      {/* Title */}
      <div className="flex items-center gap-2 pt-1 pb-1">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-primary">
          <span className="material-symbols-outlined text-[20px]">how_to_vote</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Partycypacja Obywatelska
        </h1>
      </div>

      {/* Tabs */}
      <div className="pb-1 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="inline-flex w-fit max-w-full p-1 bg-surface-container rounded-2xl gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('glosowania')}
            className={`tab-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'glosowania'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-secondary hover:text-on-surface font-medium'
            }`}
            type="button"
          >
            Głosowania BO
          </button>
          <button
            onClick={() => setActiveTab('inwestycje')}
            className={`tab-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inwestycje'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-secondary hover:text-on-surface font-medium'
            }`}
            type="button"
          >
            Inwestycje 2025
          </button>
          <button
            onClick={() => setActiveTab('konsultacje')}
            className={`tab-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'konsultacje'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-secondary hover:text-on-surface font-medium'
            }`}
            type="button"
          >
            Konsultacje
          </button>
          <button
            onClick={() => setActiveTab('zgloszenia')}
            className={`tab-btn px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer relative whitespace-nowrap ${
              activeTab === 'zgloszenia'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                : 'text-secondary hover:text-on-surface font-medium'
            }`}
            type="button"
          >
            Zgłoszenia
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] ml-1 font-bold">
              3
            </span>
          </button>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-primary text-white font-semibold text-sm inline-flex items-center justify-center gap-2 self-start md:self-auto shrink-0 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
          Zgłoś problem
        </button>
      </div>

      {/* Filters (Rejon & Temat) */}
      <div className="flex flex-col gap-2 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-secondary uppercase tracking-wider shrink-0 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            Rejon:
          </span>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                selectedDistrict === d
                  ? 'bg-primary text-white font-medium'
                  : 'bg-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs text-secondary uppercase tracking-wider shrink-0 flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">category</span>
            Temat:
          </span>
          {topics.map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedTopic(t.name)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                selectedTopic === t.name
                  ? 'bg-primary text-white font-medium'
                  : 'bg-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${t.color}`}></span>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content depending on tab */}
      <div className="flex flex-col space-y-6">
        {(activeTab === 'glosowania' || activeTab === 'all') && (
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="material-symbols-outlined text-primary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  gavel
                </span>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  Oficjalne głosowanie
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
                Głos wiążący
              </span>
            </div>

            {/* Voting Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden transition-all duration-200">
              <div className="relative w-full h-44">
                <img
                  className="w-full h-full object-cover"
                  alt="Park na Bydgoskim Przedmieściu"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMBPL8uoyIlqWhodDtyeS0YTgZ5VRSq9rUcjRxB8odlBA7EPTHSCU6Oe7ouLw3j9fNkernUdLRxjY3obsuNXVMfu-sPBcnSsCoWCZ-qF5spb9_-hU1Wyp_is0yXiW23q7MEco_l8ngI_kLzw_ED4a7sbYgCULJmgUvMq8_OGR_dJq-eDfAckjLSHgqM7Hnfa2bjdflfDY8O50Fux2-gJm5hz7XAFeW2JdyLyeqjmB-L7_8QRAetaqd"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Budżet Obywatelski 2025
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-surface-container-lowest">
                  <span className="font-label-sm text-label-sm bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                    Ważne do 30.06 (pozostało 14 dni)
                  </span>
                  <span className="font-title-md text-title-md text-surface-container-lowest font-semibold">
                    450 000 PLN
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
                  <span className="flex items-center gap-0.5 text-primary-container font-medium">
                    <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                    Bydgoskie Przedmieście
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px]">park</span>
                    Ekologia i rekreacja
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug font-bold">
                  Modernizacja Parku na Bydgoskim Przedmieściu – strefa rekreacji i bioróżnorodności
                </h3>
                <p className="font-body-sm text-body-sm text-secondary line-clamp-2">
                  Projekt obejmuje rekultywację stawu, instalację naturalnych łąk kwietnych, strefę cichego relaksu z hamakami oraz energooszczędne oświetlenie parkowe przyjazne nietoperzom.
                </p>

                <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center font-label-sm text-label-sm">
                    <span className="text-on-surface font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">group</span>
                      Poparcie torunian:
                    </span>
                    <span className="font-semibold text-on-surface">
                      {voteCount.toLocaleString()} głosów (68% progu)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-secondary font-label-sm">
                    <span>Weryfikacja PESEL / Karta Torunianina</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (!hasVoted) setIsVoteModalOpen(true);
                    }}
                    disabled={hasVoted}
                    className={`flex-1 h-11 rounded-lg font-title-md text-title-md flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-semibold ${
                      hasVoted
                        ? 'btn-voted cursor-default'
                        : 'bg-primary text-white'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {hasVoted ? 'check' : 'how_to_vote'}
                    </span>
                    {hasVoted ? 'Głos oddany' : 'Zagłosuj teraz'}
                  </button>

                  <button
                    onClick={() =>
                      alert('Kosztorys projektu:\n• Rekultywacja stawu: 180 000 zł\n• Oświetlenie parkowe LED: 120 000 zł\n• Ławki, hamaki i mała architektura: 90 000 zł\n• Łąki kwietne i nasadzenia: 60 000 zł\nSuma: 450 000 zł')
                    }
                    className="px-3.5 h-11 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-title-md text-title-md flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Szczegóły i kosztorys"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">description</span>
                    <span className="hidden sm:inline">Kosztorys</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inwestycje Miejskie & Transparentny Budżet Tab */}
        {activeTab === 'inwestycje' && (
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-secondary uppercase tracking-wider font-semibold">
                  Transparentne Miasto
                </span>
                <h2 className="text-lg font-bold text-on-surface">
                  Inwestycje i budżet Torunia 2025
                </h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
            </div>

            {/* Budget Overview KPI Banner */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-secondary font-medium">Planowane nakłady inwestycyjne w 2025 r.:</span>
                <div className="text-2xl sm:text-3xl font-bold text-primary mt-0.5">482 450 000 zł</div>
                <p className="text-xs text-secondary mt-1">
                  Uchwała Budżetowa Rady Miasta Torunia • 64 aktywne zadania strategiczne
                </p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => alert('Pobieranie oficjalnego sprawozdania z wykonania budżetu m. Torunia (PDF z Biuletynu BIP)...')}
                  className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>Raport BIP</span>
                </button>
              </div>
            </div>

            {/* Key Investment Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project 1 */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-secondary">214 mln zł</span>
                  </div>
                  <h3 className="font-bold text-base text-on-surface">
                    Budowa nowej trasy tramwajowej na osiedle Jar
                  </h3>
                  <p className="text-secondary text-xs mt-1">
                    Trasa o długości 5,5 km toru pojedynczego wraz z węzłem przesiadkowym i zielonym torowiskiem.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Zaawansowanie prac:</span>
                    <span className="font-bold text-on-surface">78%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-[11px] text-secondary">Planowane oddanie: IV kwartał 2025</span>
                </div>
              </div>

              {/* Project 2 */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-secondary">46 mln zł</span>
                  </div>
                  <h3 className="font-bold text-base text-on-surface">
                    Rewitalizacja Bulwaru Filadelfijskiego
                  </h3>
                  <p className="text-secondary text-xs mt-1">
                    Promenada nadrzeczna, schody terenowe, zieleń nadrzeczna i oświetlenie historyczne wzdłuż Wisły.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Zaawansowanie prac:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">92%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-[11px] text-secondary">Etap odbiorów technicznych</span>
                </div>
              </div>

              {/* Project 3 */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-secondary">76 mln zł</span>
                  </div>
                  <h3 className="font-bold text-base text-on-surface">
                    Budowa Szkoły Podstawowej przy ul. Strzałowej
                  </h3>
                  <p className="text-secondary text-xs mt-1">
                    Nowoczesny kompleks oświatowy na lewobrzeżu z basenem, salami gimnastycznymi i przedszkolem.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Zaawansowanie prac:</span>
                    <span className="font-bold text-on-surface">44%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '44%' }}></div>
                  </div>
                  <span className="text-[11px] text-secondary">Stan surowy otwarty</span>
                </div>
              </div>

              {/* Project 4 */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-secondary">38 mln zł</span>
                  </div>
                  <h3 className="font-bold text-base text-on-surface">
                    Europejskie Centrum Filmowe Camerimage
                  </h3>
                  <p className="text-secondary text-xs mt-1">
                    Budowa studia filmowego i przestrzeni wystawienniczych na toruńskich Jordankach.
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/40">
                  <div className="flex justify-between text-xs">
                    <span className="text-secondary">Zaawansowanie prac:</span>
                    <span className="font-bold text-on-surface">31%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '31%' }}></div>
                  </div>
                  <span className="text-[11px] text-secondary">Prace fundamentowe i konstrukcyjne</span>
                </div>
              </div>
            </div>

            {/* Budget Structure Percentages */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline shadow-card flex flex-col space-y-3">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Struktura wydatków majątkowych Torunia 2025
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline">
                  <span className="text-xs text-secondary block">Infrastruktura i drogi</span>
                  <span className="text-lg font-bold text-primary">34%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline">
                  <span className="text-xs text-secondary block">Transport zbiorowy</span>
                  <span className="text-lg font-bold text-on-surface">26%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline">
                  <span className="text-xs text-secondary block">Oświata i wychowanie</span>
                  <span className="text-lg font-bold text-on-surface">22%</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-outline">
                  <span className="text-xs text-secondary block">Zieleń i ekologia</span>
                  <span className="text-lg font-bold text-emerald-600">18%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'konsultacje') && (
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[20px]">forum</span>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Konsultacje społeczne</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                Opinia doradcza
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface border border-outline font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                    Wydział Gospodarki Komunalnej
                  </span>
                </div>
                <span className="text-secondary font-label-sm text-label-sm shrink-0">Pozostało 8 dni</span>
              </div>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold leading-tight">
                  Nowy układ linii autobusowych po otwarciu trasy tramwajowej na Jar
                </h3>
                <p className="font-body-sm text-body-sm text-secondary mt-1">
                  Zgłoś preferowane częstotliwości kursów oraz proponowane korekty przystanków przesiadkowych na północy miasta.
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="inline-block h-6 w-6 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-label-sm text-[10px] font-bold">
                      AK
                    </div>
                    <div className="inline-block h-6 w-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-[10px] font-bold">
                      ML
                    </div>
                    <div className="inline-block h-6 w-6 rounded-full bg-surface-container text-secondary flex items-center justify-center font-label-sm text-[10px]">
                      +82
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary">842 odpowiedzi</span>
                </div>
                <button
                  onClick={() => alert('Ankieta konsultacyjna dot. linii MZK Jar:\nFormularz otwiera się w miejskim systemie konsultacji.')}
                  className="h-9 px-3.5 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-lg font-label-lg text-label-lg flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                  type="button"
                >
                  <span>Wyraź opinię</span>
                  <span className="font-label-sm text-label-sm text-secondary">(~3 min)</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'zgloszenia' && (
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-700 dark:text-emerald-400 text-[20px]">assignment_turned_in</span>
                <h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Moje ostatnie zgłoszenie</h2>
              </div>
              <span className="font-label-md text-label-md text-primary font-medium flex items-center gap-0.5">
                Wszystkie (3)
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
                      W realizacji przez MZD
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">Wczoraj, 14:20</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                    Uzupełnienie doświetlenia przejścia dla pieszych ul. Grudziądzka
                  </h4>
                </div>
                <div className="w-12 h-12 rounded-lg bg-surface-container shrink-0 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Przejście dla pieszych ul. Grudziądzka"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuPq_kLEMOFOCrH4Hadlv1wlxr_iKkSIu4IU8wpc29VWDziQbhKNpVJYGk_RrdxyqH7UpRjkxBAjO-xGtJ9bylKLq6CgSTmV-_ocWUhbWA738eIgTQO0kzc-6GfKIN9GMQCvVbEqoCwRGnlQkYYHSiZIwRxcEaEvlZRVxqeWI87GxKalcWF-yFxaGEeZS4MNvd0ozM_ITr3RpaPMOto2M1LRECEN24S-E6tQDPTla6ygu4g4hndYlO"
                  />
                </div>
              </div>
              <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">build_circle</span>
                  <span>
                    Zaplanowano montaż opraw LED: <strong className="text-on-surface font-medium">do 25 lipca</strong>
                  </span>
                </div>
                <button
                  onClick={() => alert('Dziennik prac zgłoszenia #TRN-ZGL-4912:\n• 15.10: Przyjęcie zgłoszenia\n• 16.10: Wizja lokalna MZD\n• Status: Zakup opraw doświetlających')}
                  className="text-primary font-label-sm text-label-sm font-semibold hover:underline flex items-center cursor-pointer"
                  type="button"
                >
                  Dziennik prac
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Vote Confirmation Modal */}
      {isVoteModalOpen && (
        <div
          className="!m-0 fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget && !isSubmittingVote) setIsVoteModalOpen(false); }}
        >
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-1 bg-surface-container-high rounded-full mx-auto sm:hidden"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <span className="font-title-lg text-title-lg text-on-surface font-semibold">Potwierdź swój głos</span>
              </div>
              <button
                onClick={() => setIsVoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-1.5">
              <span className="font-label-sm text-label-sm text-secondary">Wybrany projekt (Budżet Obywatelski 2025):</span>
              <span className="font-title-md text-title-md text-on-surface font-semibold leading-snug">
                Modernizacja Parku na Bydgoskim Przedmieściu
              </span>
              <span className="text-tertiary font-label-sm text-label-sm font-medium flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Twoja Karta Torunianina jest aktywna i uprawniona
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-secondary">
              Pamiętaj: oddany głos ma charakter ostateczny i zostanie zarejestrowany w Miejskim Systemie Partycypacji.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setIsVoteModalOpen(false)}
                className="flex-1 h-11 rounded-lg bg-surface-container text-on-surface font-title-md text-title-md hover:bg-surface-container-high transition-colors cursor-pointer"
                type="button"
              >
                Wróć
              </button>
              <button
                onClick={handleConfirmVote}
                disabled={isSubmittingVote}
                className="flex-1 h-11 rounded-lg bg-primary text-white font-title-md text-title-md shadow-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors cursor-pointer"
                type="button"
              >
                {isSubmittingVote ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Rejestracja...</span>
                  </>
                ) : (
                  'Oddaję głos'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Report Modal */}
      {isReportModalOpen && (
        <div
          className="!m-0 fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) setIsReportModalOpen(false); }}
        >
          <div className="bg-surface-container-lowest w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="w-12 h-1 bg-surface-container-high rounded-full mx-auto sm:hidden"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">add_location_alt</span>
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Zgłoś usterkę lub pomysł</h3>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">task_alt</span>
                </div>
                <h4 className="font-title-lg font-bold text-on-surface">Zgłoszenie przyjęte!</h4>
                <p className="font-body-sm text-secondary">
                  Nadano numer zgłoszenia: TRN-{Math.floor(1000 + Math.random() * 9000)}. Wydział merytoryczny UM Torunia został powiadomiony.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateReport} className="flex flex-col gap-3">
                <div>
                  <label className="font-label-sm text-label-sm text-secondary block mb-1">
                    Kategoria sprawy
                  </label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-surface-container-low text-on-surface border border-surface-container text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="Infrastruktura">Drogi i chodniki (MZD)</option>
                    <option value="Oświetlenie">Oświetlenie miejskie</option>
                    <option value="Zieleń">Zieleń i parki miejskie</option>
                    <option value="Czystość">Czystość i odpady komunalne</option>
                    <option value="Komunikacja">Komunikacja miejska (MZK)</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm text-secondary block mb-1">
                    Opis usterki lub inicjatywy
                  </label>
                  <textarea
                    rows={3}
                    value={newReportText}
                    onChange={(e) => setNewReportText(e.target.value)}
                    placeholder="Np. Uszkodzona nawierzchnia chodnika przy ul. Szerokiej 12..."
                    className="w-full resize-none p-2.5 rounded-lg bg-surface-container-low text-on-surface border border-surface-container text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 text-secondary font-label-sm text-label-sm p-2 rounded-lg bg-surface-container-low">
                  <span className="material-symbols-outlined text-[18px] text-primary">my_location</span>
                  <span>Lokalizacja GPS zostanie dołączona automatycznie (Toruń, Centrum)</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="flex-1 h-11 rounded-lg bg-surface-container text-on-surface font-title-md font-medium"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-lg bg-primary text-on-primary font-title-md font-semibold shadow-sm hover:opacity-95"
                  >
                    Wyślij zgłoszenie
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
