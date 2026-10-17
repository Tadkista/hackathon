import React, { useMemo, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Chip, Modal, ModalHeader, PageHeader } from './ui.jsx';
import { EVENTS, EVENT_CATEGORIES, eventDate, fmtDayLong, fmtTime } from '../data/city.js';

const catOf = (id) => EVENT_CATEGORIES.find((c) => c.id === id);
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export default function EventsScreen() {
  const { isChild } = useAuth();
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [free, setFree] = useState(false);
  const [kidsOnly, setKidsOnly] = useState(false);
  const [saved, setSaved] = useState(() => new Set());
  const [open, setOpen] = useState(null);
  const [toast, setToast] = useState(null);

  const base = useMemo(() => (isChild ? EVENTS.filter((e) => e.kids) : EVENTS), [isChild]);
  const list = useMemo(() => base
    .filter((e) => cat === 'all' || e.category === cat)
    .filter((e) => !free || /bezpłatne/i.test(e.price))
    .filter((e) => !kidsOnly || e.kids)
    .filter((e) => `${e.title} ${e.place} ${e.organizer}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => eventDate(a) - eventDate(b)), [base, cat, free, kidsOnly, query]);

  const groups = useMemo(() => {
    const m = new Map();
    list.forEach((e) => { const d = eventDate(e); const k = dayKey(d); if (!m.has(k)) m.set(k, { date: d, items: [] }); m.get(k).items.push(e); });
    return [...m.values()];
  }, [list]);

  const counts = useMemo(() => {
    const c = { all: base.length };
    base.forEach((e) => { c[e.category] = (c[e.category] || 0) + 1; });
    return c;
  }, [base]);

  const toggleSaved = (e) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(e.id)) { next.delete(e.id); } else { next.add(e.id); setToast(`Dodano do kalendarza: ${e.title}`); setTimeout(() => setToast(null), 2600); }
      return next;
    });
  };

  const cats = EVENT_CATEGORIES.filter((c) => counts[c.id]);

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-fadeIn">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20">event_available</span>
          <span>{toast}</span>
        </div>
      )}

      <PageHeader
        icon="event"
        title={isChild ? 'Wydarzenia dla dzieci' : 'Wydarzenia'}
        subtitle={isChild ? 'Zajęcia, warsztaty i spektakle dla najmłodszych w Toruniu.' : 'Spotkania, prelekcje, wiece, imprezy, plenery, warsztaty i koncerty.'}
        right={(
          <div className="relative w-full sm:w-72">
            <span aria-hidden="true" className="material-symbols-outlined text-fs-18 absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Szukaj wydarzeń…"
              aria-label="Szukaj wydarzeń"
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-sm text-on-surface placeholder:text-secondary outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 py-1" role="group" aria-label="Kategoria wydarzeń">
          <Chip active={cat === 'all'} onClick={() => setCat('all')} count={counts.all}>Wszystkie</Chip>
          {cats.map((c) => <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)} icon={c.icon} count={counts[c.id]}>{c.label}</Chip>)}
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="inline-flex items-center gap-2 text-xs text-on-surface-variant font-medium cursor-pointer">
            <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} className="w-4 h-4 accent-[#841829]" /> Tylko bezpłatne
          </label>
          {!isChild && (
            <label className="inline-flex items-center gap-2 text-xs text-on-surface-variant font-medium cursor-pointer">
              <input type="checkbox" checked={kidsOnly} onChange={(e) => setKidsOnly(e.target.checked)} className="w-4 h-4 accent-[#841829]" /> Dla dzieci
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-7">
        {groups.map((g) => (
          <section key={dayKey(g.date)} aria-label={fmtDayLong(g.date)} className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-on-surface capitalize flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18 text-secondary">calendar_today</span>
              {fmtDayLong(g.date)}
            </h2>
            <ul className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {g.items.map((e) => {
                const c = catOf(e.category);
                const isSaved = saved.has(e.id);
                const d = eventDate(e);
                const month = d.toLocaleDateString('pl-PL', { month: 'short' }).replace('.', '');
                return (
                  <li
                    key={e.id}
                    className="group relative flex items-stretch rounded-2xl bg-surface-container-lowest border border-outline-variant/60 overflow-hidden transition-colors hover:border-outline hover:bg-surface-container-low focus-within:border-outline"
                  >
                    <div className="w-[4.5rem] shrink-0 flex flex-col items-center justify-center py-3 border-r border-outline-variant/60 text-center" aria-hidden="true">
                      <span className="text-fs-22 font-extrabold text-on-surface leading-none">{d.getDate()}</span>
                      <span className="text-fs-11 font-semibold uppercase tracking-wider text-secondary mt-1">{month}</span>
                    </div>
                    <div className="flex-1 min-w-0 p-4 flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-fs-11 font-semibold uppercase tracking-wider text-secondary">
                        <span aria-hidden="true" className="material-symbols-outlined text-fs-14">{c.icon}</span>
                        <span>{c.label}</span>
                        <span aria-hidden="true">·</span>
                        <span>{fmtTime(d)}</span>
                      </div>
                      <h3 className="text-sm font-bold text-on-surface leading-snug">
                        <button type="button" onClick={() => setOpen(e)} className="text-left cursor-pointer after:absolute after:inset-0 after:content-['']">
                          {e.title}
                        </button>
                      </h3>
                      <p className="text-xs text-secondary flex items-center gap-1 min-w-0">
                        <span aria-hidden="true" className="material-symbols-outlined text-fs-14 shrink-0">location_on</span>
                        <span className="truncate">{e.place}</span>
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        <span className="font-semibold text-on-surface">{e.price}</span>
                        {e.kids && <span> · dla dzieci {e.ages}</span>}
                      </p>
                    </div>
                    <div className="relative z-10 flex items-center pr-3">
                      <button
                        type="button"
                        onClick={() => toggleSaved(e)}
                        aria-pressed={isSaved}
                        aria-label={isSaved ? 'W kalendarzu' : 'Dodaj do kalendarza'}
                        title={isSaved ? 'W kalendarzu' : 'Dodaj do kalendarza'}
                        className={`w-10 h-10 rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer ${isSaved ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`}
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-fs-20">{isSaved ? 'event_available' : 'event'}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        {groups.length === 0 && (
          <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/60 text-center text-secondary text-sm">
            Nie znaleziono wydarzeń dla wybranych filtrów.
          </div>
        )}
      </div>

      {open && (
        <Modal onClose={() => setOpen(null)} size="md" labelledBy="event-title">
          <ModalHeader id="event-title" title={open.title} icon={catOf(open.category).icon} onClose={() => setOpen(null)} />
          <dl className="grid grid-cols-1 gap-2 text-sm">
            {[
              ['Termin', `${fmtDayLong(eventDate(open))}, godz. ${fmtTime(eventDate(open))}`],
              ['Miejsce', `${open.place}, ${open.address}`],
              ['Cena', open.price],
              ['Organizator', open.organizer],
              ...(open.ages ? [['Wiek', open.ages]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3"><dt className="w-24 text-secondary shrink-0">{k}</dt><dd className="text-on-surface font-semibold">{v}</dd></div>
            ))}
          </dl>
          <p className="text-sm text-on-surface-variant">{open.desc}</p>
          <button
            type="button"
            onClick={() => { toggleSaved(open); setOpen(null); }}
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-fs-18">event_available</span>
            {saved.has(open.id) ? 'Usuń z kalendarza' : 'Dodaj do kalendarza'}
          </button>
        </Modal>
      )}
    </div>
  );
}
