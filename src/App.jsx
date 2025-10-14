import React, { useEffect, useState } from 'react'
import { ADMIN_PASSWORD, AUTH_KEY } from './constants'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const SUPABASE_AUTH_ENABLED = import.meta.env.VITE_SUPABASE_AUTH_ENABLED === 'true'
const supabase = SUPABASE_AUTH_ENABLED && SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null
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
  const [isAuthed, setIsAuthed] = useState(() => {
    if (SUPABASE_AUTH_ENABLED) return false
    return sessionStorage.getItem(AUTH_KEY) === '1'
  })
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

  async function handleLogin(payload) {
    if (!SUPABASE_AUTH_ENABLED) {
      const pw = payload
      if (pw === ADMIN_PASSWORD) {
        sessionStorage.setItem(AUTH_KEY, '1')
        setIsAuthed(true)
        return true
      }
      return false
    }
    // Supabase auth: payload is boolean success from AdminLogin
    if (payload === true) {
      setIsAuthed(true)
      return true
    }
    return false
  }

  async function handleLogout() {
    if (SUPABASE_AUTH_ENABLED && supabase) {
      await supabase.auth.signOut()
    }
    sessionStorage.removeItem(AUTH_KEY)
    setIsAuthed(false)
    window.location.hash = ''
  }

  // Если Supabase Auth включён — проверяем текущую сессию и подписываемся на изменения
  useEffect(() => {
    if (!SUPABASE_AUTH_ENABLED || !supabase) return
    let mounted = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      if (session) setIsAuthed(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setIsAuthed(true)
      else setIsAuthed(false)
    })
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

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
 
