import React, { useEffect, useMemo, useState } from 'react';
import { Chip, PageHeader, Segmented } from './ui.jsx';
import { MZK_LINES, STOPS, LINE_STOPS, TRAIN_STATIONS, nextBusDepartures, nextTrains } from '../data/city.js';

const lineOf = (id) => MZK_LINES.find((l) => l.id === id) || { id, type: 'bus', color: '#334155' };
const stopById = (id) => STOPS.find((s) => s.id === id);

const DIACRITICS = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ż: 'z', ź: 'z' };
const normalize = (s) => s.toLowerCase().replace(/[ąćęłńóśżź]/g, (c) => DIACRITICS[c] || c);

function LineBadge({ id, size = 'md' }) {
  const l = lineOf(id);
  const tram = l.type === 'tram';
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-14 h-14';
  return (
    <span
      className={`relative inline-flex flex-col items-center justify-center ${dim} rounded-2xl bg-surface-container border border-outline-variant/60 shrink-0 overflow-hidden`}
      aria-label={`${tram ? 'Tramwaj' : 'Autobus'} linii ${l.id}`}
    >
      <span aria-hidden="true" className="material-symbols-outlined text-fs-14 text-secondary leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>{tram ? 'tram' : 'directions_bus'}</span>
      <span className="text-fs-18 font-extrabold text-on-surface leading-none mt-0.5 tracking-tight">{l.id}</span>
      <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-1.5" style={{ background: l.color }}></span>
    </span>
  );
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(t); }, []);
  return now;
}

export default function TimetableScreen() {
  const now = useClock();
  const [mode, setMode] = useState('mzk'); // mzk | train
  const [browse, setBrowse] = useState('search'); // search | line
  const [query, setQuery] = useState('');
  const [stopId, setStopId] = useState('plac-rapackiego');
  const [lineBrowse, setLineBrowse] = useState(MZK_LINES[0]?.id ?? '');
  const [dirBrowse, setDirBrowse] = useState('0');
  const [station, setStation] = useState('glowny');
  const [lineFilter, setLineFilter] = useState('all');
  const [fav, setFav] = useState(() => { try { return JSON.parse(localStorage.getItem('mojtorun-fav-stops') || '[]'); } catch (e) { return []; } });

  const stop = stopById(stopId) || STOPS[0];
  const deps = useMemo(() => nextBusDepartures(stop, now, 4), [stop, now]);
  const lines = [...new Set(stop.lines.map((l) => l.line))];
  const shown = deps.filter((d) => lineFilter === 'all' || d.line === lineFilter);
  const trains = useMemo(() => nextTrains(station, now, 10), [station, now]);

  const filteredStops = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return STOPS;
    return STOPS.filter((s) => normalize(s.name).includes(q));
  }, [query]);

  const lineDirs = LINE_STOPS[lineBrowse] || {};
  const dirIds = Object.keys(lineDirs).sort();
  const dirStops = (lineDirs[dirBrowse] || []).map(stopById).filter(Boolean);

  const selectStop = (id) => { setStopId(id); setLineFilter('all'); };

  const toggleFav = (id) => setFav((f) => {
    const n = f.includes(id) ? f.filter((x) => x !== id) : [...f, id];
    try { localStorage.setItem('mojtorun-fav-stops', JSON.stringify(n)); } catch (e) { /* ignore */ }
    return n;
  });

  const hhmm = (d) => d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-5xl mx-auto">
      <PageHeader
        icon="departure_board"
        title="Rozkład jazdy"
        subtitle="Odjazdy komunikacji miejskiej MZK i pociągów z toruńskich stacji."
        right={<span className="inline-flex items-center gap-2 text-xs text-secondary font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>Teraz {hhmm(now)}</span>}
      />

      <Segmented label="Rodzaj transportu" value={mode} onChange={setMode} options={[{ value: 'mzk', label: 'Autobusy i tramwaje' }, { value: 'train', label: 'Pociągi' }]} />

      {mode === 'mzk' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 flex flex-col gap-3">
            <Segmented
              label="Sposób wyszukiwania przystanku"
              value={browse}
              onChange={setBrowse}
              options={[{ value: 'search', label: 'Szukaj przystanku' }, { value: 'line', label: 'Wg linii' }]}
            />

            {browse === 'search' ? (
              <>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-on-surface-variant">Nazwa przystanku</span>
                  <div className="relative">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-16 text-secondary absolute left-3 top-1/2 -translate-y-1/2">search</span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="np. Uniwersytet, Rubinkowo…"
                      className="w-full h-11 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm text-on-surface"
                    />
                  </div>
                </label>
                <ul className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1" aria-label="Przystanki">
                  {filteredStops.map((s) => (
                    <li key={s.id} className="flex items-center gap-1">
                      <button type="button" onClick={() => selectStop(s.id)} className={`flex-1 text-left px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors ${s.id === stopId ? 'bg-surface-container border-outline text-on-surface font-semibold' : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:border-outline'}`}>
                        {s.name}
                      </button>
                      <button type="button" onClick={() => toggleFav(s.id)} aria-pressed={fav.includes(s.id)} aria-label={fav.includes(s.id) ? `Usuń ${s.name} z ulubionych` : `Dodaj ${s.name} do ulubionych`} className="w-10 h-10 rounded-xl flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer shrink-0">
                        <span aria-hidden="true" className="material-symbols-outlined text-fs-20" style={fav.includes(s.id) ? { fontVariationSettings: "'FILL' 1", color: '#d97706' } : {}}>star</span>
                      </button>
                    </li>
                  ))}
                  {filteredStops.length === 0 && <li className="p-3 text-sm text-secondary">Brak przystanków dla „{query}”.</li>}
                </ul>
              </>
            ) : (
              <>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Wybierz linię">
                  {MZK_LINES.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => { setLineBrowse(l.id); setDirBrowse('0'); }}
                      aria-pressed={lineBrowse === l.id}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border cursor-pointer transition-colors ${lineBrowse === l.id ? 'bg-primary text-white border-primary' : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface hover:border-outline'}`}
                    >
                      {l.id}
                    </button>
                  ))}
                </div>
                {dirIds.length > 0 && (
                  <Segmented
                    label="Kierunek"
                    value={dirBrowse}
                    onChange={setDirBrowse}
                    options={dirIds.map((d) => ({ value: d, label: `→ ${lineDirs[d].map(stopById).filter(Boolean).at(-1)?.name ?? '…'}` }))}
                  />
                )}
                <ul className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1" aria-label={`Przystanki linii ${lineBrowse}`}>
                  {dirStops.map((s, i) => (
                    <li key={s.id}>
                      <button type="button" onClick={() => selectStop(s.id)} className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm cursor-pointer transition-colors flex items-center gap-2 ${s.id === stopId ? 'bg-surface-container border-outline text-on-surface font-semibold' : 'bg-surface-container-lowest border-outline-variant/60 text-on-surface-variant hover:border-outline'}`}>
                        <span className="text-fs-11 text-secondary w-5 text-right shrink-0">{i + 1}.</span>
                        {s.name}
                      </button>
                    </li>
                  ))}
                  {dirStops.length === 0 && <li className="p-3 text-sm text-secondary">Brak danych dla tej linii.</li>}
                </ul>
              </>
            )}
          </aside>

          <section className="lg:col-span-8 flex flex-col gap-4" aria-live="polite">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-lg font-bold text-on-surface">{stop.name}</h2>
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Linia">
                <Chip active={lineFilter === 'all'} onClick={() => setLineFilter('all')}>Wszystkie</Chip>
                {lines.map((l) => <Chip key={l} active={lineFilter === l} onClick={() => setLineFilter(l)}>{l}</Chip>)}
              </div>
            </div>
            <ul className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card divide-y divide-outline-variant/60 overflow-hidden">
              {shown.map((d, i) => (
                <li key={`${d.line}-${d.to}-${i}`} className="px-4 py-3 flex items-center gap-3">
                  <LineBadge id={d.line} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-on-surface truncate">{d.to}</span>
                    <span className="block text-fs-11 text-secondary">{lineOf(d.line).type === 'tram' ? 'Tramwaj' : 'Autobus'}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-base font-bold text-on-surface">{d.inMin <= 0 ? 'teraz' : d.inMin < 60 ? `${d.inMin} min` : hhmm(d.at)}</span>
                    <span className="block text-fs-11 text-secondary">{hhmm(d.at)}</span>
                  </span>
                </li>
              ))}
              {shown.length === 0 && <li className="p-5 text-sm text-secondary">Brak najbliższych odjazdów.</li>}
            </ul>
          </section>
        </div>
      ) : (
        <section className="flex flex-col gap-4" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Stacja">
            {TRAIN_STATIONS.map((s) => <Chip key={s.id} active={station === s.id} onClick={() => setStation(s.id)} icon="train">{s.name}</Chip>)}
          </div>
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Odjazdy pociągów ze stacji {TRAIN_STATIONS.find((s) => s.id === station).name}</caption>
              <thead>
                <tr className="text-left text-fs-11 uppercase tracking-wider text-secondary bg-surface-container-low">
                  <th scope="col" className="px-4 py-2.5">Godz.</th><th scope="col" className="px-4 py-2.5">Kierunek</th><th scope="col" className="px-4 py-2.5 hidden sm:table-cell">Przewoźnik</th><th scope="col" className="px-4 py-2.5">Peron</th><th scope="col" className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {trains.map((t) => (
                  <tr key={`${t.time}-${t.to}`}>
                    <td className="px-4 py-3 font-bold text-on-surface whitespace-nowrap">{t.time}{t.tomorrow && <span className="ml-1.5 text-fs-11 font-semibold text-secondary">jutro</span>}</td>
                    <td className="px-4 py-3 text-on-surface font-semibold">{t.to}</td>
                    <td className="px-4 py-3 text-secondary hidden sm:table-cell">{t.op}</td>
                    <td className="px-4 py-3 text-on-surface">{t.plat}</td>
                    <td className="px-4 py-3">
                      {t.delay > 0
                        ? <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 text-fs-11 font-semibold whitespace-nowrap">opóźniony +{t.delay} min</span>
                        : <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-fs-11 font-semibold">planowo</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
