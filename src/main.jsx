import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n/I18nProvider'

// Global styles from existing project
import '../styles/index.css'
import '../styles/SiteHeader.css'
import '../styles/HeroSection.css'
import '../styles/CategoriesSection.css'
import '../styles/ProductsSection.css'
import '../styles/PPESection.css'
import '../styles/Footer.css'
import '../styles/ProductPage.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
)
