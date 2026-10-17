// Toruń city data used by the new sections. Dates are generated relative to "today".
const DAY = 86400000;
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };

export const dateIn = (offset, time = '00:00') => {
  const d = new Date(startOfToday().getTime() + offset * DAY);
  const [h, m] = time.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
};
export const fmtDay = (d) => d.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
export const fmtDayLong = (d) => d.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
export const fmtTime = (d) => d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
export const fmtRange = (a, b) => `${a.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })} – ${b.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}`;

export const TORUN_CENTER = [18.6048, 53.0103];

/* ───────────────────────── Fuel ───────────────────────── */
export const FUEL_TYPES = [
  { id: 'pb95', label: 'Benzyna 95' },
  { id: 'pb98', label: 'Benzyna 98' },
  { id: 'on', label: 'Diesel' },
  { id: 'lpg', label: 'LPG' },
];

export const STATIONS = [
  { id: 's1', brand: 'Orlen', address: 'ul. Szosa Chełmińska 154', coords: [18.5586, 53.0312], updated: 4, open24: true, amenities: ['myjnia', 'kawa', 'ładowarka EV'], prices: { pb95: 5.89, pb98: 6.49, on: 5.99, lpg: 2.84 } },
  { id: 's2', brand: 'Shell', address: 'ul. Bydgoska 62', coords: [18.5702, 53.0204], updated: 9, open24: false, amenities: ['kawa', 'sklep'], prices: { pb95: 6.12, pb98: 6.74, on: 6.19, lpg: 0 } },
  { id: 's3', brand: 'BP', address: 'ul. Szosa Lubicka 3', coords: [18.6531, 53.0046], updated: 2, open24: true, amenities: ['myjnia', 'kawa'], prices: { pb95: 6.04, pb98: 6.62, on: 6.09, lpg: 2.99 } },
  { id: 's4', brand: 'Circle K', address: 'ul. Olimpijska 40', coords: [18.6812, 53.0321], updated: 7, open24: true, amenities: ['kawa', 'sklep', 'ładowarka EV'], prices: { pb95: 6.07, pb98: 6.69, on: 6.14, lpg: 2.94 } },
  { id: 's5', brand: 'Orlen', address: 'ul. Włocławska 118', coords: [18.6223, 52.9902], updated: 5, open24: false, amenities: ['myjnia'], prices: { pb95: 5.95, pb98: 6.55, on: 6.02, lpg: 2.79 } },
  { id: 's6', brand: 'Moya', address: 'ul. Gagarina 21', coords: [18.6342, 53.0152], updated: 12, open24: false, amenities: ['sklep'], prices: { pb95: 5.84, pb98: 0, on: 5.94, lpg: 2.74 } },
  { id: 's7', brand: 'Auchan', address: 'ul. Przy Skarpie 1', coords: [18.6921, 53.0418], updated: 3, open24: false, amenities: ['myjnia', 'sklep'], prices: { pb95: 5.79, pb98: 0, on: 5.89, lpg: 2.69 } },
  { id: 's8', brand: 'Orlen', address: 'ul. Warszawska 15', coords: [18.6894, 53.0001], updated: 6, open24: true, amenities: ['myjnia', 'kawa', 'sklep'], prices: { pb95: 5.99, pb98: 6.59, on: 6.04, lpg: 2.89 } },
  { id: 's9', brand: 'Shell', address: 'ul. Grudziądzka 160', coords: [18.5906, 53.0398], updated: 11, open24: true, amenities: ['kawa', 'ładowarka EV'], prices: { pb95: 6.19, pb98: 6.79, on: 6.24, lpg: 0 } },
];

/* ───────────────────────── Road disruptions ───────────────────────── */
export const DISRUPTION_KINDS = {
  roadwork: { label: 'Remont', icon: 'construction', color: '#d97706' },
  closure: { label: 'Zamknięcie', icon: 'block', color: '#dc2626' },
  jam: { label: 'Korek', icon: 'traffic', color: '#ea580c' },
  planned: { label: 'Planowany remont', icon: 'event_upcoming', color: '#2563eb' },
};

export const DISRUPTIONS = [
  { id: 'd1', kind: 'jam', severity: 'high', title: 'Korek na Moście im. J. Piłsudskiego', street: 'Most Piłsudskiego, kier. Podgórz', desc: 'Zwężenie do jednego pasa – średnie opóźnienie 14 min.', start: dateIn(0, '06:30'), end: dateIn(0, '23:00'), coords: [18.6076, 53.0016], line: [[18.6046, 53.0037], [18.6076, 53.0016], [18.6112, 52.9994]], detour: 'Most gen. Elżbiety Zawackiej (Wschodni)' },
  { id: 'd2', kind: 'roadwork', severity: 'medium', title: 'Wymiana nawierzchni – ul. Szosa Chełmińska', street: 'ul. Szosa Chełmińska (od Wschodniej do Kościuszki)', desc: 'Ruch wahadłowy sterowany sygnalizacją. Autobusy linii 22 i 27 jadą bez zmian trasy.', start: dateIn(-9), end: dateIn(11), coords: [18.5651, 53.0278], line: [[18.5586, 53.0312], [18.5651, 53.0278], [18.5712, 53.0245]], detour: 'ul. Bydgoska – Przybyszewskiego' },
  { id: 'd3', kind: 'closure', severity: 'high', title: 'Zamknięcie ul. Mostowej (Stare Miasto)', street: 'ul. Mostowa (Rynek Nowomiejski – Bulwar)', desc: 'Roboty wodociągowe. Dojazd dla mieszkańców i dostaw w godz. 6:00–9:00.', start: dateIn(-3), end: dateIn(6), coords: [18.6081, 53.0089], line: [[18.6094, 53.0108], [18.6081, 53.0089], [18.6069, 53.0072]], detour: 'ul. Wola Zamkowa – Szeroka' },
  { id: 'd4', kind: 'roadwork', severity: 'low', title: 'Budowa ścieżki rowerowej – al. Solidarności', street: 'al. Solidarności', desc: 'Zajęty prawy pas. Możliwe chwilowe utrudnienia przy skrzyżowaniach.', start: dateIn(-20), end: dateIn(28), coords: [18.6402, 53.0202], line: [[18.6335, 53.0188], [18.6402, 53.0202], [18.6478, 53.0221]], detour: 'Nie dotyczy' },
  { id: 'd5', kind: 'jam', severity: 'medium', title: 'Zatłoczone skrzyżowanie Gagarina / Szosa Lubicka', street: 'ul. Gagarina – Szosa Lubicka', desc: 'Godziny szczytu 15:00–18:00 – wydłużony czas przejazdu o 8 min.', start: dateIn(0, '15:00'), end: dateIn(0, '18:30'), coords: [18.6411, 53.0121], detour: 'ul. Lubicka – Bema' },
  { id: 'd6', kind: 'roadwork', severity: 'medium', title: 'Przebudowa torowiska – ul. Mickiewicza', street: 'ul. Mickiewicza (Plac Rapackiego – Wały)', desc: 'Tramwaje zastąpione komunikacją autobusową (linia ZA1).', start: dateIn(-5), end: dateIn(16), coords: [18.5987, 53.0141], line: [[18.5953, 53.0152], [18.5987, 53.0141], [18.6028, 53.0126]], detour: 'Linia zastępcza ZA1' },
  { id: 'd7', kind: 'planned', severity: 'medium', title: 'Remont ul. Bydgoskiej – etap II', street: 'ul. Bydgoska (Szosa Chełmińska – Ligi Polskiej)', desc: 'Planowane zamknięcie jednej jezdni. Zmiana organizacji ruchu i tras autobusów 1, 10, 22.', start: dateIn(9), end: dateIn(41), coords: [18.5712, 53.0215], line: [[18.5662, 53.0236], [18.5712, 53.0215], [18.5768, 53.0189]], detour: 'ul. Przybyszewskiego – Szosa Okrężna' },
  { id: 'd8', kind: 'planned', severity: 'low', title: 'Modernizacja skrzyżowania Szosa Lubicka / Olimpijska', street: 'rondo Toruńskich Olimpijczyków', desc: 'Prace nocne (22:00–5:00), ruch wahadłowy.', start: dateIn(14), end: dateIn(26), coords: [18.6612, 53.0162], detour: 'ul. Skarpa' },
  { id: 'd9', kind: 'planned', severity: 'high', title: 'Zamknięcie Mostu Piłsudskiego (remont dylatacji)', street: 'Most im. J. Piłsudskiego', desc: 'Całkowite zamknięcie w weekend. Komunikacja zastępcza i objazd przez Most Zawackiej.', start: dateIn(20), end: dateIn(22), coords: [18.6076, 53.0016], line: [[18.6046, 53.0037], [18.6076, 53.0016], [18.6112, 52.9994]], detour: 'Most gen. Elżbiety Zawackiej' },
];

/* ───────────────────────── Events ───────────────────────── */
export const EVENT_CATEGORIES = [
  { id: 'koncert', label: 'Koncerty', icon: 'music_note' },
  { id: 'warsztaty', label: 'Warsztaty', icon: 'handyman' },
  { id: 'prelekcja', label: 'Prelekcje', icon: 'record_voice_over' },
  { id: 'plener', label: 'Plenery', icon: 'park' },
  { id: 'impreza', label: 'Imprezy', icon: 'celebration' },
  { id: 'wiec', label: 'Wiece i spotkania', icon: 'groups' },
];

export const EVENTS = [
  { id: 'e1', title: 'Koncert symfoniczny: Dvořák – IX Symfonia', category: 'koncert', day: 2, time: '19:00', place: 'CKK Jordanki', address: 'ul. Uniwersytecka 2', price: 'od 45 zł', kids: false, desc: 'Toruńska Orkiestra Symfoniczna pod batutą Marcina Nałęcza-Niesiołowskiego.', organizer: 'Toruńska Orkiestra Symfoniczna' },
  { id: 'e2', title: 'Warsztaty piernikarskie dla dzieci', category: 'warsztaty', day: 1, time: '11:00', place: 'Żywe Muzeum Piernika', address: 'ul. Rabiańska 9', price: '35 zł', kids: true, ages: '6–12 lat', desc: 'Dzieci samodzielnie wałkują, wycinają i zdobią toruńskie pierniki w historycznych formach.', organizer: 'Żywe Muzeum Piernika' },
  { id: 'e3', title: 'Seans w Planetarium: Podróż po Układzie Słonecznym', category: 'warsztaty', day: 0, time: '16:30', place: 'Planetarium w Toruniu', address: 'ul. Franciszkańska 15/21', price: '18 zł', kids: true, ages: '5+', desc: 'Pokaz w kopule 360° z lekcją o planetach, dla młodych odkrywców.', organizer: 'Planetarium w Toruniu' },
  { id: 'e4', title: 'Spektakl „Kot w butach”', category: 'impreza', day: 3, time: '10:00', place: 'Teatr Baj Pomorski', address: 'ul. Piekary 15', price: '25 zł', kids: true, ages: '4–9 lat', desc: 'Klasyczna baśń w wersji lalkowej z muzyką na żywo.', organizer: 'Teatr Baj Pomorski' },
  { id: 'e5', title: 'Wykład: Kopernik i jego Toruń', category: 'prelekcja', day: 4, time: '18:00', place: 'Dwór Artusa', address: 'Rynek Staromiejski 6', price: 'bezpłatne', kids: false, desc: 'Prelekcja dr. Piotra Olszewskiego o toruńskich śladach astronoma. Wstęp wolny.', organizer: 'Muzeum Okręgowe w Toruniu' },
  { id: 'e6', title: 'Festiwal Światła – spacer iluminacji', category: 'plener', day: 5, time: '19:30', place: 'Stare Miasto', address: 'trasa: Rynek Staromiejski – Bulwar', price: 'bezpłatne', kids: false, desc: 'Instalacje świetlne i mappingi na zabytkowych budynkach.', organizer: 'Urząd Miasta Torunia' },
  { id: 'e7', title: 'Piknik rodzinny na Bulwarze Filadelfijskim', category: 'plener', day: 6, time: '12:00', place: 'Bulwar Filadelfijski', address: 'Bulwar Filadelfijski', price: 'bezpłatne', kids: true, ages: 'cała rodzina', desc: 'Dmuchańce, gry planszowe, strefa malowania i food trucki.', organizer: 'Toruńskie Centrum Rodziny' },
  { id: 'e8', title: 'Koncert w Klubie Od Nowa: Wieczór akustyczny', category: 'koncert', day: 3, time: '20:00', place: 'Klub Od Nowa', address: 'ul. Gagarina 37', price: '40 zł', kids: false, desc: 'Trzy zespoły, jedna scena. Bilety dostępne również przy wejściu.', organizer: 'Od Nowa' },
  { id: 'e9', title: 'Warsztaty robotyki w Młynie Wiedzy', category: 'warsztaty', day: 2, time: '15:00', place: 'Centrum Nowoczesności Młyn Wiedzy', address: 'ul. Przedzamcze 6', price: '20 zł', kids: true, ages: '8–14 lat', desc: 'Budowa i programowanie prostych robotów z klocków.', organizer: 'Młyn Wiedzy' },
  { id: 'e10', title: 'Spotkanie konsultacyjne: Budżet Obywatelski', category: 'wiec', day: 7, time: '17:30', place: 'Ratusz Staromiejski', address: 'Rynek Staromiejski 1', price: 'bezpłatne', kids: false, desc: 'Otwarte spotkanie z mieszkańcami – prezentacja projektów i dyskusja.', organizer: 'Urząd Miasta Torunia' },
  { id: 'e11', title: 'Jarmark Torunianina', category: 'impreza', day: 8, time: '10:00', place: 'Rynek Nowomiejski', address: 'Rynek Nowomiejski', price: 'bezpłatne', kids: false, desc: 'Rękodzieło, lokalne jedzenie i muzyka regionalna.', organizer: 'Toruńskie Stowarzyszenie Rękodzielników' },
  { id: 'e12', title: 'Plener malarski „Toruń z perspektywy Wisły”', category: 'plener', day: 9, time: '09:30', place: 'Błonia Nadwiślańskie', address: 'Błonia Nadwiślańskie', price: 'bezpłatne', kids: false, desc: 'Otwarty plener dla amatorów i profesjonalistów. Materiały we własnym zakresie.', organizer: 'Toruńskie Towarzystwo Fotograficzne' },
  { id: 'e13', title: 'Zajęcia ruchowe „Mali odkrywcy” w parku', category: 'plener', day: 1, time: '10:30', place: 'Park Miejski', address: 'ul. Szosa Chełmińska', price: 'bezpłatne', kids: true, ages: '3–7 lat', desc: 'Zabawy terenowe z animatorem i poszukiwanie „skarbów” w parku.', organizer: 'Toruńskie Centrum Rodziny' },
  { id: 'e14', title: 'Prelekcja: Cyfrowe bezpieczeństwo seniorów', category: 'prelekcja', day: 5, time: '12:00', place: 'Biblioteka Miejska', address: 'ul. Wielkie Garbary 15', price: 'bezpłatne', kids: false, desc: 'Jak chronić konto bankowe i dane osobowe – praktyczne porady.', organizer: 'Toruński Uniwersytet Trzeciego Wieku' },
  { id: 'e15', title: 'Koncert w ramach cyklu „Muzyka w Katedrze”', category: 'koncert', day: 10, time: '18:30', place: 'Katedra św. Janów', address: 'ul. Żeglarska 16', price: 'bezpłatne', kids: false, desc: 'Recital organowy w gotyckiej katedrze.', organizer: 'Parafia Katedralna' },
  { id: 'e16', title: 'Bajkowy dzień w Muzeum Podróżników', category: 'warsztaty', day: 4, time: '11:30', place: 'Muzeum Podróżników', address: 'Rynek Staromiejski 1', price: '15 zł', kids: true, ages: '5–10 lat', desc: 'Podróż dookoła świata z mapą, kompasem i paszportem odkrywcy.', organizer: 'Muzeum Okręgowe w Toruniu' },
];
export const eventDate = (e) => dateIn(e.day, e.time);

/* ───────────────────────── Audio guides & city games ───────────────────────── */
export const GUIDES = [
  { id: 'g1', type: 'audio', title: 'Stare Miasto – szlak gotyku', price: 14.9, duration: '75 min', stops: 18, langs: ['PL'], rating: 4.8, reviews: 412, desc: 'Od Rynku Staromiejskiego, przez Krzywą Wieżę, po Katedrę św. Janów. Narracja z anegdotami i legendami.', icon: 'castle', audio: '/audio/demo.wav' },
  { id: 'g2', type: 'audio', title: 'Śladami Kopernika', price: 12.9, duration: '55 min', stops: 12, langs: ['PL', 'EN'], rating: 4.7, reviews: 268, desc: 'Dom Kopernika, Ratusz, Kościół św. Janów i miejsca związane z życiem astronoma.', icon: 'public' },
  { id: 'g3', type: 'audio', title: 'Toruń podziemny – legendy i lochy', price: 9.9, duration: '40 min', stops: 9, langs: ['PL', 'EN'], rating: 4.6, reviews: 187, desc: 'Mroczne opowieści o podziemiach, lochach i miejskich widmach.', icon: 'nightlight' },
  { id: 'g4', type: 'audio', title: 'Bulwar i Wisła – spacer widokowy', price: 7.9, duration: '35 min', stops: 8, langs: ['PL', 'EN', 'DE'], rating: 4.5, reviews: 96, desc: 'Panorama Starówki z drugiej strony Wisły, historia mostów i portu.', icon: 'sailing' },
  { id: 'g5', type: 'game', title: 'Tajemnica Piernikarza', price: 24.9, duration: '90 min', stops: 14, ages: 'od 8 lat', difficulty: 'średnia', rating: 4.9, reviews: 530, desc: 'Gra miejska dla rodzin: rozwiązuj zagadki i odnajdź zaginioną recepturę toruńskiego piernika.', icon: 'cookie', family: true },
  { id: 'g6', type: 'game', title: 'Quest: Zegar Kopernika', price: 29.9, duration: '120 min', stops: 16, ages: 'od 12 lat', difficulty: 'trudna', rating: 4.7, reviews: 214, desc: 'Gra terenowa dla dorosłych. Szyfry, mapy i ukryte wskazówki w całym Starym Mieście.', icon: 'travel_explore' },
  { id: 'g7', type: 'game', title: 'Mali odkrywcy Starówki', price: 15.0, duration: '60 min', stops: 10, ages: '5–9 lat', difficulty: 'łatwa', rating: 4.8, reviews: 341, desc: 'Prosta gra z obrazkami i zadaniami dla najmłodszych, z rodzicem lub opiekunem.', icon: 'child_care', family: true },
];

/* ───────────────────────── Timetable ───────────────────────── */
export const MZK_LINES = [
  { id: '1', type: 'tram', color: '#b91c1c' }, { id: '2', type: 'tram', color: '#b91c1c' }, { id: '3', type: 'tram', color: '#b91c1c' }, { id: '4', type: 'tram', color: '#b91c1c' },
  { id: '10', type: 'bus', color: '#1d4ed8' }, { id: '14', type: 'bus', color: '#1d4ed8' }, { id: '22', type: 'bus', color: '#1d4ed8' }, { id: '25', type: 'bus', color: '#1d4ed8' }, { id: '27', type: 'bus', color: '#1d4ed8' }, { id: 'N1', type: 'bus', color: '#334155' },
];

// at each stop: line, headsign, first departure minute-of-hour offset and frequency in minutes
export const STOPS = [
  { id: 'rapackiego', name: 'Plac Rapackiego', zone: 'I', deps: [{ line: '1', to: 'Rubinkowo', off: 4, f: 10 }, { line: '2', to: 'Motoarena', off: 7, f: 12 }, { line: '3', to: 'Wrzosy', off: 2, f: 15 }, { line: '10', to: 'Szosa Lubicka', off: 9, f: 20 }, { line: 'N1', to: 'Dworzec Główny', off: 20, f: 60, night: true }] },
  { id: 'rynek', name: 'Rynek Staromiejski', zone: 'I', deps: [{ line: '22', to: 'Bielany', off: 3, f: 15 }, { line: '25', to: 'Jordanki', off: 8, f: 20 }, { line: '14', to: 'Rubinkowo – Rynek', off: 11, f: 20 }] },
  { id: 'glowny', name: 'Toruń Główny (dworzec)', zone: 'I', deps: [{ line: '1', to: 'Rubinkowo', off: 6, f: 10 }, { line: '4', to: 'Plac Rapackiego', off: 12, f: 20 }, { line: '27', to: 'Przysiek', off: 5, f: 30 }, { line: 'N1', to: 'Plac Rapackiego', off: 40, f: 60, night: true }] },
  { id: 'jordanki', name: 'Jordanki / CKK', zone: 'I', deps: [{ line: '25', to: 'Plac Rapackiego', off: 4, f: 20 }, { line: '10', to: 'Rubinkowo', off: 13, f: 20 }, { line: '2', to: 'Motoarena', off: 9, f: 12 }] },
  { id: 'olimpijska', name: 'Olimpijska (pętla)', zone: 'II', deps: [{ line: '1', to: 'Plac Rapackiego', off: 1, f: 10 }, { line: '14', to: 'Rynek Staromiejski', off: 15, f: 20 }, { line: '27', to: 'Dworzec Główny', off: 22, f: 30 }] },
  { id: 'bielany', name: 'Bielany – Rynek', zone: 'II', deps: [{ line: '22', to: 'Plac Rapackiego', off: 6, f: 15 }, { line: '3', to: 'Centrum', off: 10, f: 15 }] },
];

export const TRAIN_STATIONS = [
  { id: 'glowny', name: 'Toruń Główny' },
  { id: 'miasto', name: 'Toruń Miasto' },
  { id: 'wschodni', name: 'Toruń Wschodni' },
];

// daily departures per station: time, destination, operator, platform, delay minutes
export const TRAINS = {
  glowny: [
    ['05:12', 'Warszawa Wschodnia', 'IC Przemyślanin', '2/3', 0], ['06:04', 'Bydgoszcz Główna', 'Polregio', '4/5', 0], ['06:41', 'Gdynia Główna', 'IC Wawel', '1/2', 4],
    ['07:33', 'Poznań Główny', 'Polregio', '3/4', 0], ['08:18', 'Warszawa Zachodnia', 'IC Kopernik', '2/3', 0], ['09:50', 'Włocławek', 'Polregio', '4/5', 0],
    ['11:07', 'Gdynia Główna', 'IC Kopernik', '1/2', 0], ['12:22', 'Kutno', 'Polregio', '3/4', 9], ['13:36', 'Warszawa Wschodnia', 'IC Wawel', '2/3', 0],
    ['14:48', 'Bydgoszcz Główna', 'Polregio', '4/5', 0], ['16:15', 'Poznań Główny', 'IC Poznaniak', '3/4', 0], ['17:29', 'Gdynia Główna', 'IC Pomorzanin', '1/2', 0],
    ['18:44', 'Warszawa Zachodnia', 'IC Kopernik', '2/3', 6], ['20:03', 'Bydgoszcz Główna', 'Polregio', '4/5', 0], ['21:27', 'Włocławek', 'Polregio', '3/4', 0], ['22:55', 'Gdynia Główna', 'IC Nocny', '1/2', 0],
  ],
  miasto: [
    ['05:44', 'Bydgoszcz Główna', 'Polregio', '1', 0], ['07:16', 'Kutno', 'Polregio', '2', 0], ['09:02', 'Bydgoszcz Główna', 'Polregio', '1', 0], ['12:40', 'Włocławek', 'Polregio', '2', 3],
    ['15:21', 'Bydgoszcz Główna', 'Polregio', '1', 0], ['17:08', 'Kutno', 'Polregio', '2', 0], ['19:36', 'Bydgoszcz Główna', 'Polregio', '1', 0],
  ],
  wschodni: [
    ['06:20', 'Toruń Główny', 'Polregio', '1', 0], ['08:05', 'Toruń Główny', 'Polregio', '2', 0], ['10:30', 'Toruń Główny', 'Polregio', '1', 0], ['13:15', 'Toruń Główny', 'Polregio', '2', 0],
    ['16:40', 'Toruń Główny', 'Polregio', '1', 5], ['19:25', 'Toruń Główny', 'Polregio', '2', 0],
  ],
};

export function nextBusDepartures(stop, now = new Date(), perLine = 3) {
  const out = [];
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const isNight = now.getHours() >= 23 || now.getHours() < 4;
  for (const d of stop.deps) {
    // night lines run only at night, day lines only by day
    if (!!d.night !== isNight) continue;
    let n = 0;
    for (let m = Math.floor(nowMin / 60) * 60 + d.off; n < perLine && m < nowMin + 24 * 60; m += d.f) {
      if (m >= nowMin) {
        out.push({ ...d, inMin: m - nowMin, at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, m) });
        n += 1;
      }
    }
  }
  return out.sort((a, b) => a.inMin - b.inMin);
}

export function nextTrains(stationId, now = new Date(), limit = 8) {
  const list = (TRAINS[stationId] || []).map(([t, to, op, plat, delay]) => {
    const [h, m] = t.split(':').map(Number);
    return { time: t, to, op, plat, delay, h, m };
  });
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const upcoming = list.filter((x) => x.h * 60 + x.m + x.delay >= nowMin);
  const tomorrow = list.filter((x) => x.h * 60 + x.m + x.delay < nowMin).map((x) => ({ ...x, tomorrow: true }));
  return [...upcoming, ...tomorrow].slice(0, limit);
}
