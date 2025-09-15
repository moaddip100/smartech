import React, { useMemo, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../data/products'
import Layout from './Layout'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import { useI18n } from '../i18n/I18nProvider'

export default function ProductCard() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const product = useMemo(() => getProductById(id) || getProductById(1), [id])
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [id])

  if (!product) return (
    <div className="container product-page">
      <a className="back-link" href="#" onClick={(e)=>{e.preventDefault(); navigate(-1)}}>{t('productPage.backToCatalog')}</a>
      <p>{t('productPage.notFound')}</p>
    </div>
  )

  const images = product.images

  const openLb = (idx) => { setCurrent(idx); setLightbox(true) }
  const closeLb = () => setLightbox(false)
  const navLb = (d) => setCurrent(i => (i + d + images.length) % images.length)

  return (
    <Layout>
      <SiteHeader />
      <main className="container product-page">
  <a className="back-link" href="#" onClick={(e)=>{e.preventDefault(); navigate(-1)}}>{t('productPage.backToCatalog')}</a>

      <div className="product-grid product-page-inner">
        <div className="product-left">
          <div className="left-visuals">
            <div className="thumbs">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`thumb-${i}`} className={i===current? 'active': ''} onClick={()=> setCurrent(i)} />
              ))}
            </div>
            <div className="main-image-card">
              <img className="image-open-btn" src={images[current]} alt={product.title} onClick={()=> openLb(current)} />
            </div>
          </div>
          <button className="quote-btn">{t('productPage.getQuote')}</button>
        </div>
        <div className="product-right">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-section-block">
            <p>{product.desc}</p>
          </div>
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={(e)=>{ if(e.target===e.currentTarget) closeLb() }}>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLb}>✕</button>
            <button className="lightbox-prev" onClick={()=> navLb(-1)}>‹</button>
            <img src={images[current]} alt={`image-${current}`} />
            <button className="lightbox-next" onClick={()=> navLb(1)}>›</button>
          </div>
        </div>
      )}
      </main>
      <Footer />
    </Layout>
  )
}
