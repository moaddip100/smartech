import React from 'react'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'
import { useI18n } from '../i18n/I18nProvider'

export default function ProductsListSection({ title, id, products }) {
  const { t } = useI18n()
  return (
    <section className={id === 'section-ppe' ? 'ppe-section' : 'products-section'}>
      <h2 className="section-title" id={id === 'section-ppe' ? 'section-ppe' : '1'}>{title}</h2>
      {products.map(p => (
        <div className="card-container" key={p.id}>
          <a className="card-link" href={`#/product/${p.id}`}>
            <div className="card">
              <div className="card-content">
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <div className="card-buttons">
                  <button className="btn btn-yellow">{t('products.contactSupplier')}</button>
                  <button className="btn btn-orange">{t('products.moreInfo')}</button>
                </div>
              </div>
              <div className="card-image">
                <img src={(p.images && p.images[0]) || (p.category === 'ppe' ? imgCt2 : imgCt)} alt={p.title} loading="lazy" />
              </div>
            </div>
          </a>
        </div>
      ))}
    </section>
  )
}
