import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { usePrefs } from '../PrefsContext.jsx';
import { ROLE_LABEL } from '../data/identities.js';
import { Avatar, Modal, ModalHeader, Segmented, Toggle, formatDatePl, maskPesel } from './ui.jsx';
import { TwoFactorSetup } from './LoginScreen.jsx';

const HELP_ITEMS = [
  { id: 'tck', icon: 'contact_support', title: 'Toruńskie Centrum Kontaktu (TCK)', desc: 'Infolinia miejska 56 611 83 10 • tck@um.torun.pl', body: 'Telefon: 56 611 83 10\nE-mail: tck@um.torun.pl\nGodziny pracy: pon.–pt. 7:30–17:00\nZgłoszenia awarii przyjmujemy całą dobę.' },
  { id: 'rodo', icon: 'policy', title: 'Regulamin i Ochrona Danych (RODO)', desc: 'Administrator: Prezydent Miasta Torunia', body: 'Administratorem danych osobowych jest Prezydent Miasta Torunia. Dane przetwarzamy w celu świadczenia usług miejskich zgodnie z RODO. Masz prawo wglądu, sprostowania i usunięcia swoich danych.' },
];

function Row({ icon, title, desc, children, onClick, divider = true, stack = false }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <>
      <Tag
        {...(onClick ? { type: 'button', onClick } : {})}
        className={`w-full p-space-md flex ${stack ? 'flex-col items-stretch sm:flex-row sm:items-center' : 'items-center'} justify-between gap-4 text-left ${onClick ? 'hover:bg-surface-container-low transition-colors cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-space-md min-w-0">
          <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-22">{icon}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-title-md text-title-md text-on-surface font-semibold">{title}</span>
            {desc && <span className="font-body-sm text-body-sm text-secondary">{desc}</span>}
          </div>
        </div>
        {children}
      </Tag>
      {divider && <div className="h-px bg-surface-container-high mx-space-md"></div>}
    </>
  );
}

export default function ProfileScreen({ onNavigate }) {
  const { user, role, isGuest, isChild, method, logout } = useAuth();
  const { mode, setMode } = useTheme();
  const { prefs, setPref, resetPrefs } = usePrefs();
  const district = 'Stare Miasto / Mokre'; // wynika z zweryfikowanego adresu, nie można go zmienić
  const [twoFaOpen, setTwoFaOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [helpOpen, setHelpOpen] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [notifications, setNotifications] = useState({ transport: true, alerts: true, civicBudget: true, culture: false });
  const toggleNotification = (key) => setNotifications((p) => ({ ...p, [key]: !p[key] }));

  const clearLocalData = () => {
    try { localStorage.clear(); sessionStorage.clear(); } catch (e) { /* ignore */ }
    window.location.reload();
  };

  const fullName = isGuest ? 'Gość' : `${user.firstName} ${user.lastName}`;
  const sub = isGuest ? 'Przeglądasz miasto bez konta' : isChild ? 'Konto dziecka zatwierdzone przez opiekuna' : 'Obywatel Torunia od 2018 r.';
  const methodLabel = { mobywatel: 'mObywatel', pko: 'PKO Bank Polski', mbank: 'mBank', ing: 'ING Bank Śląski', santander: 'Santander Bank Polska', millennium: 'Bank Millennium', ca: 'Credit Agricole', guardian: 'Zatwierdzenie przez opiekuna', guest: 'Brak logowania' }[method] || '—';

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col pt-1 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">{isGuest ? 'Profil gościa' : 'Profil Mieszkańca'}</h1>
        <p className="text-secondary text-body-sm mt-0.5">
          {isGuest ? 'Dostosuj aplikację do siebie. Zaloguj się, aby korzystać z usług dla mieszkańców.' : 'Zarządzaj tożsamością miejską, ustawieniami konta oraz historią aktywności w Toruniu.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* identity */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/60 p-space-md flex flex-col gap-space-md">
            <div className="flex items-start gap-space-md">
              <Avatar user={user} size={64} />
              <div className="flex flex-col min-w-0 flex-1">
                <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">{fullName}</h2>
                <span className="font-body-sm text-body-sm text-secondary">{sub}</span>
                <span className="mt-1.5 inline-flex w-fit items-center px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-fs-11 font-semibold">{ROLE_LABEL[role]}</span>
              </div>
            </div>

            {!isGuest && (
              <dl className="rounded-xl bg-surface-container-low divide-y divide-outline-variant/60 text-sm">
                {[
                  ['PESEL', maskPesel(user.pesel)],
                  ['Data urodzenia', formatDatePl(user.birthDate)],
                  ['Adres', user.address],
                  ['Zweryfikowano przez', methodLabel],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                    <dt className="text-secondary shrink-0">{k}</dt>
                    <dd className="text-on-surface font-semibold text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {!isGuest && (
              <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs min-w-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-primary-container text-fs-20 shrink-0">location_on</span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-secondary leading-none">Twoja dzielnica miejska (przypisana do adresu)</span>
                    <span className="font-title-md text-title-md text-on-surface font-semibold truncate mt-0.5">{district}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface-container text-secondary font-label-md text-label-md shrink-0 flex items-center gap-1 font-semibold" title="Dzielnica wynika z zweryfikowanego adresu zamieszkania">
                  <span aria-hidden="true" className="material-symbols-outlined text-fs-14">lock</span><span>Z adresu</span>
                </span>
              </div>
            )}

            {isGuest && (
              <button type="button" onClick={logout} className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">login</span>Zaloguj się lub załóż konto
              </button>
            )}
          </div>

          {!isGuest && !isChild && (
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-title-lg text-title-lg text-on-surface font-bold">Aktywność obywatelska</span>
                <span className="font-label-sm text-label-sm text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-0.5"><span aria-hidden="true" className="material-symbols-outlined text-fs-14">workspace_premium</span>Aktywny mieszkaniec</span>
              </div>
              <div className="grid grid-cols-3 gap-space-sm">
                {[['how_to_vote', '14', 'Głosów w BO'], ['flag', '5', 'Zgłoszeń (4 załatwione)'], ['volunteer_activism', '3', 'Akcje Eko']].map(([icon, n, label]) => (
                  <button key={label} type="button" onClick={() => onNavigate('votes')} className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left cursor-pointer">
                    <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant mb-2"><span aria-hidden="true" className="material-symbols-outlined text-fs-18">{icon}</span></div>
                    <div>
                      <div className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">{n}</div>
                      <div className="font-label-sm text-label-sm text-secondary leading-tight mt-0.5">{label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isGuest && (
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">Moje zasoby miejskie</h2>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
                <Row icon="bookmark" title="Zapisane wydarzenia" desc="Kalendarz wydarzeń miejskich" onClick={() => onNavigate('events')}>
                  <span aria-hidden="true" className="material-symbols-outlined text-secondary text-fs-20 shrink-0">chevron_right</span>
                </Row>
                {!isChild && (
                  <Row icon="assignment" title="Wnioski i formularze urzędowe" desc="Toruńska Karta Dużej Rodziny / Mieszkańca" onClick={() => onNavigate('tickets')}>
                    <span aria-hidden="true" className="material-symbols-outlined text-secondary text-fs-20 shrink-0">chevron_right</span>
                  </Row>
                )}
                <Row icon="receipt_long" title="Historia biletów i opłat miejskich" desc="MZK Toruń, Strefa Płatnego Parkowania" onClick={() => onNavigate('tickets#historia-biletow')} divider={false}>
                  <span aria-hidden="true" className="material-symbols-outlined text-secondary text-fs-20 shrink-0">chevron_right</span>
                </Row>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* ───────── Personalizacja (osobny kafelek) ───────── */}
          <section aria-labelledby="personalization-title" data-testid="personalization">
            <h2 id="personalization-title" className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">Personalizacja</h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/60 overflow-hidden flex flex-col">
              <Row icon="contrast" title="Motyw aplikacji" desc="Jasny, ciemny lub zgodny z ustawieniami systemu" stack>
                <label className="sr-only" htmlFor="profile-theme">Motyw aplikacji</label>
                <select id="profile-theme" value={mode} onChange={(e) => setMode(e.target.value)} className="h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface cursor-pointer shrink-0">
                  <option value="light">Jasny</option>
                  <option value="dark">Ciemny</option>
                  <option value="system">Systemowy</option>
                </select>
              </Row>

              <Row icon="fingerprint" title="Logowanie biometryczne" desc={`Face ID / Odcisk palca ${prefs.biometrics ? 'aktywne' : 'wyłączone'}`}>
                <Toggle checked={prefs.biometrics} onChange={(v) => setPref('biometrics', v)} label="Logowanie biometryczne" />
              </Row>

              <Row icon="security" title="Uwierzytelnianie dwuskładnikowe (2FA)" desc={prefs.twoFA ? 'Aktywne – kod z aplikacji Authenticator' : 'Wyłączone – zalecamy włączyć'}>
                <Toggle checked={prefs.twoFA} onChange={(v) => { if (v) setTwoFaOpen(true); else setPref('twoFA', false); }} label="Uwierzytelnianie dwuskładnikowe" />
              </Row>

              <div className="px-space-md pt-space-md pb-1">
                <span className="text-fs-11 font-bold text-secondary uppercase tracking-wider">Ułatwienia dostępu</span>
              </div>

              <Row icon="invert_colors" title="Wysoki kontrast" desc="Mocniejsze kolory i wyraźne obramowania">
                <Toggle checked={prefs.hc} onChange={(v) => setPref('hc', v)} label="Wysoki kontrast" />
              </Row>

              <Row icon="format_size" title="Rozmiar czcionki" desc="Zmienia wielkość tekstu w całej aplikacji" stack>
                <Segmented label="Rozmiar czcionki" value={prefs.font} onChange={(v) => setPref('font', v)} options={[{ value: 'small', label: 'A−' }, { value: 'normal', label: 'A' }, { value: 'large', label: 'A+' }, { value: 'xlarge', label: 'A++' }]} />
              </Row>

              <Row icon="zoom_in" title="Rozmiar interfejsu" desc="Skaluje przyciski, odstępy i ikony" divider={false} stack>
                <Segmented label="Rozmiar interfejsu" value={prefs.ui} onChange={(v) => setPref('ui', v)} options={[{ value: 'compact', label: 'Kompaktowy' }, { value: 'normal', label: 'Standardowy' }, { value: 'large', label: 'Duży' }]} />
              </Row>

              <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between gap-3">
                <p className="text-xs text-secondary">Zmiany zapisują się automatycznie.</p>
                <button type="button" onClick={resetPrefs} className="text-xs font-semibold text-primary hover:underline cursor-pointer">Przywróć domyślne</button>
              </div>
            </div>
          </section>

          {!isGuest && (
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">Centrum powiadomień i kanały</h2>
              <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/60 p-space-md flex flex-col gap-space-md">
                <span className="font-label-md text-label-md text-secondary block font-semibold">Tematy alertów miejskich w Toruniu</span>
                <div className="flex flex-wrap gap-space-xs">
                  {[['transport', 'Transport i MZK'], ['alerts', 'Alerty SMS i kryzysowe'], ['civicBudget', 'Budżet Obywatelski'], ['culture', 'Kultura i Festiwale']].map(([k, label]) => (
                    <button key={k} type="button" onClick={() => toggleNotification(k)} aria-pressed={notifications[k]} className={`px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${notifications[k] ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}>
                      <span aria-hidden="true" className="material-symbols-outlined text-fs-16">{notifications[k] ? 'check' : 'add'}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">Pomoc i kontakt</h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/60 overflow-hidden flex flex-col">
              {HELP_ITEMS.map((h, i) => {
                const isOpen = helpOpen === h.id;
                return (
                  <div key={h.id} className={i < HELP_ITEMS.length - 1 ? 'border-b border-outline-variant/60' : ''}>
                    <button
                      type="button"
                      onClick={() => setHelpOpen(isOpen ? null : h.id)}
                      aria-expanded={isOpen}
                      aria-controls={`help-${h.id}`}
                      className="w-full p-space-md flex items-center justify-between gap-4 text-left hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-space-md min-w-0">
                        <span className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
                          <span aria-hidden="true" className="material-symbols-outlined text-fs-22">{h.icon}</span>
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="font-title-md text-title-md text-on-surface font-semibold">{h.title}</span>
                          <span className="font-body-sm text-body-sm text-secondary">{h.desc}</span>
                        </span>
                      </span>
                      <span aria-hidden="true" className={`material-symbols-outlined text-secondary text-fs-20 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    {isOpen && (
                      <div id={`help-${h.id}`} className="px-space-md pb-space-md pl-[4.5rem] -mt-1 text-sm text-on-surface-variant whitespace-pre-line">
                        {h.body}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">Dane na tym urządzeniu</h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/60 overflow-hidden">
              <Row icon="cleaning_services" title="Wyczyść dane lokalne" desc="Usuwa sesję, ustawienia, zakupy i zapisane przystanki z tej przeglądarki" onClick={() => setConfirmClear(true)} divider={false}>
                <span aria-hidden="true" className="material-symbols-outlined text-secondary text-fs-20 shrink-0">chevron_right</span>
              </Row>
            </div>
          </div>

          <div className="flex flex-col items-center gap-space-md pt-2">
            <button type="button" onClick={() => setConfirmLogout(true)} className="w-full h-11 rounded-xl bg-surface-container text-error hover:bg-error-container hover:text-on-error-container font-title-md text-title-md font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-20">logout</span>
              {isGuest ? 'Wyjdź z trybu gościa' : 'Wyloguj z konta'}
            </button>
          </div>
        </div>
      </div>

      {twoFaOpen && (
        <TwoFactorSetup
          account={`${(user.firstName || 'konto').toLowerCase()}@mojtorun.pl`}
          onClose={() => setTwoFaOpen(false)}
          onEnabled={() => { setPref('twoFA', true); setTwoFaOpen(false); }}
        />
      )}

      {confirmLogout && (
        <Modal onClose={() => setConfirmLogout(false)} size="sm" labelledBy="logout-title">
          <ModalHeader id="logout-title" title={isGuest ? 'Wyjść z trybu gościa?' : 'Wylogować się?'} icon="logout" onClose={() => setConfirmLogout(false)} />
          <p className="text-sm text-on-surface-variant">{isGuest ? 'Wrócisz do ekranu logowania.' : 'Zostaniesz wylogowany z konta. Ustawienia personalizacji pozostaną zapisane na tym urządzeniu.'}</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setConfirmLogout(false)} className="h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-sm cursor-pointer">Anuluj</button>
            <button type="button" onClick={() => { setConfirmLogout(false); logout(); }} className="h-11 rounded-xl bg-primary text-white font-semibold text-sm cursor-pointer">{isGuest ? 'Wyjdź' : 'Wyloguj'}</button>
          </div>
        </Modal>
      )}

      {confirmClear && (
        <Modal onClose={() => setConfirmClear(false)} size="sm" labelledBy="clear-title">
          <ModalHeader id="clear-title" title="Wyczyścić dane lokalne?" icon="cleaning_services" onClose={() => setConfirmClear(false)} />
          <p className="text-sm text-on-surface-variant">Zostaniesz wylogowany, a ustawienia personalizacji, zakupione produkty i zapisane przystanki zostaną usunięte z tej przeglądarki.</p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setConfirmClear(false)} className="h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-sm cursor-pointer">Anuluj</button>
            <button type="button" onClick={clearLocalData} className="h-11 rounded-xl bg-primary text-white font-semibold text-sm cursor-pointer">Wyczyść</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
