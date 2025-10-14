import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'

const STORAGE_KEY = 'smartech_products_v1'
const SCHEMA_VERSION_KEY = 'smartech_products_schema_v'
const CURRENT_SCHEMA_VERSION = 2

// Supabase optional client (configured via VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const useSupabase = !!(SUPABASE_URL && SUPABASE_KEY)
const supabase = useSupabase ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

function seedProducts() {
  // initial 6 products (3 building, 3 ppe)
  return [
    { id: 1, title: 'Card 1', description: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her', category: 'building', images: [imgCt] },
    { id: 2, title: 'Card 2', description: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her', category: 'building', images: [imgCt] },
    { id: 3, title: 'Card 3', description: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her', category: 'building', images: [imgCt] },
    { id: 4, title: 'Card 4', description: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her', category: 'ppe', images: [imgCt2] },
    { id: 5, title: 'Card 5', description: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her', category: 'ppe', images: [imgCt2] },
    { id: 6, title: 'Card 6', description: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her wright somethin her', category: 'ppe', images: [imgCt2] },
  ]
}

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedProducts()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return seedProducts()
    const storedVer = Number(localStorage.getItem(SCHEMA_VERSION_KEY) || '0')
    if (storedVer < CURRENT_SCHEMA_VERSION) {
      // Миграция: переносим базовые поля в локализованные, если их нет;
      // существующие title_es/description_es сохраняем, не перетираем.
      const migrated = parsed.map(p => {
        const title_en = p.title_en || p.title || ''
        const description_en = p.description_en || p.description || ''
        const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : [])
        return {
          ...p,
          title_en,
          description_en,
          // обратная совместимость для старого UI
          title: title_en,
          description: description_en,
          images,
        }
      })
      // Сохраняем результат миграции и версию схемы, чтобы больше не трогать данные
      localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
      saveProducts(migrated)
      return migrated
    }
    // Версия актуальна — возвращаем как есть
    return parsed
  } catch {
    return seedProducts()
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

async function syncToSupabase(products) {
  if (!supabase) return
  try {
    // Upsert: вставляем или обновляем записи по полю id
    const toUpsert = products.map(p => ({ ...p }))
    const { error } = await supabase.from('products').upsert(toUpsert, { onConflict: 'id' })
    if (error) console.error('Supabase upsert error', error)
  } catch (e) {
    console.error('Supabase sync error', e)
  }
}

async function uploadImageToStorage(base64data, fileName) {
  if (!supabase) return null
  try {
    // base64data может иметь префикс data:image/...; убираем
    const match = base64data.match(/^data:(image\/.+);base64,(.+)$/)
    let buffer
    let mime = 'image/png'
    if (match) {
      mime = match[1]
      const b64 = match[2]
      buffer = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    } else {
      // если не base64 — возвращаем null
      return null
    }
    const path = `public/${fileName}`
    const { error: uploadErr } = await supabase.storage.from('public').upload(path, buffer, { contentType: mime, upsert: true })
    if (uploadErr) {
      console.error('Storage upload error', uploadErr)
      return null
    }
    const { data: urlData, error: urlErr } = supabase.storage.from('public').getPublicUrl(path)
    if (urlErr) {
      console.error('Get public url error', urlErr)
      return null
    }
    return urlData.publicUrl
  } catch (e) {
    console.error('uploadImageToStorage exception', e)
    return null
  }
}

async function loadFromSupabase() {
  if (!supabase) return null
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) {
      console.error('Supabase load error', error)
      return null
    }
    if (!Array.isArray(data)) return null
    // Ensure images array and schema fields
    return data.map(p => ({
      ...p,
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
      title_en: p.title_en || p.title || '',
      description_en: p.description_en || p.description || ''
    }))
  } catch (e) {
    console.error('Supabase load exception', e)
    return null
  }
}

const ProductsContext = createContext(null)

export function useProductsCtx() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('ProductsContext missing')
  return ctx
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => loadProducts())
  const [nextId, setNextId] = useState(() => (products.reduce((m, p) => Math.max(m, p.id), 0) + 1))

  // Если Supabase настроен — при mount пытаемся загрузить данные оттуда.
  useEffect(() => {
    if (!useSupabase) return
    let mounted = true
    loadFromSupabase().then(remote => {
      if (!mounted) return
      if (Array.isArray(remote) && remote.length) {
        setProducts(remote)
        setNextId(remote.reduce((m, p) => Math.max(m, p.id), 0) + 1)
      }
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    saveProducts(products)
    // Фиксируем актуальную версию схемы на любом апдейте
    localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
    // Синхронизируемся с Supabase опционально
    if (useSupabase) {
      // не дожидаемся — fire-and-forget
      (async () => {
        // Для каждой product проверяем images — если это base64, загружаем и заменяем на ссылку
        const patched = await Promise.all(products.map(async p => {
          if (!p.images || !p.images.length) return p
          const imgs = await Promise.all(p.images.map(async (img, idx) => {
            if (typeof img === 'string' && img.startsWith('data:')) {
              const fn = `product-${p.id || 'new'}-${Date.now()}-${idx}.png`
              const url = await uploadImageToStorage(img, fn)
              return url || img
            }
            return img
          }))
          return { ...p, images: imgs }
        }))
        await syncToSupabase(patched)
      })()
    }
  }, [products])

  const api = useMemo(() => ({
    products,
    addProduct: (p) => {
      const newP = { ...p, id: nextId }
      setProducts(prev => [...prev, newP])
      setNextId(id => id + 1)
    },
    updateProduct: (id, patch) => {
      setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)))
    },
    deleteProduct: (id) => {
      setProducts(prev => prev.filter(p => p.id !== id))
    },
  }), [products, nextId])

  return (
    <ProductsContext.Provider value={api}>{children}</ProductsContext.Provider>
  )
}
