import React, { useEffect, useState } from 'react'
import { ADMIN_PASSWORD, AUTH_KEY } from './constants'
import { ProductsProvider } from './context/ProductsContext'
import SiteHeader from './components/SiteHeader'
import Footer from './components/Footer'
import ProductPage from './components/ProductPage'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'
import HomePage from './components/HomePage'

export default function App() {
  // Simple hash router: '' -> home, '#/admin' -> admin, '#/product/:id' -> product
  function parseRoute() {
    const h = location.hash || ''
    if (h.startsWith('#/admin')) return { name: 'admin' }
    const m = h.match(/^#\/product\/(\d+)/)
    if (m) return { name: 'product', id: Number(m[1]) }
    return { name: 'home' }
  }
  const [route, setRoute] = useState(() => parseRoute())
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')

  useEffect(() => {
    const onHash = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function handleLogin(pw) {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setIsAuthed(true)
      return true
    }
    return false
  }
  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY)
    setIsAuthed(false)
    window.location.hash = ''
  }

  if (route.name === 'admin' && !isAuthed) {
    // Страница входа: доступ только по прямой ссылке, без шапки/футера
    return <AdminLogin onSubmit={handleLogin} />
  }

  return (
    <ProductsProvider>
      <div className="page-container">
        <SiteHeader />
        {route.name === 'admin' ? (
          <AdminPanel onLogout={handleLogout} />
        ) : route.name === 'product' ? (
          <ProductPage id={route.id} />
        ) : (
          <HomePage />
        )}
        <Footer />
      </div>
    </ProductsProvider>
  )
}
 
