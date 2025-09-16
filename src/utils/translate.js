import { useState, useEffect, useRef } from 'react';ет LibreTranslate-совместимый API.
// Настройка через .env:
// VITE_TRANSLATE_API_URL=https://<your-libtranslate>/translate
// VITE_TRANSLATE_API_KEY=<optional>

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
    if (!res.ok) return text
    const data = await res.json()
    // LibreTranslate возвращает { translatedText }
    return data.translatedText || text
  } catch {
    return text
  }
}
