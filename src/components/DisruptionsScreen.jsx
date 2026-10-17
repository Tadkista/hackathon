import React, { useMemo, useState } from 'react';
import { Map, MapControls, MapMarker, MapRoute, MarkerContent, MarkerPopup } from './map/map.tsx';
import { useTheme } from '../ThemeContext.jsx';
import { Chip, PageHeader, Toggle } from './ui.jsx';
import { DISRUPTIONS, DISRUPTION_KINDS, TORUN_CENTER, fmtRange } from '../data/city.js';

const SEV = { high: { label: 'Duże', cls: 'bg-red-500/15 text-red-700 dark:text-red-300' }, medium: { label: 'Średnie', cls: 'bg-amber-500/15 text-amber-800 dark:text-amber-300' }, low: { label: 'Małe', cls: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' } };

export default function DisruptionsScreen() {
  const { isDark } = useTheme();
  const [showPlanned, setShowPlanned] = useState(false);
  const [kind, setKind] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  const now = new Date();
  const visible = useMemo(() => DISRUPTIONS
    .filter((d) => (showPlanned ? true : d.kind !== 'planned'))
    .filter((d) => (kind === 'all' ? true : d.kind === kind))
    .sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]) || a.start - b.start), [showPlanned, kind]);

  const counts = useMemo(() => {
    const c = { all: 0 };
    DISRUPTIONS.forEach((d) => { if (!showPlanned && d.kind === 'planned') return; c.all += 1; c[d.kind] = (c[d.kind] || 0) + 1; });
    return c;
  }, [showPlanned]);

  const selected = DISRUPTIONS.find((d) => d.id === selectedId && visible.some((v) => v.id === d.id)) || null;
  const status = (d) => (d.start > now ? { text: `Od ${d.start.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })}`, planned: true } : { text: 'Trwa teraz', planned: false });

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      <PageHeader
        icon="construction"
        title="Utrudnienia drogowe"
        subtitle="Remonty, korki i zamknięcia dróg w całym mieście."
        right={(
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface">Pokaż planowane remonty</span>
              <span className="text-fs-11 text-secondary">Prace zaplanowane w przyszłości</span>
            </div>
            <Toggle checked={showPlanned} onChange={setShowPlanned} label="Pokaż planowane remonty" />
          </div>
        )}
      />

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1" role="group" aria-label="Rodzaj utrudnienia">
        <Chip active={kind === 'all'} onClick={() => setKind('all')} count={counts.all}>Wszystkie</Chip>
        {Object.entries(DISRUPTION_KINDS).filter(([k]) => showPlanned || k !== 'planned').map(([k, v]) => (
          <Chip key={k} active={kind === k} onClick={() => setKind(k)} icon={v.icon} count={counts[k] || 0}>{v.label}</Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-outline-variant/60 shadow-card overflow-hidden bg-surface-container-lowest">
          <Map center={selected ? selected.coords : TORUN_CENTER} zoom={selected ? 14.2 : 12.2} theme={isDark ? 'dark' : 'light'} className="w-full h-[420px] sm:h-[560px] relative">
            <MapControls position="top-right" showZoom showCompass showFullscreen />
            {visible.filter((d) => d.line).map((d) => (
              <MapRoute key={`r-${d.id}`} id={`disr-${d.id}`} coordinates={d.line} color={DISRUPTION_KINDS[d.kind].color} width={selected?.id === d.id ? 7 : 5} opacity={d.kind === 'planned' ? 0.55 : 0.9} dashArray={d.kind === 'planned' ? [2, 2] : undefined} />
            ))}
            {visible.map((d) => {
              const k = DISRUPTION_KINDS[d.kind];
              const isSel = selected?.id === d.id;
              return (
                <MapMarker key={d.id} longitude={d.coords[0]} latitude={d.coords[1]} onClick={() => setSelectedId(d.id)}>
                  <MarkerContent>
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white cursor-pointer transition-transform ${isSel ? 'scale-125 ring-4 ring-black/20' : 'hover:scale-110'}`}
                      style={{ background: k.color }}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{k.icon}</span>
                    </div>
                  </MarkerContent>
                  <MarkerPopup>
                    <div className="p-1 space-y-1 max-w-[16rem]">
                      <p className="font-bold text-xs text-on-surface leading-tight">{d.title}</p>
                      <p className="text-fs-11 text-secondary">{d.street}</p>
                      <p className="text-fs-11 text-secondary">{fmtRange(d.start, d.end)}</p>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              );
            })}
          </Map>
          <div className="px-4 py-3 border-t border-outline-variant/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
            <span className="font-semibold text-on-surface">Legenda:</span>
            {Object.entries(DISRUPTION_KINDS).filter(([k]) => showPlanned || k !== 'planned').map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: v.color }}></span>{v.label}</span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Lista utrudnień ({visible.length})</span>
          <ul className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto pr-1">
            {visible.map((d) => {
              const k = DISRUPTION_KINDS[d.kind];
              const s = status(d);
              const open = selected?.id === d.id;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(open ? null : d.id)}
                    aria-expanded={open}
                    className={`w-full text-left p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col gap-2 ${open ? 'bg-surface-container border-outline' : 'bg-surface-container-lowest border-outline-variant/60 hover:border-outline'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: k.color }}>
                        <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{k.icon}</span>
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-on-surface leading-snug">{d.title}</span>
                        <span className="block text-xs text-secondary mt-0.5">{d.street}</span>
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-fs-11 font-semibold">
                      <span className={`px-2 py-0.5 rounded-md ${SEV[d.severity].cls}`}>Utrudnienie: {SEV[d.severity].label.toLowerCase()}</span>
                      <span className={`px-2 py-0.5 rounded-md ${s.planned ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300' : 'bg-surface-container-high text-on-surface-variant'}`}>{s.text}</span>
                      <span className="text-secondary font-medium">{fmtRange(d.start, d.end)}</span>
                    </div>
                    {open && (
                      <div className="pt-2 mt-1 border-t border-outline-variant/60 flex flex-col gap-1.5 text-xs text-on-surface-variant">
                        <p>{d.desc}</p>
                        <p className="flex items-center gap-1.5"><span aria-hidden="true" className="material-symbols-outlined text-fs-16">alt_route</span><span><strong className="text-on-surface">Objazd:</strong> {d.detour}</span></p>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && <li className="p-4 text-sm text-secondary rounded-2xl bg-surface-container-lowest border border-outline-variant/60">Brak utrudnień tego rodzaju.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
