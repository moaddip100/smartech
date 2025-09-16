import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'

const STORAGE_KEY = 'smartech_products_v1'
const SCHEMA_VERSION_KEY = 'smartech_products_schema_v'
const CURRENT_SCHEMA_VERSION = 2

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

const ProductsContext = createContext(null)

export function useProductsCtx() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('ProductsContext missing')
  return ctx
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => loadProducts())
  const [nextId, setNextId] = useState(() => (products.reduce((m, p) => Math.max(m, p.id), 0) + 1))

  useEffect(() => {
    saveProducts(products)
    // Фиксируем актуальную версию схемы на любом апдейте
    localStorage.setItem(SCHEMA_VERSION_KEY, String(CURRENT_SCHEMA_VERSION))
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
