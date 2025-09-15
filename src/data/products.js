import imgCt from '../../img/imgCt.png'
import imgCt2 from '../../img/imgCt2.png'

const normalizeToFive = (arr) => {
  if (!arr || arr.length === 0) return [imgCt, imgCt, imgCt, imgCt, imgCt]
  const out = []
  while (out.length < 5) {
    out.push(arr[out.length % arr.length])
  }
  return out
}

export const PRODUCTS = [
  {
    id: 1,
    title: 'Card 1',
    price: '—',
    desc: 'Wright somethin her wright somethin her...',
    images: normalizeToFive([imgCt2, imgCt, imgCt])
  },
  {
    id: 2,
    title: 'Card 2',
    price: '—',
    desc: 'Wright somethin her wright somethin her...',
    images: normalizeToFive([imgCt, imgCt])
  },
  {
    id: 3,
    title: 'Card 3',
    price: '—',
    desc: 'Wright somethin her wright somethin her...',
    images: normalizeToFive([imgCt])
  },
  {
    id: 4,
    title: 'Card 4',
    price: '—',
    desc: 'Wright somethin her wright somethin her...',
    images: normalizeToFive([imgCt2])
  },
  {
    id: 5,
    title: 'Card 5',
    price: '—',
    desc: 'Wright somethin her wright somethin her...',
    images: normalizeToFive([imgCt2])
  },
  {
    id: 6,
    title: 'Card 6',
    price: '—',
    desc: 'Wright somethin her wright somethin her...',
    images: normalizeToFive([imgCt2])
  }
]

export function getProductById(id) {
  const pid = Number(id)
  return PRODUCTS.find(p => p.id === pid)
}
