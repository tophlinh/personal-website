export function init() {
  const header = document.getElementById('site-header')
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle')
  const menu = document.getElementById('nav-menu')
  const links = document.querySelectorAll<HTMLAnchorElement>('.nav-link')
  if (!header || !toggle || !menu) return

  // Sticky show/hide
  let lastY = window.scrollY
  let ticking = false

  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      if (y > 80 && y > lastY) {
        header.classList.add('header--hidden')
      } else {
        header.classList.remove('header--hidden')
      }
      lastY = y
      ticking = false
    })
  })

  // Scroll-spy
  const sections = document.querySelectorAll<HTMLElement>('section[id]')
  const spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const id = entry.target.id
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        })
      }
    },
    { rootMargin: '-40% 0px -60% 0px' }
  )
  sections.forEach((s) => spy.observe(s))

  // Smooth scroll
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const id = link.getAttribute('href')
      if (!id) return
      const target = document.querySelector(id)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', id)
      closeMenu()
    })
  })

  // Logo link
  const logo = document.querySelector<HTMLAnchorElement>('.nav-logo')
  logo?.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.getElementById('home')
    target?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', '#home')
    closeMenu()
  })

  // Mobile menu
  function closeMenu() {
    toggle!.setAttribute('aria-expanded', 'false')
    menu!.classList.remove('open')
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true'
    toggle.setAttribute('aria-expanded', String(!open))
    menu.classList.toggle('open', !open)
    if (!open) {
      const first = menu.querySelector<HTMLAnchorElement>('a')
      first?.focus()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu()
      toggle.focus()
    }
  })

  // Focus trap in mobile menu
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !menu.classList.contains('open')) return
    const focusable = menu.querySelectorAll<HTMLElement>('a')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  })
}
