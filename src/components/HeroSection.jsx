import React, { useEffect, useState } from 'react'
import prevImg from '../../img/prevImg.png'
import photo1 from '../../img/photo_2025-08-27_12-01-07.jpg'
import photo2 from '../../img/photo_2025-08-27_12-01-09.jpg'
import { useI18n } from '../i18n/I18nProvider'

export default function HeroSection() {
  const { t } = useI18n()
  const images = [prevImg, photo1, photo2]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % images.length)
    }, 1000)
    return () => clearInterval(id)
  }, [])
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
          {images.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" className={i === idx ? 'active' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}
