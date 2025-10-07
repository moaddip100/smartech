import React, { useEffect, useState } from 'react'
import { ADMIN_PASSWORD, AUTH_KEY } from './constants'
import { ProductsProvider } from './context/ProductsContext'
import SiteHeader from './components/SiteHeader'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'
import AdminHeader from './components/AdminHeader'
import AdminFooter from './components/AdminFooter'
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
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const onHash = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHash)
    const onOpenContactEvent = () => setContactOpen(true)
    window.addEventListener('smartech:openContact', onOpenContactEvent)
    return () => window.removeEventListener('hashchange', onHash)
    // cleanup for the custom event
    // note: returning only once is fine; React will call this cleanup on unmount
    // but keep signature consistent
    // eslint-disable-next-line no-unreachable
    window.removeEventListener('smartech:openContact', onOpenContactEvent)
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
        {route.name === 'admin' ? (
          <>
            <AdminHeader />
            <AdminPanel onLogout={handleLogout} />
            <AdminFooter />
          </>
        ) : (
          <>
            <SiteHeader onOpenContact={() => setContactOpen(true)} />
            {route.name === 'product' ? (
              <ProductPage id={route.id} />
            ) : (
              <HomePage />
            )}
            <Footer />
            <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
          </>
        )}
      </div>
    </ProductsProvider>
  )
}
 
