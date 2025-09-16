import React, { useState } from 'react'
import iconSpa from '../../img/icon/iconSpa.png'
import iconEng from '../../img/icon/iconEng.png'
import { useI18n } from '../i18n/I18nProvider'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useI18n()
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo" onClick={() => { window.location.hash = ''; window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <h1>
            <span className="logo-brand" aria-label="SMARTECH">SMARTECH</span>
            <span className="logo-suffix">{t('header.companySuffix')}</span>
          </h1>
          <p className="logo-platform">{t('header.platform')}</p>
        </div>
        <button
          className={`mobile-toggle ${open ? 'open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className="hamburger"></span>
        </button>
        <div className={`header-actions ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
          <img src={iconSpa} alt="Spain flag" className={`flag ${lang==='es'?'active':''}`} style={{ cursor: 'pointer' }} onClick={() => setLang('es')} aria-label="Switch to Spanish" title="Español" />
          <img src={iconEng} alt="UK flag" className={`flag ${lang==='en'?'active':''}`} style={{ cursor: 'pointer' }} onClick={() => setLang('en')} aria-label="Switch to English" title="English" />
          <button className="btn btn-yellow" onClick={() => alert('Contact supplier')}>{t('header.contactSupplier')}</button>
          <button className="btn btn-white" onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth'})}>{t('header.contacts')}</button>
        </div>
      </div>
    </header>
  )
}
