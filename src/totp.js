// Time-based one-time passwords (RFC 6238), compatible with Google/Microsoft Authenticator.
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function randomSecret(len = 16) {
  const a = new Uint8Array(len);
  (globalThis.crypto || window.crypto).getRandomValues(a);
  return Array.from(a, (b) => B32[b % 32]).join('');
}

function b32decode(s) {
  let bits = '';
  for (const c of s.replace(/=+$/, '').toUpperCase()) bits += B32.indexOf(c).toString(2).padStart(5, '0');
  const out = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2));
  return new Uint8Array(out);
}

async function hotp(secret, counter) {
  const subtle = globalThis.crypto.subtle;
  const key = await subtle.importKey('raw', b32decode(secret), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);
  const h = new Uint8Array(await subtle.sign('HMAC', key, buf));
  const o = h[19] & 15;
  const bin = ((h[o] & 127) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(bin % 1000000).padStart(6, '0');
}

export const canVerifyTotp = () => !!(globalThis.crypto && globalThis.crypto.subtle);

// Accepts the previous, current and next 30 s window to tolerate clock drift.
export async function verifyTotp(secret, code) {
  if (!/^\d{6}$/.test(code)) return false;
  if (!canVerifyTotp()) return true; // insecure (plain http) origin: WebCrypto is unavailable
  const counter = Math.floor(Date.now() / 30000);
  for (const d of [-1, 0, 1]) {
    if ((await hotp(secret, counter + d)) === code) return true;
  }
  return false;
}

export function otpauthUrl(secret, account) {
  const issuer = 'MójToruń';
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}
