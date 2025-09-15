import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const I18nContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k })

const dict = {
  en: {
    header: {
      contactSupplier: 'Contact supplier',
      contacts: 'Contacts',
      companySuffix: ' Company',
      platform: 'a business platform',
    },
    hero: {
      paragraph: 'Wright somethin her wright somethin her wright somethin her wright somethin her wright some-thin her wright somethin her',
      contactSupplier: 'Contact supplier',
      contacts: 'Contacts',
    },
    categories: {
      buildingMaterials: 'Building materials',
      thermalInsulation: 'thermal insulation',
      waterproofing: 'waterproofing',
      ppe: 'PPE (Personal Protective Equipment)',
      profCleaningChem: 'professional cleaning chemicals',
    },
    products: {
      buildingTitle: 'Building materials',
      ppeTitle: 'PPE (Personal Protective Equipment)',
      contactSupplier: 'Contact supplier',
      moreInfo: 'More information',
    },
    productPage: {
      backToCatalog: '← Back to catalog',
      getQuote: 'Get a quote >',
      notFound: 'Product not found.',
    }
  },
  es: {
    header: {
      contactSupplier: 'Contactar proveedor',
      contacts: 'Contactos',
      companySuffix: ' Compañía',
      platform: 'una plataforma de negocios',
    },
    hero: {
      paragraph: 'Escribe algo aquí, escribe algo aquí, escribe algo aquí, escribe algo aquí...',
      contactSupplier: 'Contactar proveedor',
      contacts: 'Contactos',
    },
    categories: {
      buildingMaterials: 'Materiales de construcción',
      thermalInsulation: 'aislamiento térmico',
      waterproofing: 'impermeabilización',
      ppe: 'EPP (Equipo de Protección Personal)',
      profCleaningChem: 'químicos de limpieza profesional',
    },
    products: {
      buildingTitle: 'Materiales de construcción',
      ppeTitle: 'EPP (Equipo de Protección Personal)',
      contactSupplier: 'Contactar proveedor',
      moreInfo: 'Más información',
    },
    productPage: {
      backToCatalog: '← Volver al catálogo',
      getQuote: 'Solicitar cotización >',
      notFound: 'Producto no encontrado.',
    }
  }
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useMemo(() => (key) => {
    const parts = key.split('.')
    let cur = dict[lang]
    for (const p of parts) {
      cur = cur?.[p]
      if (cur == null) break
    }
    return (typeof cur === 'string' ? cur : key)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
