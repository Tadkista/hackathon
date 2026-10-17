import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Chip, Modal, ModalHeader, PageHeader, QrCode, Spinner } from './ui.jsx';
import { GUIDES } from '../data/city.js';

const pln = (n) => `${n.toFixed(2).replace('.', ',')} zł`;
const SHARES_KEY = 'mojtorun-licence-shares';
const ownedKeyFor = (ownerKey) => `mojtorun-guides:${ownerKey}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_QTY = 10;

const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch (e) { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ } };

const fmtCode = (c) => `${c.slice(0, 3)} ${c.slice(3)}`;
const payloadFor = (share) => `mojtorun://licencja?g=${share.guideId}&c=${share.code}`;
// accepts "123456", "123 456" or a full mojtorun:// link (from a scanned QR)
function parseLicenceInput(raw) {
  const text = String(raw || '').trim();
  const link = text.match(/g=([\w-]+)&c=(\d{6})/);
  if (link) return { guideId: link[1], code: link[2], fromLink: true };
  const digits = text.replace(/\s/g, '');
  if (/^\d{6}$/.test(digits)) return { code: digits, fromLink: false };
  return null;
}

/* Camera scanner (only where the browser exposes BarcodeDetector) */
function QrScanner({ onResult, onError }) {
  const videoRef = useRef(null);
  useEffect(() => {
    let stream; let timer; let stopped = false;
    (async () => {
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        timer = setInterval(async () => {
          try {
            const found = await detector.detect(videoRef.current);
            if (found[0]?.rawValue) onResult(found[0].rawValue);
          } catch (e) { /* keep scanning */ }
        }, 400);
      } catch (e) { onError('Nie udało się uruchomić aparatu. Wpisz kod ręcznie.'); }
    })();
    return () => { stopped = true; clearInterval(timer); stream?.getTracks().forEach((t) => t.stop()); };
  }, [onResult, onError]);
  return <video ref={videoRef} muted playsInline className="w-full aspect-square rounded-2xl bg-black object-cover" aria-label="Podgląd z aparatu" />;
}

export default function GuidesScreen() {
  const { user, isGuest } = useAuth();
  const ownerKey = isGuest ? 'guest' : (user.pesel || 'user');
  const ownerName = isGuest ? 'Gość' : `${user.firstName} ${user.lastName}`;

  const [tab, setTab] = useState('all');
  const [cart, setCart] = useState([]); // [{ id, qty }]
  const [owned, setOwned] = useState(() => read(ownedKeyFor(ownerKey), {})); // { [id]: { mine, pool } }
  const [shares, setShares] = useState(() => read(SHARES_KEY, [])); // global on this device
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState('cart'); // cart | paying | done
  const [method, setMethod] = useState('blik');
  const [blik, setBlik] = useState('');
  const [email, setEmail] = useState('');
  const [errs, setErrs] = useState({});
  const [detail, setDetail] = useState(null);
  const [shareView, setShareView] = useState(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemInput, setRedeemInput] = useState('');
  const [redeemErr, setRedeemErr] = useState('');
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastEmail, setLastEmail] = useState('');
  const [boughtExtra, setBoughtExtra] = useState(false);

  const canScan = typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia;

  const list = useMemo(() => GUIDES.filter((g) => tab === 'all' || g.type === tab), [tab]);
  const guideOf = (id) => GUIDES.find((g) => g.id === id);
  const cartQty = (id) => cart.find((c) => c.id === id)?.qty || 0;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + guideOf(c.id).price * c.qty, 0);
  const isMine = (id) => !!owned[id]?.mine;
  const poolOf = (id) => owned[id]?.pool || 0;

  const say = (t) => { setToast(t); setTimeout(() => setToast(null), 2800); };
  const saveOwned = (next) => { setOwned(next); write(ownedKeyFor(ownerKey), next); };
  const saveShares = (next) => { setShares(next); write(SHARES_KEY, next); };

  const add = (g) => {
    if (cartQty(g.id)) return;
    setCart((c) => [...c, { id: g.id, qty: 1 }]);
    say(`Dodano do koszyka: ${g.title}`);
  };
  const setQty = (id, qty) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.min(MAX_QTY, Math.max(1, qty)) } : x)));
  const remove = (id) => setCart((c) => c.filter((x) => x.id !== id));

  const pay = (e) => {
    e.preventDefault();
    const next = {};
    if (method === 'blik' && !/^\d{6}$/.test(blik)) next.blik = 'Wpisz 6-cyfrowy kod BLIK.';
    if (isGuest && !EMAIL_RE.test(email.trim())) next.email = 'Podaj poprawny adres e-mail, na który wyślemy potwierdzenie.';
    setErrs(next);
    if (Object.keys(next).length) return;
    setCheckout('paying');
    // guests get an e-mail confirmation (2 s, nothing is really sent); residents pay faster
    setTimeout(() => {
      const updated = { ...owned };
      cart.forEach(({ id, qty }) => {
        const cur = updated[id] || { mine: false, pool: 0 };
        updated[id] = cur.mine ? { ...cur, pool: cur.pool + qty } : { mine: true, pool: cur.pool + qty - 1 };
      });
      saveOwned(updated);
      setBoughtExtra(cart.some((c) => c.qty > 1));
      setLastEmail(email.trim());
      setCart([]);
      setBlik('');
      setCheckout('done');
    }, isGuest ? 2000 : 1400);
  };

  const closeCart = () => { setCartOpen(false); setCheckout('cart'); setErrs({}); };

  /* ── sharing ── */
  const createShare = (g) => {
    if (poolOf(g.id) < 1) return;
    let code;
    do { code = String(Math.floor(100000 + Math.random() * 900000)); } while (shares.some((s) => s.code === code));
    const share = { code, guideId: g.id, from: ownerKey, fromName: ownerName, createdAt: Date.now(), redeemedBy: null };
    saveShares([share, ...shares]);
    saveOwned({ ...owned, [g.id]: { ...owned[g.id], pool: poolOf(g.id) - 1 } });
    setShareView(share);
  };
  const cancelShare = (share) => {
    saveShares(shares.filter((s) => s.code !== share.code));
    saveOwned({ ...owned, [share.guideId]: { mine: isMine(share.guideId), pool: poolOf(share.guideId) + 1 } });
    setShareView(null);
    say('Kod anulowano, licencja wróciła do Twojej puli.');
  };
  const copyCode = async (share) => {
    try { await navigator.clipboard.writeText(`${share.code}`); say('Skopiowano kod licencji.'); } catch (e) { say('Nie udało się skopiować kodu.'); }
  };

  const redeem = (raw) => {
    const parsed = parseLicenceInput(raw);
    if (!parsed) { setRedeemErr('Wpisz 6-cyfrowy kod lub zeskanuj kod QR od osoby udostępniającej.'); return; }
    const found = shares.find((s) => s.code === parsed.code && !s.redeemedBy);
    // a scanned link is self-contained, so it also works on another device
    const guideId = found?.guideId || (parsed.fromLink ? parsed.guideId : null);
    if (!guideId || !guideOf(guideId)) { setRedeemErr('Nieprawidłowy lub już wykorzystany kod licencji.'); return; }
    if (found && found.from === ownerKey) { setRedeemErr('To Twój własny kod. Przekaż go innej osobie, aby odebrała licencję.'); return; }
    if (found) saveShares(shares.map((s) => (s.code === found.code ? { ...s, redeemedBy: ownerKey, redeemedAt: Date.now() } : s)));
    const cur = owned[guideId] || { mine: false, pool: 0 };
    saveOwned({ ...owned, [guideId]: cur.mine ? { ...cur, pool: cur.pool + 1 } : { ...cur, mine: true } });
    setRedeemOpen(false); setRedeemInput(''); setRedeemErr(''); setScanning(false);
    say(`Odebrano licencję: ${guideOf(guideId).title}`);
  };
  const closeRedeem = () => { setRedeemOpen(false); setRedeemErr(''); setScanning(false); };

  const pendingFor = (id) => shares.filter((s) => s.guideId === id && s.from === ownerKey && !s.redeemedBy);

  return (
    <div className="flex flex-col w-full pb-10 space-y-6 max-w-7xl mx-auto">
      {toast && (
        <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold animate-fadeIn">
          <span aria-hidden="true" className="material-symbols-outlined text-fs-20">check_circle</span><span>{toast}</span>
        </div>
      )}

      <PageHeader
        icon="headphones"
        title="Audioprzewodniki i gry miejskie"
        subtitle="Zwiedzaj Toruń we własnym tempie – z lektorem lub w formie gry terenowej."
        right={(
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setRedeemOpen(true)}
              className="h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-card text-sm font-semibold text-on-surface inline-flex items-center gap-2 cursor-pointer hover:border-outline"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-fs-20">redeem</span>
              Odbierz licencję
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative h-11 px-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-card text-sm font-semibold text-on-surface inline-flex items-center gap-2 cursor-pointer hover:border-outline"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-fs-20">shopping_cart</span>
              Koszyk
              {cartCount > 0 && <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-white text-fs-11 font-bold inline-flex items-center justify-center" data-testid="cart-count">{cartCount}</span>}
            </button>
          </div>
        )}
      />

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Rodzaj produktu">
        <Chip active={tab === 'all'} onClick={() => setTab('all')} count={GUIDES.length}>Wszystko</Chip>
        <Chip active={tab === 'audio'} onClick={() => setTab('audio')} icon="headphones" count={GUIDES.filter((g) => g.type === 'audio').length}>Audioprzewodniki</Chip>
        <Chip active={tab === 'game'} onClick={() => setTab('game')} icon="extension" count={GUIDES.filter((g) => g.type === 'game').length}>Gry miejskie</Chip>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((g) => {
          const mine = isMine(g.id);
          const pool = poolOf(g.id);
          const inC = cartQty(g.id) > 0;
          return (
            <li key={g.id} className="rounded-2xl bg-surface-container-lowest border border-outline-variant/60 shadow-card p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <span className="w-12 h-12 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                  <span aria-hidden="true" className="material-symbols-outlined text-fs-24">{g.icon}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-fs-11 font-bold uppercase tracking-wider text-secondary">{g.type === 'audio' ? 'Audioprzewodnik' : 'Gra miejska'}</span>
                  <h2 className="text-base font-bold text-on-surface leading-snug">{g.title}</h2>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{g.desc}</p>
              <div className="flex flex-wrap gap-1.5 text-fs-11 font-semibold">
                <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant inline-flex items-center gap-1"><span aria-hidden="true" className="material-symbols-outlined text-fs-12">schedule</span>{g.duration}</span>
                <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant inline-flex items-center gap-1"><span aria-hidden="true" className="material-symbols-outlined text-fs-12">pin_drop</span>{g.stops} punktów</span>
                {g.langs && <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">{g.langs.join(' · ')}</span>}
                {g.ages && <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">{g.ages}</span>}
                {g.difficulty && <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">trudność: {g.difficulty}</span>}
                {mine && pool > 0 && <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 inline-flex items-center gap-1"><span aria-hidden="true" className="material-symbols-outlined text-fs-12">group_add</span>{pool} do udostępnienia</span>}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-secondary">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-16 text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <strong className="text-on-surface">{g.rating.toFixed(1).replace('.', ',')}</strong> ({g.reviews} opinii)
              </div>
              <div className="mt-auto pt-2 flex items-center justify-between gap-3">
                <span className="text-xl font-bold text-on-surface">{pln(g.price)}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setDetail(g)} className="h-10 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer">Szczegóły</button>
                  {mine ? (
                    <button type="button" onClick={() => setDetail(g)} className="h-10 px-3.5 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                      <span aria-hidden="true" className="material-symbols-outlined text-fs-16">{g.type === 'audio' ? 'play_arrow' : 'sports_esports'}</span>{g.type === 'audio' ? 'Słuchaj' : 'Graj'}
                    </button>
                  ) : (
                    <button type="button" onClick={() => add(g)} disabled={inC} className="h-10 px-3.5 rounded-xl bg-primary text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-default">
                      <span aria-hidden="true" className="material-symbols-outlined text-fs-16">{inC ? 'check' : 'add_shopping_cart'}</span>{inC ? 'W koszyku' : 'Kup'}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* ───────── product details / player / licences ───────── */}
      {detail && (
        <Modal onClose={() => setDetail(null)} labelledBy="guide-title">
          <ModalHeader id="guide-title" title={detail.title} icon={detail.icon} onClose={() => setDetail(null)} />
          <p className="text-sm text-on-surface-variant">{detail.desc}</p>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[['Czas', detail.duration], ['Punkty', `${detail.stops}`], ['Cena licencji', pln(detail.price)], [detail.type === 'audio' ? 'Języki' : 'Wiek', detail.langs ? detail.langs.join(', ') : detail.ages]].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-surface-container-low"><dt className="text-fs-11 text-secondary">{k}</dt><dd className="font-bold text-on-surface">{v}</dd></div>
            ))}
          </dl>

          {detail.audio && (
            <div className="rounded-2xl bg-surface-container-low p-3.5 flex flex-col gap-2">
              <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                <span aria-hidden="true" className="material-symbols-outlined text-fs-16">graphic_eq</span>
                {isMine(detail.id) ? 'Odtwarzacz' : 'Posłuchaj fragmentu'}
              </span>
              <audio controls preload="none" src={detail.audio} className="w-full" aria-label={`Audioprzewodnik: ${detail.title}`} />
            </div>
          )}

          {isMine(detail.id) ? (
            <>
              <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2"><span aria-hidden="true" className="material-symbols-outlined text-fs-18">check_circle</span>Masz tę licencję. {!detail.audio && 'Otwórz produkt w aplikacji w terenie.'}</div>
              <div className="rounded-2xl border border-outline-variant/60 p-3.5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-sm font-bold text-on-surface">Licencje do udostępnienia</span>
                    <span className="block text-xs text-secondary">Przekaż licencję rodzinie lub znajomym kodem albo kodem QR.</span>
                  </div>
                  <span className="min-w-9 h-9 px-2 rounded-xl bg-surface-container text-on-surface font-bold text-base inline-flex items-center justify-center" data-testid="pool-count">{poolOf(detail.id)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => createShare(detail)} disabled={poolOf(detail.id) < 1} className="h-11 rounded-xl bg-primary text-white font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-18">qr_code_2</span>Udostępnij
                  </button>
                  <button type="button" onClick={() => add(detail)} disabled={cartQty(detail.id) > 0} className="h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-18">add_shopping_cart</span>{cartQty(detail.id) > 0 ? 'W koszyku' : 'Dokup licencje'}
                  </button>
                </div>
                {pendingFor(detail.id).length > 0 && (
                  <ul className="flex flex-col gap-1.5" aria-label="Oczekujące kody">
                    {pendingFor(detail.id).map((s) => (
                      <li key={s.code} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container-low">
                        <span className="font-mono font-bold tracking-widest text-on-surface">{fmtCode(s.code)}</span>
                        <span className="flex items-center gap-1">
                          <button type="button" onClick={() => setShareView(s)} className="h-8 px-3 rounded-lg bg-surface-container text-xs font-semibold text-on-surface cursor-pointer">Pokaż</button>
                          <button type="button" onClick={() => cancelShare(s)} className="h-8 px-3 rounded-lg text-xs font-semibold text-error cursor-pointer">Anuluj</button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <button type="button" onClick={() => { add(detail); setDetail(null); }} disabled={cartQty(detail.id) > 0} className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              <span aria-hidden="true" className="material-symbols-outlined text-fs-18">add_shopping_cart</span>{cartQty(detail.id) > 0 ? 'Już w koszyku' : `Dodaj do koszyka · ${pln(detail.price)}`}
            </button>
          )}
        </Modal>
      )}

      {/* ───────── share a licence (QR + 6-digit code) ───────── */}
      {shareView && (
        <Modal onClose={() => setShareView(null)} size="sm" labelledBy="share-title">
          <ModalHeader id="share-title" title="Udostępnij licencję" icon="qr_code_2" onClose={() => setShareView(null)} />
          <p className="text-sm text-on-surface-variant">{guideOf(shareView.guideId).title}. Osoba odbierająca skanuje kod QR w swojej aplikacji lub wpisuje 6-cyfrowy kod w sekcji „Odbierz licencję”.</p>
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white rounded-2xl border border-slate-200"><QrCode value={payloadFor(shareView)} size={184} label="Kod QR licencji do zeskanowania" /></div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-3xl font-extrabold tracking-[0.2em] text-on-surface" data-testid="share-code">{fmtCode(shareView.code)}</span>
              <button type="button" onClick={() => copyCode(shareView)} aria-label="Kopiuj kod" className="w-10 h-10 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center cursor-pointer"><span aria-hidden="true" className="material-symbols-outlined text-fs-20">content_copy</span></button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => cancelShare(shareView)} className="h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-sm cursor-pointer">Anuluj kod</button>
            <button type="button" onClick={() => setShareView(null)} className="h-11 rounded-xl bg-primary text-white font-semibold text-sm cursor-pointer">Gotowe</button>
          </div>
        </Modal>
      )}

      {/* ───────── redeem a licence ───────── */}
      {redeemOpen && (
        <Modal onClose={closeRedeem} size="sm" labelledBy="redeem-title">
          <ModalHeader id="redeem-title" title="Odbierz licencję" icon="redeem" onClose={closeRedeem} />
          <p className="text-sm text-on-surface-variant">Wpisz 6-cyfrowy kod otrzymany od osoby, która udostępnia licencję{canScan ? ' lub zeskanuj jej kod QR' : ''}.</p>
          {scanning ? (
            <div className="flex flex-col gap-2">
              <QrScanner onResult={(raw) => { setScanning(false); setRedeemInput(raw); redeem(raw); }} onError={(m) => { setScanning(false); setRedeemErr(m); }} />
              <button type="button" onClick={() => setScanning(false)} className="h-10 rounded-xl bg-surface-container text-on-surface font-semibold text-sm cursor-pointer">Wpisz kod ręcznie</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); redeem(redeemInput); }} className="flex flex-col gap-3" noValidate>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-on-surface-variant">Kod licencji</span>
                <input
                  value={redeemInput}
                  onChange={(e) => { setRedeemInput(e.target.value); setRedeemErr(''); }}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="000 000"
                  aria-invalid={!!redeemErr}
                  className={`h-12 px-3.5 rounded-xl bg-surface-container-low border text-lg font-mono tracking-[0.25em] text-on-surface outline-none focus:ring-2 focus:ring-primary/20 ${redeemErr ? 'border-error' : 'border-outline-variant/60'}`}
                />
                {redeemErr && <span className="text-xs text-error font-medium" role="alert">{redeemErr}</span>}
              </label>
              <button type="submit" className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"><span aria-hidden="true" className="material-symbols-outlined text-fs-18">redeem</span>Odbierz</button>
              {canScan && (
                <button type="button" onClick={() => { setRedeemErr(''); setScanning(true); }} className="w-full h-11 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"><span aria-hidden="true" className="material-symbols-outlined text-fs-18">qr_code_scanner</span>Skanuj kod QR</button>
              )}
            </form>
          )}
        </Modal>
      )}

      {/* ───────── cart ───────── */}
      {cartOpen && (
        <Modal onClose={closeCart} locked={checkout === 'paying'} labelledBy="cart-title">
          <ModalHeader id="cart-title" title={checkout === 'done' ? 'Zakup zakończony' : 'Koszyk'} icon="shopping_cart" onClose={checkout === 'paying' ? undefined : closeCart} />
          {checkout === 'cart' && (cart.length === 0 ? (
            <p className="text-sm text-secondary py-4 text-center">Twój koszyk jest pusty.</p>
          ) : (
            <form onSubmit={pay} className="flex flex-col gap-4" noValidate>
              <ul className="flex flex-col divide-y divide-outline-variant/60" aria-label="Produkty w koszyku">
                {cart.map(({ id, qty }) => {
                  const g = guideOf(id);
                  return (
                    <li key={id} className="py-3 flex flex-col gap-2">
                      <div className="flex items-start gap-3">
                        <span className="flex-1 min-w-0 text-sm font-semibold text-on-surface">{g.title}</span>
                        <span className="text-sm font-bold text-on-surface shrink-0">{pln(g.price * qty)}</span>
                        <button type="button" onClick={() => remove(id)} aria-label={`Usuń ${g.title}`} className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:text-on-surface cursor-pointer shrink-0"><span aria-hidden="true" className="material-symbols-outlined text-fs-16">delete</span></button>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-secondary">{isMine(id) ? 'Dodatkowe licencje do udostępnienia' : qty > 1 ? `1 dla Ciebie, ${qty - 1} do udostępnienia` : 'Licencja dla Ciebie'} · {pln(g.price)} / szt.</span>
                        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface-container" role="group" aria-label={`Liczba licencji: ${g.title}`}>
                          <button type="button" onClick={() => setQty(id, qty - 1)} disabled={qty <= 1} aria-label="Zmniejsz liczbę licencji" className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><span aria-hidden="true" className="material-symbols-outlined text-fs-16">remove</span></button>
                          <span className="min-w-7 text-center text-sm font-bold text-on-surface" aria-live="polite" data-testid={`qty-${id}`}>{qty}</span>
                          <button type="button" onClick={() => setQty(id, qty + 1)} disabled={qty >= MAX_QTY} aria-label="Zwiększ liczbę licencji" className="w-8 h-8 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><span aria-hidden="true" className="material-symbols-outlined text-fs-16">add</span></button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center justify-between text-base font-bold text-on-surface"><span>Razem</span><span>{pln(total)}</span></div>

              {isGuest && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-on-surface-variant">Adres e-mail (wyślemy na niego potwierdzenie i licencje)</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrs((x) => ({ ...x, email: undefined })); }}
                    autoComplete="email"
                    placeholder="np. jan.kowalski@poczta.pl"
                    aria-label="Adres e-mail"
                    aria-invalid={!!errs.email}
                    className={`h-11 px-3.5 rounded-xl bg-surface-container-low border text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 ${errs.email ? 'border-error' : 'border-outline-variant/60'}`}
                  />
                  {errs.email && <span className="text-xs text-error font-medium" role="alert">{errs.email}</span>}
                </label>
              )}

              <div role="radiogroup" aria-label="Metoda płatności" className="grid grid-cols-2 gap-2">
                {[['blik', 'BLIK', 'smartphone'], ['card', 'Karta', 'credit_card']].map(([id, label, icon]) => (
                  <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => { setMethod(id); setErrs((x) => ({ ...x, blik: undefined })); }} className={`h-11 rounded-xl border-2 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer ${method === id ? 'border-primary bg-surface-container-low text-on-surface' : 'border-outline-variant/60 text-secondary'}`}>
                    <span aria-hidden="true" className="material-symbols-outlined text-fs-18">{icon}</span>{label}
                  </button>
                ))}
              </div>
              {method === 'blik' && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-on-surface-variant">Kod BLIK</span>
                  <input value={blik} onChange={(e) => { setBlik(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrs((x) => ({ ...x, blik: undefined })); }} inputMode="numeric" maxLength={6} placeholder="000 000" aria-invalid={!!errs.blik} className={`h-11 px-3.5 rounded-xl bg-surface-container-low border text-sm tracking-widest text-on-surface outline-none focus:ring-2 focus:ring-primary/20 ${errs.blik ? 'border-error' : 'border-outline-variant/60'}`} />
                  {errs.blik && <span className="text-xs text-error font-medium" role="alert">{errs.blik}</span>}
                </label>
              )}
              <button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"><span aria-hidden="true" className="material-symbols-outlined text-fs-18">lock</span>Zapłać {pln(total)}</button>
            </form>
          ))}
          {checkout === 'paying' && (
            <div className="py-8 flex flex-col items-center gap-3 text-center" role="status">
              <Spinner className="text-fs-42 text-on-surface-variant" />
              <p className="text-sm font-semibold text-on-surface">{isGuest ? 'Potwierdzamy płatność i wysyłamy e-mail…' : 'Przetwarzanie płatności…'}</p>
            </div>
          )}
          {checkout === 'done' && (
            <div className="py-4 flex flex-col items-center gap-3 text-center" role="status">
              <span className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"><span aria-hidden="true" className="material-symbols-outlined text-fs-32" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span></span>
              <p className="text-sm font-semibold text-on-surface">Dziękujemy! Zakupione produkty są już dostępne w aplikacji.</p>
              {isGuest && lastEmail && <p className="text-xs text-secondary">Potwierdzenie zamówienia wysłaliśmy na adres <strong className="text-on-surface">{lastEmail}</strong>.</p>}
              {boughtExtra && <p className="text-xs text-secondary">Dodatkowe licencje udostępnisz w szczegółach produktu, kodem QR lub 6-cyfrowym kodem.</p>}
              <button type="button" onClick={closeCart} className="w-full h-11 rounded-xl bg-surface-container text-on-surface font-semibold text-sm cursor-pointer">Zamknij</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
