import React from 'react'
import prevImg from '../../img/prevImg.png'
import { useI18n } from '../i18n/I18nProvider'

export default function HeroSection() {
  const { t } = useI18n()
  return (
    <section className="hero-section">
      <div className="hero">
        <div className="hero-text">
          <p>
            {t('hero.paragraph')}
          </p>
          <button className="btn btn-yellow hero-button">{t('hero.contactSupplier')}</button>
          <button className="btn btn-white hero-button_secondary" onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth'})}>{t('hero.contacts')}</button>
        </div>
        <div className="hero-image">
          <img src={prevImg} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
