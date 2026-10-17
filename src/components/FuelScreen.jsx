import React, { useMemo, useState } from 'react';
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from './map/map.tsx';
import { useTheme } from '../ThemeContext.jsx';
import { Chip, PageHeader, Segmented } from './ui.jsx';
import { FUEL_TYPES, STATIONS, TORUN_CENTER } from '../data/city.js';

const BRAND_COLORS = { Orlen: '#e11d48', Shell: '#d97706', BP: '#16a34a', 'Circle K': '#dc2626', Moya: '#2563eb', Auchan: '#be123c' };
const fmt = (n) => n.toFixed(2).replace('.', ',');

export default function FuelScreen() {
  const { isDark } = useTheme();
  const [fuel, setFuel] = useState('pb95');
  const [sort, setSort] = useState('price');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const list = useMemo(() => {
    const withPrice = STATIONS.filter((s) => s.prices[fuel] > 0 && (!onlyOpen || s.open24));
    return [...withPrice].sort((a, b) => (sort === 'price' ? a.prices[fuel] - b.prices[fuel] : a.updated - b.updated));
  }, [fuel, sort, onlyOpen]);

  const prices = list.map((s) => s.prices[fuel]);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;
  const avg = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
  const cheapest = list.find((s) => s.prices[fuel] === min);
  const selected = STATIONS.find((s) => s.id === selectedId) || cheapest;

  // pill fills are dark enough for white text (>= 5:1); list text is lighter on the dark theme
  const band = (p) => (max === min ? 0 : (p - min) / (max - min) < 0.34 ? 0 : (p - min) / (max - min) < 0.67 ? 1 : 2);
  const tone = (p) => ['#15803d', '#b45309', '#b91c1c'][band(p)];
  const textTone = (p) => (isDark ? ['#4ade80', '#fbbf24', '#f87171'] : ['#15803d', '#b45309', '#b91c1c'])[band(p)];

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon="local_gas_station"
        title="Ceny paliw"
        subtitle="Stacje w całym Toruniu z aktualnymi cenami – znajdź najtańsze tankowanie."
        right={(
          <div className="inline-flex items-center gap-2 text-xs text-secondary font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Ceny aktualizowane na bieżąco
          </div>
        )}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 py-1" role="group" aria-label="Rodzaj paliwa">
          {FUEL_TYPES.map((f) => (
            <Chip key={f.id} active={fuel === f.id} onClick={() => { setFuel(f.id); setSelectedId(null); }}>{f.label}</Chip>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="inline-flex items-center gap-2 text-xs text-on-surface-variant font-medium cursor-pointer">
            <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} className="w-4 h-4 accent-slate-900 dark:accent-slate-200" />
            Czynne całą dobę
          </label>
          <Segmented
            label="Sortowanie"
            value={sort}
            onChange={setSort}
            options={[{ value: 'price', label: 'Najtańsze' }, { value: 'fresh', label: 'Najświeższe' }]}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Najniższa', value: min, icon: 'trending_down', tone: 'text-emerald-700 dark:text-emerald-400' },
          { label: 'Średnia', value: avg, icon: 'horizontal_rule', tone: 'text-on-surface' },
          { label: 'Najwyższa', value: max, icon: 'trending_up', tone: 'text-red-600 dark:text-red-400' },
        ].map((k) => (
          <div key={k.label} className="p-3 sm:p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card min-w-0">
            <div className="flex items-center justify-between gap-1 text-secondary mb-1 min-w-0">
              <span className="text-fs-11 font-semibold uppercase truncate min-w-0">{k.label}</span>
              <span aria-hidden="true" className={`material-symbols-outlined text-fs-18 shrink-0 ${k.tone}`}>{k.icon}</span>
            </div>
            <div className={`text-lg sm:text-2xl font-bold break-words ${k.tone}`}>{list.length ? `${fmt(k.value)} zł` : '—'}</div>
            <div className="text-fs-11 text-secondary">za litr</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-outline-variant/60 shadow-card overflow-hidden bg-surface-container-lowest">
          <Map center={selected ? selected.coords : TORUN_CENTER} zoom={12.2} theme={isDark ? 'dark' : 'light'} className="w-full h-[420px] sm:h-[540px] relative">
            <MapControls position="top-right" showZoom showCompass showLocate showFullscreen />
            {list.map((s) => {
              const p = s.prices[fuel];
              const isSel = selected?.id === s.id;
              return (
                <MapMarker key={s.id} longitude={s.coords[0]} latitude={s.coords[1]} onClick={() => setSelectedId(s.id)}>
                  <MarkerContent>
                    <div
                      className={`px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-lg border-2 border-white/80 cursor-pointer select-none transition-transform ${isSel ? 'scale-110 ring-4 ring-black/20' : 'hover:scale-105'}`}
                      style={{ background: tone(p) }}
                    >
                      {fmt(p)}
                    </div>
                  </MarkerContent>
                  <MarkerPopup>
                    <div className="p-1 space-y-1 min-w-[10rem]">
                      <p className="font-bold text-xs text-on-surface">{s.brand}</p>
                      <p className="text-fs-11 text-secondary">{s.address}</p>
                      <p className="text-sm font-bold text-on-surface">{fmt(p)} zł / l</p>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              );
            })}
          </Map>
          <div className="px-4 py-3 border-t border-outline-variant/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
            <span className="font-semibold text-on-surface">Legenda:</span>
            {[['#16a34a', 'tanio'], ['#d97706', 'średnio'], ['#dc2626', 'drogo']].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c }}></span>{l}</span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          {selected && (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 flex flex-col gap-3" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-fs-11 font-bold uppercase tracking-wider text-on-surface-variant">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: BRAND_COLORS[selected.brand] || '#475569' }}></span>
                    {selected.brand}
                  </span>
                  <h2 className="text-lg font-bold text-on-surface leading-snug mt-1">{selected.address}</h2>
                  <p className="text-xs text-secondary mt-0.5">Zaktualizowano {selected.updated} min temu · {selected.open24 ? 'czynna całą dobę' : 'godz. 6:00–22:00'}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-2">
                {FUEL_TYPES.map((f) => (
                  <div key={f.id} className={`p-2.5 rounded-xl ${f.id === fuel ? 'bg-surface-container-high' : 'bg-surface-container-low'}`}>
                    <dt className="text-fs-11 text-secondary">{f.label}</dt>
                    <dd className="text-base font-bold text-on-surface">{selected.prices[f.id] > 0 ? `${fmt(selected.prices[f.id])} zł` : '—'}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-1.5">
                {selected.amenities.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-fs-11 font-semibold">{a}</span>
                ))}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.coords[1]},${selected.coords[0]}`}
                target="_blank"
                rel="noreferrer"
                className="h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-fs-18">navigation</span>
                Nawiguj do stacji
              </a>
            </div>
          )}

          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-4 flex flex-col gap-2">
            <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Stacje ({list.length})</span>
            <ul className="flex flex-col gap-1.5 max-h-80 overflow-y-auto pr-1">
              {list.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full p-3 rounded-xl text-left border flex items-center gap-3 transition-colors cursor-pointer ${selected?.id === s.id ? 'bg-surface-container border-outline' : 'bg-surface-container-low border-transparent hover:border-outline-variant'}`}
                  >
                    <span className="w-6 text-center text-xs font-bold text-secondary">{i + 1}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-on-surface truncate">{s.brand} · {s.address}</span>
                      <span className="block text-fs-11 text-secondary">{s.updated} min temu</span>
                    </span>
                    <span className="text-sm font-bold" style={{ color: textTone(s.prices[fuel]) }}>{fmt(s.prices[fuel])}</span>
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="text-sm text-secondary p-3">Brak stacji spełniających kryteria.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
