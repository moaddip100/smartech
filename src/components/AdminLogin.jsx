import React, { useEffect, useState } from 'react'
import { LOCK_KEY, MAX_ATTEMPTS, LOCK_MINUTES } from '../constants'

export default function AdminLogin({ onSubmit }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    // Restore lock state
    try {
      const raw = localStorage.getItem(LOCK_KEY)
      if (raw) {
        const { attempts = 0, lockedUntil = 0 } = JSON.parse(raw)
        setAttempts(attempts)
        setLockedUntil(lockedUntil)
      }
    } catch {}
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  function persist(at, lu) {
    try { localStorage.setItem(LOCK_KEY, JSON.stringify({ attempts: at, lockedUntil: lu })) } catch {}
  }

  const msLeft = Math.max(0, lockedUntil - now)
  const isLocked = msLeft > 0
  const mm = String(Math.floor(msLeft / 60000)).padStart(2, '0')
  const ss = String(Math.floor((msLeft % 60000) / 1000)).padStart(2, '0')

  function submit(e) {
    e.preventDefault()
    setError('')
    if (isLocked) {
      setError(`Too many attempts. Try again in ${mm}:${ss}`)
      return
    }
    const ok = onSubmit(password)
    if (!ok) {
      const nextAttempts = attempts + 1
      if (nextAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCK_MINUTES * 60 * 1000
        setAttempts(0)
        setLockedUntil(until)
        persist(0, until)
        setError(`Too many attempts. Try again in ${LOCK_MINUTES} min.`)
      } else {
        setAttempts(nextAttempts)
        persist(nextAttempts, 0)
        setError('Incorrect password')
      }
    } else {
      setAttempts(0)
      setLockedUntil(0)
      persist(0, 0)
    }
  }

  const wrap = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '24px',
    background: 'linear-gradient(135deg, #3b0764 0%, #7c1b8a 40%, #cf2778 100%)',
  }
  const card = {
    width: '100%', maxWidth: 520,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 16,
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    padding: '28px 26px',
    color: '#fff',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
  }
  const iconWrap = {
    width: 64, height: 64, borderRadius: 999,
    margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.16)'
  }
  const h2 = { textAlign: 'center', margin: '6px 0 4px', fontSize: 26, fontWeight: 800 }
  const sub = { textAlign: 'center', margin: 0, opacity: 0.9 }
  const label = { display: 'block', marginTop: 18, marginBottom: 6, fontWeight: 700 }
  const row = { position: 'relative' }
  const input = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)',
    color: '#fff', outline: 'none'
  }
  const toggle = {
    position: 'absolute', right: 8, top: 8, height: 32, padding: '0 10px',
    borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer'
  }
  const btn = {
    width: '100%', marginTop: 16, padding: '12px 16px', border: 'none', borderRadius: 12, cursor: 'pointer',
    background: isLocked ? 'linear-gradient(90deg, #6b7280, #9ca3af)' : 'linear-gradient(90deg, #7c3aed, #ec4899)', color: '#fff', fontWeight: 700,
    opacity: isLocked ? 0.8 : 1
  }
  const err = { color: '#ffb4b4', marginTop: 8, fontSize: 14 }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={iconWrap}>🔒</div>
        <h2 style={h2}>Admin Panel</h2>
        <p style={sub}>Enter password to access</p>
        <form onSubmit={submit}>
          <label style={label}>Password</label>
          <div style={row}>
            <input type={show ? 'text' : 'password'} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} style={input} disabled={isLocked} />
            <button type="button" onClick={() => setShow(s => !s)} style={toggle}>{show ? 'Hide' : 'Show'}</button>
          </div>
          {isLocked ? <div style={err}>Locked: {mm}:{ss}</div> : null}
          {error ? <div style={err}>{error}</div> : null}
          <button type="submit" style={btn} disabled={isLocked}>Sign in</button>
        </form>
      </div>
    </div>
  )
}
