import React from 'react'
import { useProductsCtx } from '../context/ProductsContext'
import { useI18n } from '../i18n/I18nProvider'
import HeroSection from './HeroSection'
import CategoriesSection from './CategoriesSection'
import ProductsListSection from './ProductsListSection'

export default function HomePage() {
  const { products } = useProductsCtx()
  const { t } = useI18n()
  const building = products.filter(p => p.category === 'building')
  const ppe = products.filter(p => p.category === 'ppe')
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsListSection id="section-building" title={t('products.buildingTitle')} products={building} />
      <ProductsListSection id="section-ppe" title={t('products.ppeTitle')} products={ppe} />
    </>
  )
}
