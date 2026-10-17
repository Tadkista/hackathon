// Identity records returned by the verification providers (bank / mObywatel) or entered by a guardian.
export const IDENTITIES = {
  adult: {
    firstName: 'Aleksandra', vocative: 'Aleksandro', lastName: 'Wiśniewska',
    pesel: '92031501249', birthDate: '1992-03-15', address: 'ul. Szeroka 12/4, 87-100 Toruń',
  },
  senior: {
    firstName: 'Zofia', vocative: 'Zofio', lastName: 'Nowicka',
    pesel: '51072201262', birthDate: '1951-07-22', address: 'ul. Mickiewicza 8/15, 87-100 Toruń',
  },
  child: {
    firstName: 'Jan', vocative: 'Janku', lastName: 'Wiśniewski',
    pesel: '14290301257', birthDate: '2014-09-03', address: 'ul. Szeroka 12/4, 87-100 Toruń',
  },
};

export const GUEST_USER = { firstName: 'Gość', vocative: 'Gościu', lastName: '', pesel: '', birthDate: '', address: '' };

export const ROLES = [
  { id: 'child', label: 'Dziecko', icon: 'child_care', desc: 'Konto wymaga zatwierdzenia przez rodzica lub opiekuna' },
  { id: 'adult', label: 'Dorosły', icon: 'person', desc: 'Pełny dostęp do usług miejskich' },
  { id: 'senior', label: 'Senior', icon: 'elderly', desc: 'Pełny dostęp, większa czcionka i uproszczony widok' },
  { id: 'guest', label: 'Gość', icon: 'travel_explore', desc: 'Przeglądanie miasta bez logowania' },
];
export const ROLE_LABEL = { child: 'Konto dziecka', adult: 'Mieszkaniec', senior: 'Senior', guest: 'Gość' };

export const PROVIDERS = [
  { id: 'mobywatel', kind: 'mobywatel', name: 'mObywatel', domain: 'login.mobywatel.gov.pl', color: '#d4213d', short: 'm', logo: '/logos/mobywatel.jpg' },
  { id: 'pko', kind: 'bank', name: 'PKO Bank Polski', domain: 'moje.ipko.pl', color: '#003574', short: 'PKO', logo: '/logos/pko.svg' },
  { id: 'mbank', kind: 'bank', name: 'mBank', domain: 'online.mbank.pl', color: '#e2001a', short: 'mBank', logo: '/logos/mbank.svg', wide: true },
  { id: 'ing', kind: 'bank', name: 'ING Bank Śląski', domain: 'login.ingbank.pl', color: '#ff6200', short: 'ING', logo: '/logos/ing.png' },
  { id: 'santander', kind: 'bank', name: 'Santander Bank Polska', domain: 'logowanie.santander.pl', color: '#ec0000', short: 'Santander', logo: '/logos/santander.svg', wide: true },
  { id: 'millennium', kind: 'bank', name: 'Bank Millennium', domain: 'www.bankmillennium.pl', color: '#a31b6e', short: 'Millennium', logo: '/logos/millennium.svg', wide: true },
  { id: 'ca', kind: 'bank', name: 'Credit Agricole', domain: 'logowanie.credit-agricole.pl', color: '#00875a', short: 'CA', logo: '/logos/ca.svg' },
];

export function peselValid(p) {
  if (!/^\d{11}$/.test(p)) return false;
  const w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const s = w.reduce((a, wi, i) => a + wi * Number(p[i]), 0);
  return (10 - (s % 10)) % 10 === Number(p[10]);
}

// Date of birth encoded in a PESEL (YYYY-MM-DD)
export function peselBirthDate(p) {
  if (!/^\d{11}$/.test(p)) return '';
  let y = Number(p.slice(0, 2));
  let m = Number(p.slice(2, 4));
  const d = p.slice(4, 6);
  const c = Math.floor(m / 20);
  const base = { 0: 1900, 1: 2000, 2: 2100, 3: 2200, 4: 1800 }[c] ?? 1900;
  y += base;
  m = m % 20;
  return `${y}-${String(m).padStart(2, '0')}-${d}`;
}

export function ageFrom(iso, now = new Date()) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  let a = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a -= 1;
  return a;
}
