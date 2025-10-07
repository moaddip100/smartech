import React, { useState } from 'react'
import iconSpa from '../../img/icon/iconSpa.png'
import iconEng from '../../img/icon/iconEng.png'
import { useI18n } from '../i18n/I18nProvider'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo" onClick={() => { window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <h1>
            <span className="logo-brand" aria-label="SMARTECH">
              <span className="logo-brand-smar">SMAR</span>
              <span className="logo-brand-tech">TECH</span>
            </span>
            <span className="logo-suffix">{t('header.companySuffix')}</span>
          </h1>
          <p className="logo-platform">{t('header.platform')}</p>
        </div>
        <button
          className={`mobile-toggle ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => { const next = !v; if (!next) setLangOpen(false); return next })}
        >
          <span className="hamburger"></span>
        </button>
        <div className={`header-actions ${menuOpen ? 'open' : ''}`} onClick={() => { setMenuOpen(false); setLangOpen(false); }}>
          <div className="lang-wrapper">
            <button
              className="btn btn-white lang-toggle"
              aria-haspopup="true"
              aria-expanded={langOpen}
              onClick={(e) => { e.stopPropagation(); setLangOpen(v => !v); }}
            >
              {lang === 'en' ? 'English' : 'Español'}
              <span className="caret">▾</span>
            </button>
            {langOpen && (
              <div className="lang-dropdown" role="menu" onClick={e => e.stopPropagation()}>
                <div className={`lang-option ${lang === 'en' ? 'active' : ''}`} role="menuitem" onClick={() => { setLang('en'); setLangOpen(false); }}>
                  <span className="lang-radio" aria-hidden></span>
                  <span className="lang-label">English</span>
                </div>
                <div className={`lang-option ${lang === 'es' ? 'active' : ''}`} role="menuitem" onClick={() => { setLang('es'); setLangOpen(false); }}>
                  <span className="lang-radio" aria-hidden></span>
                  <span className="lang-label">Español</span>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-yellow" onClick={() => alert('Contact supplier')}>{t('header.contactSupplier')}</button>
          <button className="btn btn-white" onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth'})}>{t('header.contacts')}</button>
        </div>
      </div>
    </header>
  )
}
