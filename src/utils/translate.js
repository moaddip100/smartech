// Клиент LibreTranslate-совместимого API.
// Настройка через .env:
// VITE_TRANSLATE_API_URL=https://<your-libtranslate>/translate
// VITE_TRANSLATE_API_KEY=<optional>

export const isTranslateConfigured = !!import.meta.env.VITE_TRANSLATE_API_URL

export async function translateText(text, from = 'en', to = 'es') {
  try {
    if (!text || !text.trim()) return text
  const url = import.meta.env.VITE_TRANSLATE_API_URL
    if (!url) return text // не настроено — без перевода

    const apiKey = import.meta.env.VITE_TRANSLATE_API_KEY
    const body = {
      q: text,
      source: from,
      target: to,
      format: 'text',
      ...(apiKey ? { api_key: apiKey } : {}),
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error('Translate API error', res.status, res.statusText)
      return text
    }

    const data = await res.json()
    // Ожидается { translatedText: string }
    if (typeof data?.translatedText === 'string') return data.translatedText
    // Некоторые инстансы возвращают массив
    if (Array.isArray(data) && data[0]?.translatedText) return data[0].translatedText

    return text
  } catch (e) {
    console.error('Translate failed', e)
    return text
  }
}
