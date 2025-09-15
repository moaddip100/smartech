import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'

const STORAGE_KEY = 'smartech_products_v1'

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
