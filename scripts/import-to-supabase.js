#!/usr/bin/env node
/**
 * Скрипт для импорта products из JSON в Supabase.
 * Usage:
 *   npm i @supabase/supabase-js
 *   SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_KEY=your-service-role-key node scripts/import-to-supabase.js ./products.json
 *
 * В products.json ожидается массив объектов, схожих с теми, что хранятся в localStorage (smartech_products_v1).
 * Скрипт загрузит base64-изображения в бакет `public` и заменит их на публичные URL, затем вставит/обновит записи в таблице `products`.
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
const BUCKET = process.env.SUPABASE_BUCKET || 'product-images'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY as environment variables (service_role key).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  // service key usage; do not run this in browser
})

async function uploadBase64Image(base64, filename) {
  const m = base64.match(/^data:(image\/.+);base64,(.+)$/)
  if (!m) return null
  const mime = m[1]
  const b64 = m[2]
  const buffer = Buffer.from(b64, 'base64')
  const remotePath = `public/${filename}`
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(remotePath, buffer, { contentType: mime, upsert: true })
  if (upErr) {
    console.error('Upload error', upErr)
    return null
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(remotePath)
  return data.publicUrl
}

async function main() {
  const file = process.argv[2] || './products.json'
  if (!fs.existsSync(file)) {
    console.error('File not found:', file)
    process.exit(1)
  }
  const raw = fs.readFileSync(file, 'utf8')
  const products = JSON.parse(raw)
  if (!Array.isArray(products)) {
    console.error('Expected array in JSON')
    process.exit(1)
  }

  for (const p of products) {
    const prod = { ...p }
    // Normalize images
    if (Array.isArray(prod.images) && prod.images.length) {
      const outImgs = []
      for (let i = 0; i < prod.images.length; i++) {
        const img = prod.images[i]
        if (typeof img === 'string' && img.startsWith('data:')) {
          const ext = img.substring(11, img.indexOf(';')) || 'png'
          const fname = `product-${prod.id || Date.now()}-${i}.${ext.split('/').pop()}`
          const url = await uploadBase64Image(img, fname)
          if (url) outImgs.push(url)
        } else if (typeof img === 'string') {
          outImgs.push(img)
        }
      }
      prod.images = outImgs
    }

    // Remove any functions or circulars
    delete prod.title
    delete prod.description

    // Upsert record into products table. If prod.id exists, will try to upsert by id.
    try {
      const { data, error } = await supabase.from('products').upsert(prod, { onConflict: 'id' })
      if (error) console.error('Upsert error for', prod.id, error)
      else console.log('Upserted', data && data[0] ? data[0].id : '(ok)')
    } catch (e) {
      console.error('Exception upserting', e)
    }
  }
  console.log('Import finished')
}

main().catch(e => { console.error(e); process.exit(1) })
