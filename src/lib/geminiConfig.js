// Konfiguracja AI Przewodnika (Google Gemini API).
// Wklej tutaj swoje klucze API z https://aistudio.google.com/app/apikey.
// Aplikacja najpierw próbuje klucza podstawowego; jeśli zawiedzie (błąd sieci,
// nieprawidłowy klucz, limit zapytań), automatycznie próbuje klucza zapasowego.
// Jeśli oba zawiodą, użytkownik zobaczy komunikat o błędzie.

export const GEMINI_API_KEY_PRIMARY = 'WKLEJ_TUTAJ_PIERWSZY_KLUCZ_API_GEMINI';
export const GEMINI_API_KEY_SECONDARY = 'WKLEJ_TUTAJ_DRUGI_KLUCZ_API_GEMINI';

export const GEMINI_MODEL = 'gemini-2.5-flash';

const isPlaceholder = (key) => !key || key.startsWith('WKLEJ_TUTAJ_');

async function callGemini(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
  if (!text) throw new Error('Gemini API: pusta odpowiedź');
  return text;
}

// Próbuje klucza podstawowego, a przy błędzie — zapasowego. Rzuca błąd jeśli oba zawiodą
// lub oba są wciąż nieustawionymi wartościami placeholder.
export async function generateWithGemini(prompt) {
  if (isPlaceholder(GEMINI_API_KEY_PRIMARY) && isPlaceholder(GEMINI_API_KEY_SECONDARY)) {
    throw new Error('Brak skonfigurowanych kluczy API Gemini. Uzupełnij src/lib/geminiConfig.js.');
  }
  try {
    return await callGemini(GEMINI_API_KEY_PRIMARY, prompt);
  } catch (primaryError) {
    try {
      return await callGemini(GEMINI_API_KEY_SECONDARY, prompt);
    } catch (secondaryError) {
      throw new Error('Nie udało się wygenerować planu wycieczki (oba klucze API Gemini zawiodły).');
    }
  }
}
