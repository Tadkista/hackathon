import React, { useState } from 'react';
import { Chip, PageHeader, Segmented, Spinner } from './ui.jsx';
import { generateWithGemini } from '../lib/geminiConfig.js';

const INTERESTS = [
  { id: 'zabytki', label: 'Zabytki i architektura', icon: 'account_balance' },
  { id: 'muzea', label: 'Muzea', icon: 'museum' },
  { id: 'jedzenie', label: 'Lokalne jedzenie', icon: 'restaurant' },
  { id: 'zielen', label: 'Tereny zielone', icon: 'park' },
  { id: 'sztuka', label: 'Sztuka i kultura', icon: 'palette' },
  { id: 'dzieci', label: 'Atrakcje dla dzieci', icon: 'child_care' },
  { id: 'aktywnie', label: 'Aktywnie / sport', icon: 'directions_run' },
  { id: 'legendy', label: 'Legendy i historie', icon: 'auto_stories' },
];

const DURATIONS = [
  { value: '1-2h', label: '1–2 godziny' },
  { value: '3-4h', label: '3–4 godziny' },
  { value: 'caly-dzien', label: 'Cały dzień' },
  { value: 'weekend', label: 'Cały weekend' },
];

const FOOD_TYPES = [
  { id: 'tradycyjna', label: 'Tradycyjna polska' },
  { id: 'piernik', label: 'Piernik i słodkości' },
  { id: 'fastfood', label: 'Szybkie jedzenie' },
  { id: 'wege', label: 'Wegetariańska / wegańska' },
  { id: 'fine', label: 'Wytworna kolacja' },
];

const INTENSITY = [
  { value: 'relaks', label: 'Zrelaksowana' },
  { value: 'umiarkowana', label: 'Umiarkowana' },
  { value: 'intensywna', label: 'Intensywna' },
];

const BALANCE = [
  { value: 'zielen', label: 'Więcej zieleni' },
  { value: 'balans', label: 'Zbalansowane' },
  { value: 'zabytki', label: 'Więcej zabytków' },
];

const labelOf = (list, value) => list.find((x) => x.value === value)?.label ?? value;
const toggleIn = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

function buildPrompt(answers) {
  const { interests, duration, wantsMeal, foodTypes, coffeeBreak, groupSize, withKids, intensity, balance } = answers;
  const lines = [
    'Jesteś doświadczonym lokalnym przewodnikiem turystycznym w Toruniu, w Polsce.',
    'Zaplanuj szczegółową, konkretną wycieczkę po Toruniu na podstawie poniższych preferencji.',
    'Odpowiedz w języku polskim, w formie planu podzielonego na punkty czasowe (np. "9:00 – ..."), z nazwami realnych, istniejących miejsc w Toruniu. Bądź konkretny i praktyczny, unikaj ogólników.',
    '',
    `Czas trwania wycieczki: ${labelOf(DURATIONS, duration)}`,
    `Liczba osób: ${groupSize}${withKids ? ' (w grupie są dzieci — dobierz atrakcje odpowiednie dla dzieci)' : ''}`,
    `Intensywność: ${labelOf(INTENSITY, intensity)}`,
    `Charakter wycieczki: ${labelOf(BALANCE, balance)}`,
  ];
  if (interests.length) lines.push(`Zainteresowania: ${interests.map((id) => INTERESTS.find((i) => i.id === id)?.label).join(', ')}`);
  lines.push(`Posiłek w trakcie wycieczki: ${wantsMeal ? `tak (preferowany rodzaj: ${foodTypes.length ? foodTypes.map((id) => FOOD_TYPES.find((f) => f.id === id)?.label).join(', ') : 'bez szczególnych preferencji'})` : 'nie, bez zaplanowanego posiłku'}`);
  lines.push(`Przerwa na kawę: ${coffeeBreak ? 'tak, zaplanuj przerwę na kawę w realnej kawiarni' : 'nie'}`);
  return lines.join('\n');
}

export default function AiGuideScreen() {
  const [interests, setInterests] = useState([]);
  const [duration, setDuration] = useState('3-4h');
  const [wantsMeal, setWantsMeal] = useState(false);
  const [foodTypes, setFoodTypes] = useState([]);
  const [coffeeBreak, setCoffeeBreak] = useState(false);
  const [groupSize, setGroupSize] = useState(2);
  const [withKids, setWithKids] = useState(false);
  const [intensity, setIntensity] = useState('umiarkowana');
  const [balance, setBalance] = useState('balans');

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState('');

  const handleGenerate = async () => {
    setBusy(true);
    setError('');
    setPlan('');
    try {
      const prompt = buildPrompt({ interests, duration, wantsMeal, foodTypes, coffeeBreak, groupSize, withKids, intensity, balance });
      const text = await generateWithGemini(prompt);
      setPlan(text);
    } catch (e) {
      setError(e.message || 'Nie udało się wygenerować planu wycieczki.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-3xl mx-auto">
      <PageHeader icon="auto_awesome" title="AI Przewodnik" subtitle="Opisz swoją wymarzoną wycieczkę po Toruniu, a sztuczna inteligencja zaplanuje ją dla Ciebie." />

      <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-on-surface">Czym jesteś zainteresowany/a?</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Zainteresowania">
          {INTERESTS.map((i) => (
            <Chip key={i.id} icon={i.icon} active={interests.includes(i.id)} onClick={() => setInterests((prev) => toggleIn(prev, i.id))}>
              {i.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-on-surface">Jak długo ma trwać wycieczka?</h2>
        <Segmented label="Czas trwania" value={duration} onChange={setDuration} options={DURATIONS} />
      </section>

      <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-on-surface">Posiłek w trakcie wycieczki</h2>
            <p className="text-secondary text-xs mt-0.5">Czy mamy uwzględnić przerwę na jedzenie?</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={wantsMeal}
            onClick={() => setWantsMeal((v) => !v)}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${wantsMeal ? 'bg-emerald-500' : 'bg-surface-container-high'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${wantsMeal ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
        </div>
        {wantsMeal && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Rodzaj posiłku">
            {FOOD_TYPES.map((f) => (
              <Chip key={f.id} active={foodTypes.includes(f.id)} onClick={() => setFoodTypes((prev) => toggleIn(prev, f.id))}>
                {f.label}
              </Chip>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-outline-variant/60">
          <div>
            <h2 className="text-sm font-semibold text-on-surface pt-3">Przerwa na kawę</h2>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={coffeeBreak}
            onClick={() => setCoffeeBreak((v) => !v)}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${coffeeBreak ? 'bg-emerald-500' : 'bg-surface-container-high'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${coffeeBreak ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-on-surface">Liczba osób</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGroupSize((n) => Math.max(1, n - 1))} aria-label="Zmniejsz liczbę osób" className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high cursor-pointer">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18">remove</span>
            </button>
            <span className="w-8 text-center text-lg font-bold text-on-surface" aria-live="polite">{groupSize}</span>
            <button type="button" onClick={() => setGroupSize((n) => Math.min(20, n + 1))} aria-label="Zwiększ liczbę osób" className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high cursor-pointer">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18">add</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-outline-variant/60">
          <h2 className="text-sm font-semibold text-on-surface">Czy będą dzieci?</h2>
          <button
            type="button"
            role="switch"
            aria-checked={withKids}
            onClick={() => setWithKids((v) => !v)}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${withKids ? 'bg-emerald-500' : 'bg-surface-container-high'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${withKids ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col gap-4">
        <div>
          <h2 className="text-sm font-semibold text-on-surface mb-2">Intensywność wycieczki</h2>
          <Segmented label="Intensywność" value={intensity} onChange={setIntensity} options={INTENSITY} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-on-surface mb-2">Zieleń czy zabytki?</h2>
          <Segmented label="Charakter wycieczki" value={balance} onChange={setBalance} options={BALANCE} />
        </div>
      </section>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={busy}
        className="w-full h-12 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? <Spinner className="text-fs-18" /> : <span aria-hidden="true" className="material-symbols-outlined text-fs-18">auto_awesome</span>}
        {busy ? 'Generowanie planu…' : 'Wygeneruj plan wycieczki'}
      </button>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200/60 dark:border-red-900/40 bg-red-500/10 text-red-700 dark:text-red-300 p-4 flex items-start gap-3 text-sm">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20 shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {plan && (
        <section aria-live="polite" className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-18">map</span>
            Twój plan wycieczki
          </h2>
          <div className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{plan}</div>
        </section>
      )}
    </div>
  );
}
