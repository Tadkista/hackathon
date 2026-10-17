import React, { useState } from 'react';
import { useTheme } from '../ThemeContext.jsx';
import { useAuth } from '../AuthContext.jsx';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
} from './map/map.tsx';

export default function ParkingScreen() {
  const { isDark } = useTheme();
  const { isGuest } = useAuth();
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paySuccessToast, setPaySuccessToast] = useState(null);
  const [parkingDuration, setParkingDuration] = useState('1h');
  const [plateNumber, setPlateNumber] = useState('CTR 49821');

  // Real-world authentic Toruń parking spots with GPS coordinates
  const parkingLots = [
    {
      id: 'katarzyna',
      name: 'Parking Podziemny Plac św. Katarzyny',
      address: 'Plac św. Katarzyny 1, Stare Miasto',
      coords: [18.6105, 53.0135],
      zone: 'strefa-a',
      zoneName: 'Strefa A (Śródmiejska)',
      type: 'Kubaturowy / Podziemny',
      totalSpots: 175,
      freeSpots: 64,
      hourlyRate: '5,00 zł',
      residentRate: '3,50 zł',
      isGuarded: true,
      hasEvCharging: true,
      distance: '0.3 km stąd',
      occupancy: 63,
    },
    {
      id: 'csw',
      name: 'Parking CSW / Wały gen. Sikorskiego',
      address: 'Wały gen. Sikorskiego 13, Centrum',
      coords: [18.6002, 53.0105],
      zone: 'strefa-a',
      zoneName: 'Strefa A (Śródmiejska)',
      type: 'Parking naziemny',
      totalSpots: 110,
      freeSpots: 28,
      hourlyRate: '5,00 zł',
      residentRate: '3,50 zł',
      isGuarded: false,
      hasEvCharging: true,
      distance: '0.6 km stąd',
      occupancy: 75,
    },
    {
      id: 'bulwar',
      name: 'Parking Bulwar Filadelfijski',
      address: 'Bulwar Filadelfijski / Mostowa, Nabrzeże Wisły',
      coords: [18.6075, 53.0078],
      zone: 'strefa-a',
      zoneName: 'Strefa A (Śródmiejska)',
      type: 'Parking naziemny',
      totalSpots: 85,
      freeSpots: 12,
      hourlyRate: '5,00 zł',
      residentRate: '3,50 zł',
      isGuarded: false,
      hasEvCharging: false,
      distance: '0.5 km stąd',
      occupancy: 86,
    },
    {
      id: 'rynek-nowy',
      name: 'Parking Rynek Nowomiejski / św. Jakuba',
      address: 'Rynek Nowomiejski, Stare Miasto',
      coords: [18.6110, 53.0112],
      zone: 'strefa-a',
      zoneName: 'Strefa A (Śródmiejska)',
      type: 'Strefa uliczna',
      totalSpots: 45,
      freeSpots: 6,
      hourlyRate: '5,00 zł',
      residentRate: '3,50 zł',
      isGuarded: false,
      hasEvCharging: false,
      distance: '0.4 km stąd',
      occupancy: 87,
    },
    {
      id: 'podwale',
      name: 'Parking Podwale / Czerwona Droga',
      address: 'ul. Czerwona Droga / Podwale',
      coords: [18.6030, 53.0152],
      zone: 'strefa-b',
      zoneName: 'Strefa B (Obrzeże)',
      type: 'Parking miejski',
      totalSpots: 130,
      freeSpots: 58,
      hourlyRate: '3,00 zł',
      residentRate: '2,10 zł',
      isGuarded: false,
      hasEvCharging: false,
      distance: '0.8 km stąd',
      occupancy: 55,
    },
    {
      id: 'pr-dziewulskiego',
      name: 'Park & Ride Dziewulskiego (Rubinkowo)',
      address: 'ul. Dziewulskiego 38, Rubinkowo',
      coords: [18.6650, 53.0280],
      zone: 'pr',
      zoneName: 'Park & Ride (P+R)',
      type: 'Przesiadkowy P+R',
      totalSpots: 220,
      freeSpots: 142,
      hourlyRate: 'Bezpłatny z biletem MZK',
      residentRate: 'Bezpłatny',
      isGuarded: true,
      hasEvCharging: true,
      distance: '4.2 km stąd',
      occupancy: 35,
    },
    {
      id: 'pr-olimpijska',
      name: 'Park & Ride Olimpijska (Skarpa)',
      address: 'ul. Olimpijska 42, Pętla Tramwajowa',
      coords: [18.6850, 53.0330],
      zone: 'pr',
      zoneName: 'Park & Ride (P+R)',
      type: 'Przesiadkowy P+R',
      totalSpots: 180,
      freeSpots: 115,
      hourlyRate: 'Bezpłatny z biletem MZK',
      residentRate: 'Bezpłatny',
      isGuarded: true,
      hasEvCharging: true,
      distance: '5.8 km stąd',
      occupancy: 36,
    },
  ];

  const [selectedLot, setSelectedLot] = useState(parkingLots[0]);

  // Filter lots
  const filteredLots = parkingLots.filter((lot) => {
    const matchesZone = selectedZone === 'all' || lot.zone === selectedZone;
    const matchesQuery =
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesQuery;
  });

  const totalFreeSpots = parkingLots.reduce((acc, l) => acc + l.freeSpots, 0);

  const handleStartNavigation = (lot) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lot.coords[1]},${lot.coords[0]}`;
    window.open(url, '_blank');
  };

  const handlePayParking = (e) => {
    e.preventDefault();
    setIsPayModalOpen(false);
    setPaySuccessToast(`Opłacono bilet parkingowy SPP dla ${plateNumber} na czas ${parkingDuration}!`);
    setTimeout(() => {
      setPaySuccessToast(null);
    }, 4000);
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      {/* Toast */}
      {paySuccessToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-fadeIn">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20">check_circle</span>
          <span>{paySuccessToast}</span>
        </div>
      )}

      {/* Title & Real-time Indicator Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1 pb-1">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-secondary text-xs font-medium mb-1">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-16 text-primary">local_parking</span>
            <span>Strefa Płatnego Parkowania Toruń (SPP)</span>
            <span className="w-1 h-1 rounded-full bg-secondary/50"></span>
            <span>Dane sensorów na żywo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Parkowanie i Wolne Miejsca
          </h1>
          <p className="text-secondary text-body-sm mt-0.5">
            Interaktywna mapa stref SPP, obłożenie parkingów w czasie rzeczywistym i szybka płatność za postój.
          </p>
        </div>

        {/* Global Summary Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-22">directions_car</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-on-surface">{totalFreeSpots} wolnych miejsc</span>
            </div>
            <span className="text-fs-11 text-secondary">
              Płatne: Pn-Pt 8:00 - 18:00 • Sob 8:00 - 14:00
            </span>
          </div>
        </div>
      </div>

      {/* Traffic notice regarding Most Piłsudskiego */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-20">warning</span>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-amber-950 dark:text-amber-200 block truncate">
              Komunikat drogowy: Most im. J. Piłsudskiego (prace serwisowe od 21:00)
            </span>
            <span className="text-fs-11 text-amber-800/90 dark:text-amber-300/90 block truncate">
              Zalecany dojazd do Strefy A przez Most gen. Elżbiety Zawackiej (Wschodni).
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Zone Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-1 bg-surface-container rounded-2xl">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedZone === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Wszystkie ({parkingLots.length})
          </button>
          <button
            onClick={() => setSelectedZone('strefa-a')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedZone === 'strefa-a'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Strefa A (Śródmiejska)
          </button>
          <button
            onClick={() => setSelectedZone('strefa-b')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedZone === 'strefa-b'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Strefa B (Obrzeża)
          </button>
          <button
            onClick={() => setSelectedZone('pr')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedZone === 'pr'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Park &amp; Ride (P+R)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-18">search</span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-surface-container-lowest border border-outline-variant/60 text-on-surface placeholder:text-secondary rounded-xl text-xs font-medium shadow-xs outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Szukaj parkingu, ulicy..."
            type="text"
          />
        </div>
      </div>

      {/* ── Main Mapcn Layout: Map & Interactive Parking Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* Left: Mapcn Interactive Map (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="rounded-2xl border border-outline-variant/60 shadow-card overflow-hidden bg-surface-container-lowest">
            <Map
              center={selectedLot ? selectedLot.coords : [18.6048, 53.0103]}
              zoom={14.8}
              theme={isDark ? 'dark' : 'light'}
              className="w-full h-[450px] sm:h-[540px] relative"
            >
              <MapControls
                position="top-right"
                showZoom
                showCompass
                showLocate
                showFullscreen
              />

              {filteredLots.map((lot) => {
                const isSelected = selectedLot?.id === lot.id;
                let colorClass = 'bg-emerald-600 text-white border-emerald-400';
                if (lot.freeSpots <= 10) {
                  colorClass = 'bg-rose-600 text-white border-rose-400';
                } else if (lot.freeSpots <= 30) {
                  colorClass = 'bg-amber-600 text-white border-amber-400';
                }

                return (
                  <MapMarker
                    key={lot.id}
                    longitude={lot.coords[0]}
                    latitude={lot.coords[1]}
                    onClick={() => setSelectedLot(lot)}
                  >
                    <MarkerContent>
                      <div className="group cursor-pointer select-none transition-transform duration-200">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border-2 text-xs font-bold transition-all ${colorClass} ${
                              isSelected
                                ? 'scale-110 ring-4 ring-black/20'
                                : 'hover:scale-105'
                            }`}
                          >
                            <span aria-hidden="true" className="material-symbols-outlined text-fs-14">local_parking</span>
                            <span>{lot.freeSpots} wolnych</span>
                          </div>
                          <div className={`w-2 h-2 rotate-45 -mt-1 ${colorClass.split(' ')[0]}`} />
                        </div>
                      </div>
                    </MarkerContent>
                    <MarkerPopup>
                      <div className="p-1 space-y-1">
                        <p className="font-bold text-xs text-on-surface leading-tight">{lot.name}</p>
                        <p className="text-fs-11 text-secondary">{lot.address}</p>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/60">
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {lot.freeSpots} / {lot.totalSpots} wolnych
                          </span>
                          <span className="font-bold text-primary">{lot.hourlyRate}</span>
                        </div>
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                );
              })}
            </Map>
          </div>

          {/* Map Legend & Tariffs hint */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs text-secondary">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-on-surface">Legenda obłożenia:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Dużo wolnych (&gt;30)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Średnio (11-30)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Prawie pełny (&lt;10)</span>
              </span>
            </div>
            <div className="text-fs-11 font-medium">
              {isGuest ? 'Strefa A: 5 zł/h • Strefa B: 3 zł/h' : 'Strefa A: 5 zł/h • Strefa B: 3 zł/h • Karta Torunianina: -30%'}
            </div>
          </div>
        </div>

        {/* Right: Selected Parking Inspector & Quick List (4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col space-y-5">
          {selectedLot ? (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 flex flex-col space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-fs-11 font-bold uppercase tracking-wider inline-block">
                    {selectedLot.zoneName}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-on-surface mt-1.5 leading-snug">
                    {selectedLot.name}
                  </h3>
                  <p className="text-secondary text-xs mt-0.5">{selectedLot.address}</p>
                </div>
              </div>

              {/* Free spots counter card */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary font-medium">Dostępność miejsc:</span>
                  <span className="text-sm font-bold text-on-surface">
                    <strong className="text-lg text-emerald-600 dark:text-emerald-400">{selectedLot.freeSpots}</strong> / {selectedLot.totalSpots} wolnych
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedLot.freeSpots <= 10
                        ? 'bg-rose-500'
                        : selectedLot.freeSpots <= 30
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedLot.occupancy}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-fs-11 text-secondary">
                  <span>Obłożenie: {selectedLot.occupancy}%</span>
                  <span>{selectedLot.distance}</span>
                </div>
              </div>

              {/* Pricing & Features */}
              {!isGuest && (
<div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low flex flex-col">
                  <span className="text-secondary text-fs-11">Cena standardowa:</span>
                  <span className="font-bold text-on-surface text-sm mt-0.5">{selectedLot.hourlyRate}</span>
                </div>
                {!isGuest && (
<div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/30 flex flex-col">
                  <span className="text-primary text-fs-11 font-semibold">Z Kartą Torunianina:</span>
                  <span className="font-bold text-primary text-sm mt-0.5">{selectedLot.residentRate}</span>
                </div>
)}
              </div>
)}

              {/* Amenities */}
              <div className="flex items-center gap-2 text-xs text-secondary">
                {selectedLot.isGuarded && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-14">videocam</span>
                    Monitorowany
                  </span>
                )}
                {selectedLot.hasEvCharging && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-14">ev_station</span>
                    Ładowarka EV
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-2 pt-1">
                <button
                  onClick={() => handleStartNavigation(selectedLot)}
                  className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-fs-18">navigation</span>
                  <span>Prowadź nawigacją do parkingu</span>
                </button>
                {!isGuest && (
<button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-fs-18">payments</span>
                  <span>Opłać bilet parkingowy SPP</span>
                </button>
)}
              </div>
            </div>
          ) : null}

          {/* List of Other Lots */}
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-4 flex flex-col space-y-3">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Pozostałe parkingi w Toruniu ({filteredLots.length})
            </span>
            <div className="flex flex-col space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredLots.map((lot) => {
                const isSelected = selectedLot?.id === lot.id;
                return (
                  <button
                    key={lot.id}
                    onClick={() => setSelectedLot(lot)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-surface-container border-outline text-on-surface'
                        : 'bg-surface-container-low border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-on-surface truncate pr-2">
                        {lot.name}
                      </span>
                      <span
                        className={`text-fs-11 font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          lot.freeSpots <= 10
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {lot.freeSpots} wolnych
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-fs-11 text-secondary">
                      <span>{lot.zoneName}</span>
                      <span>{lot.distance}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Quick SPP Ticket Payment */}
      {isPayModalOpen && (
        <div
          className="!m-0 fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={(e) => { if (e.target === e.currentTarget) setIsPayModalOpen(false); }}
        >
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-fs-22">local_parking</span>
                <h3 className="text-base font-bold text-on-surface">Opłata za postój w SPP Toruń</h3>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">close</span>
              </button>
            </div>

            <form onSubmit={handlePayParking} className="flex flex-col space-y-4">
              <div>
                <label className="text-xs text-secondary font-medium block mb-1">Wybrany parking / strefa:</label>
                <div className="p-3 rounded-xl bg-surface-container-low font-semibold text-xs text-on-surface">
                  {selectedLot?.name} ({selectedLot?.zoneName})
                </div>
              </div>

              <div>
                <label className="text-xs text-secondary font-medium block mb-1">Numer rejestracyjny pojazdu:</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm font-bold uppercase tracking-wider text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-secondary font-medium block mb-1">Przewidywany czas postoju:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['30min', '1h', '2h', 'Cały dzień'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setParkingDuration(time)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        parkingDuration === time
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-container-low text-secondary border-transparent hover:border-outline-variant'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-secondary block">Do zapłaty (Karta Torunianina):</span>
                  <span className="font-bold text-primary text-base">
                    {parkingDuration === '30min' ? '1,80 zł' : parkingDuration === '1h' ? '3,50 zł' : parkingDuration === '2h' ? '7,00 zł' : '25,00 zł'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-fs-11">
                  Zniżka -30% aktywna
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">bolt</span>
                <span>Potwierdź i opłać (BLIK / Portfel)</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
