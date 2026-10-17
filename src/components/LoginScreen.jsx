import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import { usePrefs } from '../PrefsContext.jsx';
import { IDENTITIES, GUEST_USER, ROLES, PROVIDERS, peselValid, peselBirthDate, ageFrom } from '../data/identities.js';
import { Modal, ModalHeader, QrCode, Spinner, Toggle, formatDatePl, maskPesel } from './ui.jsx';
import { canVerifyTotp, otpauthUrl, randomSecret, verifyTotp } from '../totp.js';

const STEPS_ADULT = ['Rola', 'Weryfikacja', 'Hasło', 'Personalizacja'];
const STEPS_CHILD = ['Rola', 'Zatwierdzenie', 'Hasło', 'Personalizacja'];

/* ───────────────────────── helpers ───────────────────────── */
function passwordChecks(pw) {
  return [
    { ok: pw.length >= 8, label: 'Co najmniej 8 znaków' },
    { ok: /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(pw) && /[a-ząćęłńóśźż]/.test(pw), label: 'Wielka i mała litera' },
    { ok: /\d/.test(pw), label: 'Cyfra' },
    { ok: /[^A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż]/.test(pw), label: 'Znak specjalny' },
  ];
}

function BrandMark({ provider, size = 44 }) {
  const [failed, setFailed] = useState(false);
  const px = `${size / 16}rem`;
  // a real logo sits on a white tile (logos are designed for light backgrounds); initials are the fallback
  if (provider.logo && !failed) {
    const photo = /\.(jpe?g)$/i.test(provider.logo);
    return (
      <span
        className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 shrink-0 overflow-hidden select-none"
        style={{ width: provider.wide ? `${(size * 1.55) / 16}rem` : px, height: px, padding: photo ? 0 : provider.wide ? '0.25rem 0.4rem' : '0.3rem' }}
        aria-hidden="true"
      >
        <img src={provider.logo} alt="" draggable={false} onError={() => setFailed(true)} className={photo ? 'w-full h-full object-cover' : 'max-w-full max-h-full object-contain'} />
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl text-white font-extrabold shrink-0 select-none"
      style={{ background: provider.color, width: px, height: px, fontSize: `calc(${size / 16 * 0.3}rem * var(--font-scale, 1))` }}
      aria-hidden="true"
    >
      {provider.short}
    </span>
  );
}

function Field({ label, type = 'text', value, onChange, error, autoComplete, inputMode, maxLength, placeholder, id, right, autoFocus }) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      <span className="text-xs font-semibold text-on-surface-variant">{label}</span>
      <span className="relative flex items-center">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-invalid={!!error}
          className={`w-full h-11 px-3.5 rounded-xl bg-surface-container-low border text-sm text-on-surface placeholder:text-secondary outline-none focus:ring-2 focus:ring-primary/20 ${error ? 'border-error' : 'border-outline-variant/60'}`}
        />
        {right && <span className="absolute right-2">{right}</span>}
      </span>
      {error && <span className="text-xs text-error font-medium" role="alert">{error}</span>}
    </label>
  );
}

function PrimaryButton({ children, onClick, disabled, type = 'button', icon, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`login-cta w-full h-12 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {icon && <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{icon}</span>}
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${className}`}
    >
      {icon && <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{icon}</span>}
      {children}
    </button>
  );
}

function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center gap-2 w-full" aria-label="Postęp rejestracji">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className="flex-1 min-w-0" aria-current={active ? 'step' : undefined}>
            <div className={`h-1.5 rounded-full ${done ? 'bg-emerald-500' : active ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
            <span className={`block mt-1.5 text-fs-11 truncate ${active ? 'text-on-surface font-semibold' : 'text-secondary'}`}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

function BackLink({ onClick, children = 'Wstecz' }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-on-surface cursor-pointer self-start">
      <span aria-hidden="true" className="material-symbols-outlined text-fs-16">arrow_back</span>
      {children}
    </button>
  );
}

/* ───────────────────────── 1. role ───────────────────────── */
function RoleStep({ role, setRole, onNext, onGuest }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Kim jesteś?</h2>
        <p className="text-secondary text-sm mt-1">Dopasujemy aplikację do Twoich potrzeb.</p>
      </div>
      <div role="radiogroup" aria-label="Wybór roli" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((r) => {
          const active = role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setRole(r.id)}
              className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-3 items-start ${
                active ? 'border-primary bg-surface-container-low' : 'border-outline-variant/60 bg-surface-container-lowest hover:border-outline'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${active ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                <span aria-hidden="true" className="material-symbols-outlined text-fs-24">{r.icon}</span>
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-bold text-on-surface text-sm">{r.label}</span>
                <span className="text-secondary text-xs mt-0.5 leading-snug">{r.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
      <PrimaryButton onClick={role === 'guest' ? onGuest : onNext} disabled={!role} icon={role === 'guest' ? 'arrow_forward' : undefined}>
        {role === 'guest' ? 'Wejdź jako gość' : 'Dalej'}
      </PrimaryButton>
    </div>
  );
}

/* ───────────────────────── 2a. provider choice ───────────────────────── */
function ProviderStep({ role, onPick, onBack }) {
  const [q, setQ] = useState('');
  const banks = PROVIDERS.filter((p) => p.kind === 'bank' && p.name.toLowerCase().includes(q.toLowerCase()));
  const mob = PROVIDERS[0];
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Zaloguj się i potwierdź tożsamość</h2>
        <p className="text-secondary text-sm mt-1">Dane (imię, nazwisko, PESEL, data urodzenia i adres) pobierzemy bezpiecznie od wybranego dostawcy.</p>
      </div>

      <button
        type="button"
        onClick={() => onPick(mob)}
        className="flex items-center gap-3 p-4 rounded-2xl border-2 border-outline-variant/60 bg-surface-container-lowest hover:border-outline text-left cursor-pointer transition-colors"
      >
        <BrandMark provider={mob} size={48} />
        <span className="flex flex-col min-w-0 flex-1">
          <span className="font-bold text-on-surface text-sm">Zaloguj przez mObywatel</span>
          <span className="text-secondary text-xs">Najszybsza metoda – potwierdzisz w aplikacji mObywatel</span>
        </span>
        <span aria-hidden="true" className="material-symbols-outlined text-secondary">chevron_right</span>
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-outline-variant/60"></span>
          <span className="text-xs font-semibold text-secondary uppercase tracking-wider">lub przez bank</span>
          <span className="h-px flex-1 bg-outline-variant/60"></span>
        </div>
        <Field id="bank-search" label="Szukaj banku" value={q} onChange={setQ} placeholder="np. mBank" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none p-0 m-0" aria-label="Banki">
          {banks.map((b) => (
            <li key={b.id} className="contents">
              <button
                type="button"
                onClick={() => onPick(b)}
                className="flex items-center gap-3 p-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:border-outline text-left cursor-pointer transition-colors"
              >
                <BrandMark provider={b} size={40} />
                <span className="font-semibold text-on-surface text-sm leading-tight min-w-0">{b.name}</span>
              </button>
            </li>
          ))}
          {banks.length === 0 && <li className="text-secondary text-sm col-span-full py-2 list-none">Nie znaleziono banku „{q}”.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── 2b. provider sign-in (separate "site") ───────────────────────── */
function ProviderSignIn({ provider, identity, onCancel, onSuccess, onFail }) {
  const isMob = provider.kind === 'mobywatel';
  const [phase, setPhase] = useState('redirect'); // redirect -> form -> consent -> sending
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const attempts = useRef(0);

  useEffect(() => {
    if (phase !== 'redirect') return undefined;
    const t = setTimeout(() => setPhase('form'), 1100);
    return () => clearTimeout(t);
  }, [phase]);

  const submit = (e) => {
    e.preventDefault();
    if (isMob) {
      if (!/^\d{5}$/.test(pin)) { setErr('Wpisz 5-cyfrowy kod PIN do aplikacji mObywatel.'); return; }
      if (pin === '00000') { return rejectOrFail(); }
    } else {
      if (!login.trim() || !pass) { setErr('Wpisz identyfikator i hasło.'); return; }
      if (pass.length < 6) { return rejectOrFail(); }
    }
    setErr('');
    setBusy(true);
    setTimeout(() => { setBusy(false); setPhase('consent'); }, 800);
  };

  const rejectOrFail = () => {
    attempts.current += 1;
    if (attempts.current >= 2) { onFail('Dostawca odrzucił logowanie – podano nieprawidłowe dane.'); return; }
    setErr(isMob ? 'Nieprawidłowy kod PIN. Pozostała 1 próba.' : 'Nieprawidłowy identyfikator lub hasło. Pozostała 1 próba.');
    setPin('');
    setPass('');
  };

  const approve = () => {
    setPhase('sending');
    setTimeout(() => onSuccess(), 1300);
  };

  const dataRows = [
    ['Imię i nazwisko', `${identity.firstName} ${identity.lastName}`],
    ['PESEL', identity.pesel],
    ['Data urodzenia', formatDatePl(identity.birthDate)],
    ['Adres zamieszkania', identity.address],
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* faux browser chrome so it reads as the provider's own site */}
      <div className="rounded-2xl border border-outline-variant/60 overflow-hidden bg-surface-container-lowest shadow-card">
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border-b border-outline-variant/60">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-16 text-emerald-600">lock</span>
          <span className="text-xs text-on-surface-variant font-mono truncate" data-testid="provider-domain">https://{provider.domain}/logowanie</span>
        </div>

        {phase === 'redirect' && (
          <div className="p-10 flex flex-col items-center gap-4 text-center" role="status" aria-live="polite">
            <Spinner className="text-fs-42 text-on-surface-variant" />
            <p className="text-on-surface font-semibold text-sm">Przekierowanie do {provider.name}…</p>
            <p className="text-secondary text-xs">Zostaniesz poproszony o zalogowanie w serwisie dostawcy.</p>
          </div>
        )}

        {phase === 'form' && (
          <form onSubmit={submit} className="p-5 sm:p-6 flex flex-col gap-4" noValidate>
            <div className="flex items-center gap-3">
              <BrandMark provider={provider} size={48} />
              <div>
                <p className="font-bold text-on-surface">{provider.name}</p>
                <p className="text-secondary text-xs">{isMob ? 'Potwierdź tożsamość w aplikacji mObywatel' : 'Logowanie do bankowości internetowej'}</p>
              </div>
            </div>

            {isMob ? (
              <>
                <div className="p-3 rounded-xl bg-surface-container-low text-xs text-on-surface-variant flex gap-2">
                  <span aria-hidden="true" className="material-symbols-outlined text-fs-18">smartphone</span>
                  <span>Wysłaliśmy powiadomienie do aplikacji mObywatel. Wpisz swój PIN, aby je zatwierdzić.</span>
                </div>
                <Field id="mob-pin" label="Kod PIN (5 cyfr)" type="password" value={pin} onChange={(v) => setPin(v.replace(/\D/g, '').slice(0, 5))} inputMode="numeric" maxLength={5} autoComplete="one-time-code" error={err} autoFocus />
              </>
            ) : (
              <>
                <Field id="bank-login" label="Identyfikator / login" value={login} onChange={setLogin} autoComplete="username" autoFocus />
                <Field
                  id="bank-pass"
                  label="Hasło"
                  type={show ? 'text' : 'password'}
                  value={pass}
                  onChange={setPass}
                  autoComplete="current-password"
                  error={err}
                  right={(
                    <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ukryj hasło' : 'Pokaż hasło'} className="w-8 h-8 flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer">
                      <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{show ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  )}
                />
              </>
            )}

            <PrimaryButton type="submit" disabled={busy} icon={busy ? undefined : 'login'}>
              {busy ? <Spinner className="text-fs-18" /> : 'Zaloguj się'}
            </PrimaryButton>
          </form>
        )}

        {phase === 'consent' && (
          <div className="p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BrandMark provider={provider} size={48} />
              <div>
                <p className="font-bold text-on-surface">Udostępnienie danych</p>
                <p className="text-secondary text-xs">{provider.name} → MójToruń</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant">Aplikacja MójToruń prosi o dostęp do następujących danych:</p>
            <dl className="rounded-xl border border-outline-variant/60 divide-y divide-outline-variant/60 overflow-hidden">
              {dataRows.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 px-3.5 py-2.5 text-sm">
                  <dt className="text-secondary shrink-0">{k}</dt>
                  <dd className="text-on-surface font-semibold text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <PrimaryButton onClick={approve} icon="verified_user">Zezwól i wróć do aplikacji</PrimaryButton>
            <GhostButton onClick={() => onFail('Odmówiono udostępnienia danych – weryfikacja nie została ukończona.')}>Odrzuć</GhostButton>
          </div>
        )}

        {phase === 'sending' && (
          <div className="p-10 flex flex-col items-center gap-4 text-center" role="status" aria-live="polite">
            <Spinner className="text-fs-42 text-on-surface-variant" />
            <p className="text-on-surface font-semibold text-sm">Wracamy do aplikacji MójToruń…</p>
            <p className="text-secondary text-xs">{provider.name} przesyła Twoje dane.</p>
          </div>
        )}
      </div>
      {(phase === 'redirect' || phase === 'form') && <GhostButton onClick={onCancel} icon="close">Anuluj i wróć</GhostButton>}
    </div>
  );
}

/* ───────────────────────── 2c. child pairing (parent QR) ───────────────────────── */
function ChildPairing({ onBack, onApproved, onFail }) {
  const code = useRef(`MT-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const link = `${window.location.origin}/rodzic?kod=${code.current}`;
  const [seconds, setSeconds] = useState(300);
  const [parentOpen, setParentOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Poproś rodzica o zatwierdzenie</h2>
        <p className="text-secondary text-sm mt-1">Rodzic lub opiekun skanuje kod w swojej aplikacji i podaje dane dziecka. Nie potrzebujesz konta mObywatel ani banku.</p>
      </div>

      <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/60">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
          <QrCode value={link} size={196} label="Kod QR do zeskanowania przez rodzica" />
        </div>
        <p className="font-mono text-lg font-bold tracking-widest text-on-surface" data-testid="pair-code">{code.current}</p>
        <p className={`text-xs font-semibold ${seconds === 0 ? 'text-error' : 'text-secondary'}`} role="timer">
          {seconds === 0 ? 'Kod wygasł – wróć i wygeneruj nowy' : `Kod ważny jeszcze ${mm}:${ss}`}
        </p>
      </div>

      <ol className="flex flex-col gap-2 text-sm text-on-surface-variant">
        {['Rodzic otwiera aplikację MójToruń na swoim telefonie.', 'Skanuje ten kod QR.', 'Loguje się i wpisuje dane dziecka, a następnie zatwierdza.'].map((t, i) => (
          <li key={t} className="flex gap-3 items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface-container-high text-on-surface text-xs font-bold shrink-0">{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-2 text-secondary text-xs" role="status">
        <Spinner className="text-fs-16" />
        Czekamy na zatwierdzenie przez rodzica…
      </div>

      <GhostButton onClick={() => setParentOpen(true)} icon="supervisor_account" className="!h-12">
        Otwórz jako rodzic na tym urządzeniu
      </GhostButton>

      {parentOpen && (
        <ParentApproval
          code={code.current}
          expired={seconds === 0}
          onClose={() => setParentOpen(false)}
          onApprove={(child) => { setParentOpen(false); onApproved(child); }}
          onReject={() => { setParentOpen(false); onFail('Rodzic odrzucił prośbę o utworzenie konta.'); }}
        />
      )}
    </div>
  );
}

/* the screen the parent sees on their own phone after scanning the QR */
function ParentApproval({ code, expired, onClose, onApprove, onReject }) {
  const [step, setStep] = useState('login'); // login -> form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pesel, setPesel] = useState('');
  const [address, setAddress] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!firstName.trim()) er.firstName = 'Podaj imię dziecka.';
    if (!lastName.trim()) er.lastName = 'Podaj nazwisko dziecka.';
    if (!peselValid(pesel)) er.pesel = 'Nieprawidłowy numer PESEL.';
    else if (ageFrom(peselBirthDate(pesel)) >= 18) er.pesel = 'Ten PESEL należy do osoby pełnoletniej.';
    if (!address.trim()) er.address = 'Podaj adres zamieszkania.';
    if (!agree) er.agree = 'Zaznacz oświadczenie opiekuna.';
    setErrors(er);
    if (Object.keys(er).length) return;
    onApprove({ firstName: firstName.trim(), vocative: firstName.trim(), lastName: lastName.trim(), pesel, birthDate: peselBirthDate(pesel), address: address.trim() });
  };

  const fillSample = () => {
    const c = IDENTITIES.child;
    setFirstName(c.firstName); setLastName(c.lastName); setPesel(c.pesel); setAddress(c.address); setAgree(true); setErrors({});
  };

  return (
    <Modal onClose={onClose} size="md" labelledBy="parent-title">
      <ModalHeader id="parent-title" title="Widok rodzica" icon="supervisor_account" onClose={onClose} />
      {expired ? (
        <div className="p-4 rounded-xl bg-error-container text-on-error-container text-sm font-medium" role="alert">Ten kod wygasł. Poproś dziecko o wygenerowanie nowego.</div>
      ) : step === 'login' ? (
        <div className="flex flex-col gap-4">
          <div className="p-3 rounded-xl bg-surface-container-low text-sm text-on-surface-variant flex gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-18">qr_code_scanner</span>
            <span>Zeskanowano kod <strong className="text-on-surface font-mono">{code}</strong>. Zaloguj się, aby zatwierdzić konto dziecka.</span>
          </div>
          <PrimaryButton onClick={() => setStep('form')} icon="login">Zaloguj się przez mObywatel</PrimaryButton>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
          <p className="text-sm text-on-surface-variant">Zalogowano jako opiekun: <strong className="text-on-surface">{IDENTITIES.adult.firstName} {IDENTITIES.adult.lastName}</strong>. Podaj dane dziecka.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field id="c-first" label="Imię dziecka" value={firstName} onChange={setFirstName} error={errors.firstName} autoComplete="off" />
            <Field id="c-last" label="Nazwisko dziecka" value={lastName} onChange={setLastName} error={errors.lastName} autoComplete="off" />
          </div>
          <Field id="c-pesel" label="PESEL dziecka" value={pesel} onChange={(v) => setPesel(v.replace(/\D/g, '').slice(0, 11))} error={errors.pesel} inputMode="numeric" maxLength={11} autoComplete="off" />
          <Field id="c-addr" label="Adres zamieszkania" value={address} onChange={setAddress} error={errors.address} autoComplete="off" />
          <label className="flex items-start gap-2.5 text-sm text-on-surface-variant cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#841829]" />
            <span>Oświadczam, że jestem rodzicem lub opiekunem prawnym dziecka i zatwierdzam utworzenie konta.</span>
          </label>
          {errors.agree && <span className="text-xs text-error font-medium" role="alert">{errors.agree}</span>}
          <PrimaryButton type="submit" icon="verified_user">Zatwierdź konto dziecka</PrimaryButton>
          <div className="grid grid-cols-2 gap-2">
            <GhostButton onClick={fillSample} icon="auto_fix_high">Uzupełnij przykładowo</GhostButton>
            <GhostButton onClick={onReject} icon="block">Odrzuć</GhostButton>
          </div>
        </form>
      )}
    </Modal>
  );
}

/* ───────────────────────── 3a. verification result ───────────────────────── */
function ResultStep({ result, identity, role, provider, onContinue, onRetry, onBack }) {
  const ok = result.ok;
  return (
    <div className="flex flex-col gap-5 items-stretch">
      <div className="flex flex-col items-center text-center gap-3 py-2" role="status" aria-live="polite">
        <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${ok ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'}`}>
          <span aria-hidden="true" className="material-symbols-outlined text-fs-42" style={{ fontVariationSettings: "'FILL' 1" }}>{ok ? 'check_circle' : 'error'}</span>
        </span>
        <h2 className="text-xl font-bold text-on-surface">{ok ? 'Weryfikacja zakończona pomyślnie' : 'Weryfikacja nie powiodła się'}</h2>
        <p className="text-secondary text-sm max-w-sm">
          {ok
            ? role === 'child'
              ? 'Rodzic zatwierdził konto. Ustal teraz hasło do konta w aplikacji.'
              : `Dane otrzymaliśmy od: ${provider?.name}. Ustal teraz hasło do konta w aplikacji.`
            : result.reason}
        </p>
      </div>

      {ok && (
        <dl className="rounded-2xl border border-outline-variant/60 divide-y divide-outline-variant/60 overflow-hidden bg-surface-container-lowest" aria-label="Zweryfikowane dane">
          {[
            ['Imię i nazwisko', `${identity.firstName} ${identity.lastName}`],
            ['PESEL', maskPesel(identity.pesel)],
            ['Data urodzenia', formatDatePl(identity.birthDate)],
            ['Adres', identity.address],
          ].map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
              <dt className="text-secondary shrink-0">{k}</dt>
              <dd className="text-on-surface font-semibold text-right">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {ok ? (
        <PrimaryButton onClick={onContinue} icon="password">Utwórz hasło</PrimaryButton>
      ) : (
        <div className="flex flex-col gap-2.5">
          <PrimaryButton onClick={onRetry} icon="refresh">Spróbuj ponownie</PrimaryButton>
          <GhostButton onClick={onBack}>Wybierz inną metodę</GhostButton>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── 3b. password ───────────────────────── */
function PasswordStep({ onDone }) {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const checks = passwordChecks(pw);
  const strength = checks.filter((c) => c.ok).length;
  const match = pw.length > 0 && pw === pw2;
  const valid = strength === checks.length && match;
  const meter = ['bg-surface-container-high', 'bg-red-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500'][strength];
  const label = ['', 'Słabe', 'Średnie', 'Dobre', 'Silne'][strength];

  const submit = (e) => { e.preventDefault(); setTouched(true); if (valid) onDone(); };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div>
        <h2 className="text-xl font-bold text-on-surface">Utwórz hasło do konta</h2>
        <p className="text-secondary text-sm mt-1">Będziesz go używać do logowania w aplikacji MójToruń.</p>
      </div>
      <Field
        id="pw1" label="Hasło" type={show ? 'text' : 'password'} value={pw} onChange={setPw} autoComplete="new-password" autoFocus
        right={(
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Ukryj hasło' : 'Pokaż hasło'} className="w-8 h-8 flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{show ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      />
      <div className="flex flex-col gap-2" aria-live="polite">
        <div className="flex gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${strength >= i ? meter : 'bg-surface-container-high'}`}></span>)}
        </div>
        <p className="text-xs text-secondary">Siła hasła: <strong className="text-on-surface">{label || '—'}</strong></p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {checks.map((c) => (
            <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-secondary'}`}>
              <span className="material-symbols-outlined text-fs-14" aria-hidden="true">{c.ok ? 'check_circle' : 'radio_button_unchecked'}</span>
              {c.label}
            </li>
          ))}
        </ul>
      </div>
      <Field id="pw2" label="Powtórz hasło" type={show ? 'text' : 'password'} value={pw2} onChange={setPw2} autoComplete="new-password" error={touched && !match ? 'Hasła nie są takie same.' : ''} />
      <PrimaryButton type="submit" disabled={!valid} icon="lock">Zapisz hasło</PrimaryButton>
    </form>
  );
}

/* ───────────────────────── 4. personalization ───────────────────────── */
function PersonalizeStep({ onFinish, role }) {
  const { mode, setMode } = useTheme();
  const { prefs, setPref } = usePrefs();
  const [twoFaOpen, setTwoFaOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Spersonalizuj aplikację</h2>
        <p className="text-secondary text-sm mt-1">Wszystko możesz później zmienić w profilu, w kafelku „Personalizacja”.</p>
      </div>

      <div className="rounded-2xl border border-outline-variant/60 divide-y divide-outline-variant/60 bg-surface-container-lowest">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant shrink-0"><span aria-hidden="true" className="material-symbols-outlined text-fs-20">contrast</span></span>
            <div className="min-w-0"><p className="font-semibold text-on-surface text-sm">Motyw aplikacji</p><p className="text-secondary text-xs">Jasny, ciemny lub zgodny z systemem</p></div>
          </div>
          <label className="sr-only" htmlFor="theme-select">Motyw aplikacji</label>
          <select
            id="theme-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-sm text-on-surface cursor-pointer"
          >
            <option value="light">Jasny</option>
            <option value="dark">Ciemny</option>
            <option value="system">Systemowy</option>
          </select>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant shrink-0"><span aria-hidden="true" className="material-symbols-outlined text-fs-20">fingerprint</span></span>
            <div className="min-w-0"><p className="font-semibold text-on-surface text-sm">Logowanie biometryczne</p><p className="text-secondary text-xs">Odcisk palca lub Face ID zamiast hasła</p></div>
          </div>
          <Toggle checked={prefs.biometrics} onChange={(v) => setPref('biometrics', v)} label="Logowanie biometryczne" />
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant shrink-0"><span aria-hidden="true" className="material-symbols-outlined text-fs-20">security</span></span>
            <div className="min-w-0"><p className="font-semibold text-on-surface text-sm">Uwierzytelnianie dwuskładnikowe (2FA)</p><p className="text-secondary text-xs">Kod z aplikacji Authenticator</p></div>
          </div>
          <Toggle
            checked={prefs.twoFA}
            onChange={(v) => { if (v) setTwoFaOpen(true); else setPref('twoFA', false); }}
            label="Uwierzytelnianie dwuskładnikowe"
          />
        </div>
      </div>

      {role === 'senior' && (
        <p className="text-xs text-secondary flex items-center gap-2"><span aria-hidden="true" className="material-symbols-outlined text-fs-16">info</span>Większą czcionkę i wysoki kontrast włączysz w Profilu → Personalizacja.</p>
      )}

      <PrimaryButton onClick={onFinish} icon="rocket_launch">Zakończ i przejdź do aplikacji</PrimaryButton>

      {twoFaOpen && (
        <TwoFactorSetup
          onClose={() => setTwoFaOpen(false)}
          onEnabled={() => { setPref('twoFA', true); setTwoFaOpen(false); }}
        />
      )}
    </div>
  );
}

/* ───────────────────────── 2FA setup (real TOTP) — also reused from profile ───────────────────────── */
export function TwoFactorSetup({ onClose, onEnabled, account = 'konto@mojtorun.pl' }) {
  const secret = useMemo(() => randomSecret(16), []);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const url = otpauthUrl(secret, account);
  const grouped = secret.match(/.{1,4}/g).join(' ');

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await verifyTotp(secret, code.trim());
    setBusy(false);
    if (ok) onEnabled(); else setErr('Nieprawidłowy kod. Sprawdź, czy zegar w telefonie jest ustawiony automatycznie.');
  };

  return (
    <Modal onClose={onClose} size="md" labelledBy="twofa-title">
      <ModalHeader id="twofa-title" title="Włącz uwierzytelnianie 2FA" icon="security" onClose={onClose} />
      <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
        <ol className="flex flex-col gap-1.5 text-sm text-on-surface-variant list-decimal list-inside">
          <li>Otwórz aplikację Authenticator (np. Google lub Microsoft).</li>
          <li>Zeskanuj kod QR lub wpisz klucz ręcznie.</li>
          <li>Wpisz 6-cyfrowy kod, który pojawi się w aplikacji.</li>
        </ol>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-low">
          <div className="p-2.5 bg-white rounded-xl border border-slate-200"><QrCode value={url} size={168} label="Kod QR do aplikacji Authenticator" /></div>
          <p className="text-xs text-secondary">Klucz ręczny:</p>
          <p className="font-mono text-sm font-bold text-on-surface tracking-wider select-all" data-testid="totp-secret">{grouped}</p>
        </div>
        <Field id="totp-code" label="Kod z aplikacji (6 cyfr)" value={code} onChange={(v) => { setCode(v.replace(/\D/g, '').slice(0, 6)); setErr(''); }} inputMode="numeric" maxLength={6} autoComplete="one-time-code" error={err} autoFocus />
        {!canVerifyTotp() && <p className="text-fs-11 text-secondary">Ta przeglądarka nie udostępnia weryfikacji kodu na połączeniu bez HTTPS – wpisz dowolny 6-cyfrowy kod.</p>}
        <PrimaryButton type="submit" disabled={code.length !== 6 || busy} icon="verified_user">{busy ? 'Sprawdzam…' : 'Włącz 2FA'}</PrimaryButton>
      </form>
    </Modal>
  );
}

/* ───────────────────────── orchestrator ───────────────────────── */
export default function LoginScreen() {
  const { login } = useAuth();
  const [stage, setStage] = useState('role'); // role | provider | signin | pairing | result | password | personalize
  const [role, setRole] = useState(null);
  const [provider, setProvider] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [result, setResult] = useState(null);

  const steps = role === 'child' ? STEPS_CHILD : STEPS_ADULT;
  const stepIndex = { role: 0, provider: 1, signin: 1, pairing: 1, result: 1, password: 2, personalize: 3 }[stage];

  const enterGuest = useCallback(() => {
    login({ role: 'guest', user: GUEST_USER, method: 'guest', createdAt: Date.now() });
  }, [login]);

  const next = () => setStage(role === 'child' ? 'pairing' : 'provider');

  const PREV = { provider: 'role', pairing: 'role', signin: 'provider', password: 'result', personalize: 'password' };
  const goBack = () => {
    if (stage === 'result') return setStage(role === 'child' ? 'pairing' : 'provider');
    setStage(PREV[stage] || 'role');
  };

  const finish = () => login({ role, user: identity, method: provider?.id || (role === 'child' ? 'guardian' : 'unknown'), createdAt: Date.now() });

  const cardRef = useRef(null);
  useEffect(() => { cardRef.current?.scrollIntoView?.({ block: 'start' }); window.scrollTo(0, 0); }, [stage]);

  return (
    <div className="min-h-screen w-full bg-surface flex items-start sm:items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl flex flex-col gap-5" ref={cardRef}>
        <header className="flex items-center gap-3">
          <img src="/herb_torunia.svg" alt="Herb Torunia" className="h-11 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-on-surface tracking-tight leading-none">MójToruń</span>
            <span className="text-xs text-secondary mt-1 font-medium">Portal Mieszkańca</span>
          </div>
        </header>

        <main className="rounded-3xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 sm:p-7 flex flex-col gap-6">
          {stage !== 'role' && <BackLink onClick={goBack} />}
          {stage !== 'role' && stage !== 'signin' && <Stepper steps={steps} current={stepIndex} />}
          {stage === 'role' && <RoleStep role={role} setRole={setRole} onNext={next} onGuest={enterGuest} />}
          {stage === 'provider' && (
            <ProviderStep
              role={role}
              onBack={() => setStage('role')}
              onPick={(p) => { setProvider(p); setIdentity(IDENTITIES[role] || IDENTITIES.adult); setStage('signin'); }}
            />
          )}
          {stage === 'signin' && provider && (
            <ProviderSignIn
              provider={provider}
              identity={identity}
              onCancel={() => setStage('provider')}
              onSuccess={() => { setResult({ ok: true }); setStage('result'); }}
              onFail={(reason) => { setResult({ ok: false, reason }); setStage('result'); }}
            />
          )}
          {stage === 'pairing' && (
            <ChildPairing
              onBack={() => setStage('role')}
              onApproved={(child) => { setIdentity(child); setResult({ ok: true }); setStage('result'); }}
              onFail={(reason) => { setResult({ ok: false, reason }); setStage('result'); }}
            />
          )}
          {stage === 'result' && result && (
            <ResultStep
              result={result}
              identity={identity || {}}
              role={role}
              provider={provider}
              onContinue={() => setStage('password')}
              onRetry={() => setStage(role === 'child' ? 'pairing' : 'signin')}
              onBack={() => setStage(role === 'child' ? 'role' : 'provider')}
            />
          )}
          {stage === 'password' && <PasswordStep onDone={() => setStage('personalize')} />}
          {stage === 'personalize' && <PersonalizeStep role={role} onFinish={finish} />}
        </main>

        {stage === 'role' && (
          <p className="text-center text-xs text-secondary">
            Logując się, akceptujesz regulamin i politykę prywatności MójToruń.
          </p>
        )}
      </div>
    </div>
  );
}
