// Navigation per role. Profile is always reachable.
export const NAV = {
  home: { label: 'Strona główna', short: 'Główna', icon: 'home' },
  parking: { label: 'Parkowanie i Mapa', short: 'Parking', icon: 'local_parking' },
  tickets: { label: 'Bilety i Karta', short: 'Bilety', icon: 'confirmation_number' },
  timetable: { label: 'Rozkład jazdy', short: 'Rozkład', icon: 'departure_board' },
  fuel: { label: 'Ceny paliw', short: 'Paliwa', icon: 'local_gas_station' },
  disruptions: { label: 'Utrudnienia drogowe', short: 'Utrudnienia', icon: 'construction' },
  events: { label: 'Wydarzenia', short: 'Wydarzenia', icon: 'event' },
  guides: { label: 'Audioprzewodniki i gry', short: 'Przewodniki', icon: 'headphones' },
  votes: { label: 'Budżet i Inwestycje', short: 'Budżet', icon: 'how_to_vote' },
  aiguide: { label: 'AI Przewodnik', short: 'AI Przewodnik', icon: 'auto_awesome' },
  profile: { label: 'Profil', short: 'Profil', icon: 'person' },
};

const RESIDENT = ['home', 'parking', 'tickets', 'timetable', 'fuel', 'disruptions', 'events', 'guides', 'aiguide', 'votes'];
// Simplified set for seniors: only the most essential, least complex functions.
const SENIOR = ['home', 'tickets', 'timetable', 'events', 'guides', 'votes'];

export const ROLE_NAV = {
  adult: RESIDENT,
  senior: SENIOR,
  child: ['tickets', 'timetable', 'events'],
  guest: ['home', 'parking', 'timetable', 'fuel', 'disruptions', 'events', 'aiguide', 'guides'],
};

// the few items kept in the mobile bottom bar (the rest go to the "Więcej" sheet)
export const ROLE_MOBILE_PRIMARY = {
  adult: ['home', 'parking', 'tickets'],
  senior: ['home', 'tickets', 'timetable'],
  child: ['tickets', 'timetable', 'events'],
  guest: ['home', 'parking', 'events'],
};

export const ROLE_DEFAULT_TAB = { adult: 'home', senior: 'home', child: 'tickets', guest: 'home' };

export const navFor = (role) => (ROLE_NAV[role] || ROLE_NAV.guest).map((id) => ({ id, ...NAV[id] }));
export const allowedTabsFor = (role) => [...(ROLE_NAV[role] || ROLE_NAV.guest), 'profile'];
