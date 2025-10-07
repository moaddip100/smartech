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
            <h2>B2B platform</h2>
            <p>We welcome you to join our B2B platform. Please note 
              that the minimum order requirement is 
              10 Euro pallets or one 20’DC</p>
          </div>
          <div className="prev-text">
            <h2>DIY</h2>
            <p>Take control. Do it yourself with SmarTech Spray Foam Insulation.</p>
            <ul>
              <li>Easy and fast to apply</li>
              <li>High-efficiency</li>
              <li>Cost effective. Easy to deliver to rural and hard-to-reach areas</li>
              <li>Safe</li>
              <li>Ecological</li>
            </ul>
          </div>
          <div className="prev-text">
            <h2>Save energy</h2>
            <ul>
              <li>Reduce your heating and cooling bills with High-efficiency thermal Insulation</li>
              <li>Do it today, and stay worry-free for the next 50 years</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
