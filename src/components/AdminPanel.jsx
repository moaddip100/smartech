import React, { useState } from 'react'
import { CATEGORIES } from '../constants'
import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'
import { useProductsCtx } from '../context/ProductsContext'

export default function AdminPanel({ onLogout }) {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsCtx()
  const emptyForm = { id: null, title: '', description: '', category: CATEGORIES[0].value, images: [] }
  const [form, setForm] = useState(emptyForm)
  const [isEditing, setIsEditing] = useState(false)

  function handleInput(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
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
    setForm({ id: p.id, title: p.title, description: p.description, category: p.category, images: p.images || [] })
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(emptyForm)
    setIsEditing(false)
  }

  function onSubmit(e) {
    e.preventDefault()
  if (!form.title.trim()) { alert('Enter a title'); return }
  if (!form.description.trim()) { alert('Enter a description'); return }
  if (!CATEGORIES.some(c => c.value === form.category)) { alert('Category is not selected'); return }

    const payload = { title: form.title.trim(), description: form.description.trim(), category: form.category, images: form.images || [] }
    if (isEditing && form.id != null) {
      updateProduct(form.id, payload)
    } else {
      addProduct(payload)
    }
    resetForm()
  }

  function removeImage(i) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 10px' }}>
  <h2 style={{ margin: 0 }}>Admin panel: Products</h2>
  {onLogout ? <button className="btn btn-white" onClick={onLogout}>Sign out</button> : null}
      </div>

      <form onSubmit={onSubmit} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 16, boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Title</label>
            <input name="title" value={form.title} onChange={handleInput} placeholder="For example: Card 7" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }} />
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
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Description</label>
          <textarea name="description" value={form.description} onChange={handleInput} rows={4} placeholder="Text description" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }} />
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
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>{(CATEGORIES.find(c => c.value === p.category)?.label) || p.category}</div>
              <div style={{ color: '#333', fontSize: 14, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</div>
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

  function startEdit(p) {
    setForm({ id: p.id, title: p.title, description: p.description, category: p.category, images: p.images || [] })
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
