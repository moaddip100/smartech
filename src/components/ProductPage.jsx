import React, { useEffect, useRef, useState } from 'react'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'
import { useProductsCtx } from '../context/ProductsContext'
import { useI18n } from '../i18n/I18nProvider'

export default function ProductPage({ id }) {
  const { products } = useProductsCtx()
  const { t, lang } = useI18n()
  const p = products.find(x => x.id === Number(id))
  const fallback = p?.category === 'ppe' ? imgCt2 : imgCt
  const imgs = (p?.images && p.images.length ? p.images : [fallback])
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const closeBtnRef = useRef(null)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [id])

  // Lightbox keyboard and focus management
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') { setLightbox(false) }
      else if (e.key === 'ArrowLeft') { setCurrent(i => (i - 1 + imgs.length) % imgs.length) }
      else if (e.key === 'ArrowRight') { setCurrent(i => (i + 1) % imgs.length) }
    }
    document.addEventListener('keydown', onKey)
    // focus close button
    closeBtnRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [lightbox, imgs.length])

  if (!p) {
    return (
      <main className="container product-page">
        <a className="back-link" href="#" onClick={(e)=>{e.preventDefault(); window.history.back()}}>{t('productPage.backToCatalog')}</a>
        <p>{t('productPage.notFound')}</p>
      </main>
    )
  }

  const nav = (d) => setCurrent(i => (i + d + imgs.length) % imgs.length)

  return (
    <main className="container product-page">
      <a className="back-link" href="#" onClick={(e)=>{e.preventDefault(); window.history.back()}}>{t('productPage.backToCatalog')}</a>
      <div className="product-grid product-page-inner">
        <div className="product-left">
          <div className="left-visuals">
            <div className="thumbs">
              {imgs.map((src, i) => (
                <img key={i} src={src} alt={`thumb-${i}`} className={i===current? 'active': ''} onClick={()=> setCurrent(i)} loading="lazy" />
              ))}
            </div>
            <div className="main-image-card">
              <img className="image-open-btn" src={imgs[current]} alt={p[`title_${lang}`] || p.title} onClick={()=> { setLightbox(true) }} />
            </div>
          </div>
          <button className="quote-btn">{t('productPage.getQuote')}</button>
        </div>
        <div className="product-right">
          <h1 className="product-title">{p[`title_${lang}`] || p.title}</h1>
          <div className="product-section-block">
            <p>{p[`description_${lang}`] || p.description}</p>
          </div>
        </div>
      </div>
      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={p[`title_${lang}`] || p.title} onClick={(e)=>{ if(e.target===e.currentTarget) setLightbox(false) }}>
          <div className="lightbox-content" tabIndex={-1}>
            <button className="lightbox-close" onClick={()=> setLightbox(false)} ref={closeBtnRef} aria-label="Close">✕</button>
            <button className="lightbox-prev" onClick={()=> nav(-1)} aria-label="Previous image">‹</button>
            <img src={imgs[current]} alt={`image-${current}`} />
            <button className="lightbox-next" onClick={()=> nav(1)} aria-label="Next image">›</button>
          </div>
        </div>
      )}
    </main>
  )
}
