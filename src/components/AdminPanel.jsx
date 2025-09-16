import React, { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { CATEGORIES } from '../constants'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'
import { useProductsCtx } from '../context/ProductsContext'
import { translateText, isTranslateConfigured } from '../utils/translate'

export default function AdminPanel({ onLogout }) {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsCtx()
  const { lang } = useI18n()
  const emptyForm = { id: null, title_en: '', title_es: '', description_en: '', description_es: '', category: CATEGORIES[0].value, images: [] }
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(true)
  const [esTitleTouched, setEsTitleTouched] = useState(false)
  const [esDescTouched, setEsDescTouched] = useState(false)
  const titleTimer = useRef()
  const descTimer = useRef()

  function handleInput(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'title_es') setEsTitleTouched(true)
    if (name === 'description_es') setEsDescTouched(true)
  }

  async function filesToBase64(files) {
    const arr = Array.from(files)
    const reads = arr.map(f => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(f)
    }))
    return Promise.all(reads)
  }

  async function handleAddImages(e) {
    const files = e.target.files
    if (!files || !files.length) return
    const imgs = await filesToBase64(files)
    setForm(prev => ({ ...prev, images: [...prev.images, ...imgs] }))
    e.target.value = ''
  }

  function startEdit(p) {
    setForm({
      id: p.id,
      title_en: p.title_en || p.title || '',
      title_es: p.title_es || '',
      description_en: p.description_en || p.description || '',
      description_es: p.description_es || '',
      category: p.category,
      images: p.images || []
    })
    setIsEditing(true)
    setEsTitleTouched(!!(p.title_es))
    setEsDescTouched(!!(p.description_es))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(emptyForm)
    setIsEditing(false)
    setEsTitleTouched(false)
    setEsDescTouched(false)
  }

  function onSubmit(e) {
    e.preventDefault()
  const titleCur = form[`title_${lang}`].trim()
  const descCur = form[`description_${lang}`].trim()
  if (!titleCur) { alert('Enter a title'); return }
  if (!descCur) { alert('Enter a description'); return }
  if (!CATEGORIES.some(c => c.value === form.category)) { alert('Category is not selected'); return }

    const payload = {
      // сохраняем текущую локаль обязательно
      [`title_${lang}`]: titleCur,
      [`description_${lang}`]: descCur,
      // сохраняем вторую локаль если введена
      title_en: form.title_en?.trim() || undefined,
      title_es: form.title_es?.trim() || undefined,
      description_en: form.description_en?.trim() || undefined,
      description_es: form.description_es?.trim() || undefined,
      // фолбэкные поля для обратной совместимости
      title: titleCur,
      description: descCur,
      category: form.category,
      images: form.images || []
    }
    if (isEditing && form.id != null) {
      updateProduct(form.id, payload)
    } else {
      addProduct(payload)
    }
    resetForm()
  }

  // Автоперевод EN→ES с дебаунсом
  useEffect(() => {
    if (!autoTranslate) return
    if (esTitleTouched) return
    const val = form.title_en?.trim()
    if (!val) return
    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(async () => {
      const translated = await translateText(val, 'en', 'es')
      setForm(prev => (prev.title_es ? prev : { ...prev, title_es: translated }))
    }, 500)
    return () => clearTimeout(titleTimer.current)
  }, [form.title_en, autoTranslate, esTitleTouched])

  useEffect(() => {
    if (!autoTranslate) return
    if (esDescTouched) return
    const val = form.description_en?.trim()
    if (!val) return
    clearTimeout(descTimer.current)
    descTimer.current = setTimeout(async () => {
      const translated = await translateText(val, 'en', 'es')
      setForm(prev => (prev.description_es ? prev : { ...prev, description_es: translated }))
    }, 600)
    return () => clearTimeout(descTimer.current)
  }, [form.description_en, autoTranslate, esDescTouched])

  function removeImage(i) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 10px' }}>
  <h2 style={{ margin: 0 }}>Admin panel: Products</h2>
  {onLogout ? <button className="btn btn-white" onClick={onLogout}>Sign out</button> : null}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '8px 0 12px' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={autoTranslate} onChange={(e)=> setAutoTranslate(e.target.checked)} />
          Auto-translate EN → ES
        </label>
        <span style={{ color: '#666', fontSize: 12 }}>Spanish fields will be prefilled automatically when typing English (can be edited).</span>
        {!isTranslateConfigured && (
          <span style={{ color: '#a94442', fontSize: 12 }}>
            Note: translation API is not configured, Spanish fields will mirror English. Set VITE_TRANSLATE_API_URL in .env to enable real translation.
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Title (EN)</label>
            <input name="title_en" value={form.title_en} onChange={handleInput} placeholder="For example: Card 7" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Category</label>
            <select name="category" value={form.category} onChange={handleInput} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Description (EN)</label>
          <textarea name="description_en" value={form.description_en} onChange={handleInput} rows={4} placeholder="Text description" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Title (ES)</label>
            <input name="title_es" value={form.title_es} onChange={handleInput} placeholder="Por ejemplo: Tarjeta 7" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Description (ES)</label>
            <textarea name="description_es" value={form.description_es} onChange={handleInput} rows={4} placeholder="Texto de descripción" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Photos (multiple allowed)</label>
          <input type="file" accept="image/*" multiple onChange={handleAddImages} />
          {form.images?.length ? (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
              {form.images.map((src, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={src} alt={`img-${i}`} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                  <button type="button" onClick={() => removeImage(i)} className="btn btn-white" style={{ position: 'absolute', top: -6, right: -6, padding: '4px 8px' }}>×</button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <button type="submit" className="btn btn-yellow">{isEditing ? 'Save' : 'Create'}</button>
          {isEditing ? <button type="button" className="btn btn-white" onClick={resetForm}>Cancel</button> : null}
          <a href="#" className="btn btn-orange" style={{ textDecoration: 'none' }}>Back to home</a>
        </div>
      </form>

  <h3 style={{ margin: '12px 0' }}>Products list ({products.length})</h3>
      <div style={{ display: 'grid', gap: 12 }}>
        {products.map(p => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '96px 1fr auto', gap: 12, alignItems: 'center', background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
            <div>
              <img src={(p.images && p.images[0]) || (p.category === 'ppe' ? imgCt2 : imgCt)} alt={p.title} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{p.title_en || p.title}</div>
              <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{(CATEGORIES.find(c => c.value === p.category)?.label) || p.category}</div>
              <div style={{ color: '#333', fontSize: 14, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description_en || p.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-white" onClick={() => startEdit(p)}>Edit</button>
              <button className="btn btn-orange" onClick={() => deleteProduct(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}
