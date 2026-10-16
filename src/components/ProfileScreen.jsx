import React, { useState } from 'react';
import { useTheme } from '../ThemeContext.jsx';

export default function ProfileScreen({ onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const [district, setDistrict] = useState('Stare Miasto / Mokre');
  const [isChangingDistrict, setIsChangingDistrict] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [notifications, setNotifications] = useState({
    transport: true,
    alerts: true,
    civicBudget: true,
    culture: false,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const districtsList = [
    'Stare Miasto / Mokre',
    'Bydgoskie Przedmieście',
    'Chełmińskie Przedmieście',
    'Rubinkowo',
    'Jar',
    'Skarpa',
    'Podgórz',
    'Stawki',
  ];

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col pt-1 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
          Profil Mieszkańca
        </h1>
        <p className="text-secondary text-body-sm mt-0.5">
          Zarządzaj tożsamością miejską, ustawieniami konta oraz historią aktywności w Toruniu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column: Citizen Identity & Activity Stats */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Citizen Identity Card */}
          <div>
            <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/60 p-space-md flex flex-col gap-space-md relative overflow-hidden">
          {/* Decorative Civic Tint Accent */}
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary-fixed/30 pointer-events-none blur-2xl"></div>

          {/* Avatar & Essential Bio */}
          <div className="flex items-start gap-space-md relative z-10">
            <div className="relative shrink-0">
              <img
                alt="Aleksandra Wiśniewska"
                className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-primary/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpu-CxsyYFROnKC97ZISDGnAVNZJSMO-8gzdhVX_hJsHeoNzLMhxb_HuGomq6MuXzDWJsYFO02qtqSykSyAfyiDForQCPK7jJUwBYKRRmVP9b89KyQIkOanKnTcPBzrWG1ojpKD2XMg0fKxxJd2pRE1AHV-7TFgpUhQPzXf2L1-cI2uokJMq9outTy9noRn3_tnowuOuQBcZhyYyuK1DLMFrIQNe8nORieBDcAGPx34bVSyrAB-VQ"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shadow-xs"
                title="Konto potwierdzone"
              >
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <h1 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                Aleksandra Wiśniewska
              </h1>
              <span className="font-body-sm text-body-sm text-secondary">
                Obywatel Torunia od 2018 r.
              </span>

              {/* Verification Badge */}
              <div className="mt-space-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed w-fit">
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield
                </span>
                <span className="font-label-sm text-label-sm truncate font-medium">
                  Profil Zaufany • mObywatel
                </span>
              </div>
            </div>
          </div>

          {/* District Selector Ribbon */}
          <div className="bg-surface-container-low rounded-xl p-space-sm flex items-center justify-between gap-space-sm relative z-10">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-primary-container text-[20px] shrink-0">
                location_on
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-secondary leading-none">
                  Twoja dzielnica miejska
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate mt-0.5">
                  {district}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsChangingDistrict(true)}
              className="px-3 py-1 rounded-full bg-surface-container text-primary font-label-md text-label-md shrink-0 hover:bg-secondary-container transition-colors flex items-center gap-1 font-semibold cursor-pointer"
              type="button"
            >
              <span>Zmień</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>
          </div>
        </div>
      </div>

      {/* Civic Impact Stats (Bento Ribbon) */}
      <div>
        <div className="flex items-center justify-between mb-space-sm">
          <span className="font-title-lg text-title-lg text-on-surface font-bold">
            Aktywność obywatelska
          </span>
          <span className="font-label-sm text-label-sm text-tertiary-container font-semibold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            Aktywna torunianka
          </span>
        </div>
        <div className="grid grid-cols-3 gap-space-sm">
          {/* Stat 1 */}
          <button
            onClick={() => onNavigate('votes')}
            className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary-container mb-2">
              <span className="material-symbols-outlined text-[18px]">how_to_vote</span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
                14
              </div>
              <div className="font-label-sm text-label-sm text-secondary leading-tight mt-0.5">
                Głosów w BO
              </div>
            </div>
          </button>

          {/* Stat 2 */}
          <button
            onClick={() => onNavigate('votes')}
            className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-2">
              <span className="material-symbols-outlined text-[18px]">flag</span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
                5
              </div>
              <div className="font-label-sm text-label-sm text-secondary leading-tight mt-0.5">
                Zgłoszeń (4 załatwione)
              </div>
            </div>
          </button>

          {/* Stat 3 */}
          <button
            onClick={() => onNavigate('explore')}
            className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-2">
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
            </div>
            <div>
              <div className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
                3
              </div>
              <div className="font-label-sm text-label-sm text-secondary leading-tight mt-0.5">
                Akcje Eko
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Section: Moje zasoby miejskie */}
      <div>
        <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">
          Moje zasoby miejskie
        </h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Item 1 */}
          <button
            onClick={() => onNavigate('explore')}
            className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">bookmark</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  Zapisane wydarzenia i oferty pracy
                </span>
                <span className="font-body-sm text-body-sm text-secondary truncate">
                  Teatr Horzycy, warsztaty w Młynie Wiedzy
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm font-semibold">
                4
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
            </div>
          </button>

          <div className="h-px bg-surface-container-high mx-space-md"></div>

          {/* Item 2 */}
          <button
            onClick={() => onNavigate('tickets')}
            className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">assignment</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  Wnioski i formularze urzędowe
                </span>
                <span className="font-body-sm text-body-sm text-secondary truncate">
                  Toruńska Karta Dużej Rodziny / Mieszkańca
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                1 w toku
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
            </div>
          </button>

          <div className="h-px bg-surface-container-high mx-space-md"></div>

          {/* Item 3 */}
          <button
            onClick={() => onNavigate('tickets')}
            className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container shrink-0">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-title-md text-title-md text-on-surface font-semibold truncate">
                  Historia biletów i opłat miejskich
                </span>
                <span className="font-body-sm text-body-sm text-secondary truncate">
                  MZK Toruń, Strefa Płatnego Parkowania
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs shrink-0">
              <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    {/* Right Column: Settings, Notifications & Security */}
    <div className="lg:col-span-7 flex flex-col space-y-6">
      {/* Section: Ustawienia preferencji i powiadomień */}
      <div>
        <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">
          Centrum powiadomień i kanały
        </h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/60 p-space-md flex flex-col gap-space-md">
          <div>
            <span className="font-label-md text-label-md text-secondary block mb-space-xs font-semibold">
              Tematy alertów miejskich w Toruniu
            </span>
            <div className="flex flex-wrap gap-space-xs">
              <button
                onClick={() => toggleNotification('transport')}
                className={`px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  notifications.transport
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {notifications.transport ? 'check' : 'add'}
                </span>
                Transport i MZK
              </button>

              <button
                onClick={() => toggleNotification('alerts')}
                className={`px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  notifications.alerts
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {notifications.alerts ? 'check' : 'add'}
                </span>
                Alerty SMS i kryzysowe
              </button>

              <button
                onClick={() => toggleNotification('civicBudget')}
                className={`px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  notifications.civicBudget
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {notifications.civicBudget ? 'check' : 'add'}
                </span>
                Budżet Obywatelski
              </button>

              <button
                onClick={() => toggleNotification('culture')}
                className={`px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  notifications.culture
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-secondary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {notifications.culture ? 'check' : 'add'}
                </span>
                Kultura i Festiwale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Settings */}
      <div>
        <h2 className="font-title-lg text-title-lg text-on-surface font-bold mb-space-sm">
          Bezpieczeństwo i kontakt
        </h2>
        <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/60 overflow-hidden flex flex-col">
          {/* Dark Mode Toggle */}
          <div className="p-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Motyw aplikacji
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  {isDark ? 'Ciemny' : 'Jasny'} – kliknij, by zmienić
                </span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                isDark ? 'bg-primary-container' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-px bg-surface-container-high mx-space-md"></div>

          {/* Biometrics */}
          <div className="p-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">fingerprint</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Logowanie biometryczne
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  Face ID / Odcisk palca {biometricsEnabled ? 'aktywne' : 'wyłączone'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                biometricsEnabled ? 'bg-primary-container' : 'bg-surface-container-high'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          <div className="h-px bg-surface-container-high mx-space-md"></div>

          {/* TCK Help Desk */}
          <button
            onClick={() => alert('Toruńskie Centrum Kontaktu (TCK):\nTelefon: 56 611 83 10\nE-mail: tck@um.torun.pl\nGodziny: 7:30 - 17:00')}
            className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">contact_support</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Toruńskie Centrum Kontaktu (TCK)
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  Infolinia miejska 56 611 83 10 • tck@um.torun.pl
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">open_in_new</span>
          </button>

          <div className="h-px bg-surface-container-high mx-space-md"></div>

          {/* RODO */}
          <button
            onClick={() => alert('Polityka prywatności i ochrona danych (RODO):\nAdministratorem danych osobowych jest Prezydent Miasta Torunia.')}
            className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container-low transition-colors cursor-pointer"
            type="button"
          >
            <div className="flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">policy</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Regulamin i Ochrona Danych (RODO)
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  Administrator: Prezydent Miasta Torunia
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Logout and Version Footer */}
      <div className="flex flex-col items-center gap-space-md pt-2">
        <button
          onClick={() => {
            if (confirm('Czy na pewno chcesz wylogować się z konta mieszkańca Torunia?')) {
              alert('Zostałeś bezpiecznie wylogowany.');
            }
          }}
          className="w-full h-11 rounded-xl bg-surface-container text-error hover:bg-error-container hover:text-on-error-container font-title-md text-title-md font-semibold transition-colors flex items-center justify-center gap-space-xs cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Wyloguj z konta mieszkańca
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-secondary">
            <span className="material-symbols-outlined text-[16px]">location_city</span>
            <span className="font-label-sm text-label-sm font-medium">
              Urząd Miasta Torunia • Wydział Informatyki
            </span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary/70 mt-0.5">
            MójToruń v2.4.0 (React Edition)
          </span>
        </div>
      </div>
    </div>
  </div>

      {/* District Selector Modal */}
      {isChangingDistrict && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <span className="font-title-lg font-bold text-on-surface">Wybierz dzielnicę Torunia</span>
              <button
                onClick={() => setIsChangingDistrict(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
              {districtsList.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDistrict(d);
                    setIsChangingDistrict(false);
                  }}
                  className={`p-2.5 rounded-lg text-left font-title-md transition-colors ${
                    district === d
                      ? 'bg-primary-container text-on-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
