import type { PortfolioItem } from './gallery'

const CATEGORY_LABELS: Record<string, string> = {
  prints: 'Prints',
  stickers: 'Stickers',
  charms: 'Charms',
  zines: 'Zines',
  'graphic-design': 'Design',
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
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect fill="${fill}" width="800" height="1000"/><text x="400" y="500" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#8B7355" opacity="0.5">artwork</text></svg>`
  )}`
}

let dialog: HTMLDialogElement | null = null
let imgEl: HTMLImageElement | null = null
let titleEl: HTMLElement | null = null
let descEl: HTMLElement | null = null
let tagEl: HTMLElement | null = null

let currentItems: PortfolioItem[] = []
let currentIndex = 0

function update() {
  const item = currentItems[currentIndex]
  if (!item || !imgEl || !titleEl || !descEl || !tagEl) return

  imgEl.classList.add('lightbox-img--fading')
  setTimeout(() => {
    imgEl!.src = item.image || placeholderSrc(item.category)
    imgEl!.alt = item.alt
    titleEl!.textContent = item.title
    descEl!.textContent = item.description || ''
    tagEl!.textContent = CATEGORY_LABELS[item.category] || item.category
    imgEl!.classList.remove('lightbox-img--fading')
  }, 150)
}

function prev() {
  currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length
  update()
}

function next() {
  currentIndex = (currentIndex + 1) % currentItems.length
  update()
}

export function openLightbox(items: PortfolioItem[], index: number) {
  if (!dialog) return
  currentItems = items
  currentIndex = index

  const item = currentItems[currentIndex]
  if (!item) return
  imgEl!.src = item.image || placeholderSrc(item.category)
  imgEl!.alt = item.alt
  titleEl!.textContent = item.title
  descEl!.textContent = item.description || ''
  tagEl!.textContent = CATEGORY_LABELS[item.category] || item.category
  imgEl!.classList.remove('lightbox-img--fading')

  dialog.showModal()
}

export function init() {
  dialog = document.getElementById('lightbox') as HTMLDialogElement | null
  if (!dialog) return

  imgEl = dialog.querySelector('.lightbox-img')
  titleEl = dialog.querySelector('.lightbox-title')
  descEl = dialog.querySelector('.lightbox-desc')
  tagEl = dialog.querySelector('.lightbox-tag')

  const closeBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-close')
  const prevBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-prev')
  const nextBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-next')

  closeBtn?.addEventListener('click', () => dialog!.close())
  prevBtn?.addEventListener('click', prev)
  nextBtn?.addEventListener('click', next)

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog!.close()
  })

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  })
}
