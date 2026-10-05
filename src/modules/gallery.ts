import { openLightbox } from './lightbox'

export interface PortfolioItem {
  id: string
  title: string
  category: 'prints' | 'stickers' | 'charms' | 'zines' | 'graphic-design'
  image: string
  alt: string
  description?: string
}

interface Convention {
  date: string
  name: string
  city: string
}

const PLACEHOLDER_COLORS: Record<string, string> = {
  prints: '#E8DDD4',
  stickers: '#DDE4D8',
  charms: '#D8DDE4',
  zines: '#E4D8DD',
  'graphic-design': '#DDD8E4',
}

function placeholderSrc(category: string): string {
  const fill = PLACEHOLDER_COLORS[category] || '#E8E2DA'
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500"><rect fill="${fill}" width="400" height="500"/><text x="200" y="250" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#8B7355" opacity="0.5">artwork</text></svg>`
  )}`
}

const CATEGORY_LABELS: Record<string, string> = {
  prints: 'Prints',
  stickers: 'Stickers',
  charms: 'Charms',
  zines: 'Zines',
  'graphic-design': 'Design',
}

const items: PortfolioItem[] = [
  { id: 'p1', title: 'Autumn Wanderer', category: 'prints', image: '', alt: 'Autumn wanderer illustration', description: 'A figure walking through golden fields.' },
  { id: 'p2', title: 'Tidal Memory', category: 'prints', image: '', alt: 'Tidal memory illustration', description: 'Waves receding from a coastal town.' },
  { id: 's1', title: 'Mushroom Friends', category: 'stickers', image: '', alt: 'Mushroom sticker set', description: 'A set of forest mushroom stickers.' },
  { id: 's2', title: 'Cat Loaf Series', category: 'stickers', image: '', alt: 'Cat loaf stickers', description: 'Various cats in loaf position.' },
  { id: 'c1', title: 'Crystal Pendant', category: 'charms', image: '', alt: 'Crystal pendant charm', description: 'Acrylic charm with a crystalline design.' },
  { id: 'c2', title: 'Moonphase', category: 'charms', image: '', alt: 'Moon phase charm', description: 'Moon phases on a double-sided charm.' },
  { id: 'z1', title: 'Field Notes Vol. 1', category: 'zines', image: '', alt: 'Field notes zine cover', description: 'A small zine about finding beauty in overlooked places.' },
  { id: 'z2', title: 'Recipes from Nowhere', category: 'zines', image: '', alt: 'Recipe zine cover', description: 'Illustrated comfort food recipes.' },
  { id: 'g1', title: 'Bouldering Poster', category: 'graphic-design', image: '', alt: 'Bouldering event poster', description: 'Event poster for an intro bouldering session.' },
  { id: 'g2', title: 'Find Your Circle', category: 'graphic-design', image: '', alt: 'Community climbing graphic', description: 'Brand graphics for a climbing community.' },
  { id: 'p3', title: 'Forest Floor', category: 'prints', image: '', alt: 'Forest floor illustration', description: 'Moss and ferns on the forest floor.' },
  { id: 's3', title: 'Bread Doodles', category: 'stickers', image: '', alt: 'Bread doodle stickers', description: 'Hand-drawn bakery stickers.' },
]

const conventions: Convention[] = [
  { date: 'Sep 2026', name: 'Anime Expo Artists Alley', city: 'Los Angeles, CA' },
  { date: 'Jun 2026', name: 'Sakura Con', city: 'Seattle, WA' },
  { date: 'Mar 2026', name: 'Emerald City Comic Con', city: 'Seattle, WA' },
  { date: 'Dec 2025', name: 'DesignerCon', city: 'Anaheim, CA' },
  { date: 'Oct 2025', name: 'Portland Zine Fest', city: 'Portland, OR' },
  { date: 'Jul 2025', name: 'SMASH! Sydney', city: 'Sydney, AU' },
]

function renderGallery() {
  const grid = document.getElementById('gallery-grid')
  if (!grid) return

  grid.innerHTML = items
    .map(
      (item, i) => `
    <div class="gallery-item" data-category="${item.category}" data-index="${i}" tabindex="0" role="button" aria-label="View: ${item.title}">
      <div class="gallery-item-visual">
        <img class="gallery-item-img" src="${item.image || placeholderSrc(item.category)}" alt="${item.alt}" loading="lazy" />
      </div>
      <div class="gallery-item-info">
        <p class="gallery-item-title">${item.title}</p>
        <span class="gallery-item-tag tag">${CATEGORY_LABELS[item.category]}</span>
      </div>
    </div>`
    )
    .join('')

  grid.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.gallery-item')
    if (!el) return
    const idx = Number(el.dataset.index)
    const filtered = getVisibleItems()
    const pos = filtered.findIndex((item) => item === items[idx])
    openLightbox(filtered, pos >= 0 ? pos : 0)
  })

  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const el = e.target as HTMLElement
    if (!el.classList.contains('gallery-item')) return
    e.preventDefault()
    el.click()
  })
}

function getVisibleItems(): PortfolioItem[] {
  const active = document.querySelector<HTMLButtonElement>('.filter-btn.active')
  const filter = active?.dataset.filter || 'all'
  return filter === 'all' ? items : items.filter((item) => item.category === filter)
}

function initFilters() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('.filter-btn')
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active')
        b.setAttribute('aria-selected', 'false')
      })
      btn.classList.add('active')
      btn.setAttribute('aria-selected', 'true')

      const filter = btn.dataset.filter || 'all'
      const allItems = document.querySelectorAll<HTMLElement>('.gallery-item')

      allItems.forEach((el) => {
        const match = filter === 'all' || el.dataset.category === filter
        if (!match) el.classList.add('filtering-out')
      })

      setTimeout(() => {
        allItems.forEach((el) => {
          const match = filter === 'all' || el.dataset.category === filter
          el.style.display = match ? '' : 'none'
          el.classList.remove('filtering-out')
        })
      }, 200)
    })
  })
}

function renderConventions() {
  const list = document.getElementById('convention-list')
  if (!list) return

  list.innerHTML = conventions
    .map(
      (c) => `
    <li class="convention-item">
      <span class="convention-dot" aria-hidden="true"></span>
      <span class="convention-name">${c.name}</span>
      <span class="convention-detail">${c.city} &middot; ${c.date}</span>
    </li>`
    )
    .join('')
}

export function init() {
  renderGallery()
  initFilters()
  renderConventions()
}
