import React from 'react'
import { useI18n } from '../i18n/I18nProvider'

export default function CategoriesSection() {
  const { t } = useI18n()
  return (
    <section className="categories-section">
      <div className="container">
        <div className="sidebar">
          <ul>
            <li><a href="#section-building" style={{ fontWeight: 'bold' }}>{t('categories.buildingMaterials')}</a></li>
            <li><span className="category-inactive" aria-disabled="true">{t('categories.thermalInsulation')}</span></li>
            <li><span className="category-inactive" aria-disabled="true">{t('categories.waterproofing')}</span></li>
            <li><a href="#section-ppe" style={{ fontWeight: 'bold' }}>{t('categories.ppe')}</a></li>
            <li><span className="category-inactive" aria-disabled="true">{t('categories.profCleaningChem')}</span></li>
          </ul>
        </div>
        <div className="cards">
          <div id="section-building" className="prev-text">
            <h2>Text1</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam blanditiis consequuntur quod?</p>
          </div>
          <div className="prev-text">
            <h2>Text2</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam blanditiis consequuntur quod?</p>
          </div>
          <div className="prev-text">
            <h2>Text3</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam blanditiis consequuntur quod?</p>
          </div>
        </div>
      </div>
    </section>
  )
}
