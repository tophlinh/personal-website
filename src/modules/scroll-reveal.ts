export function init() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('revealed'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        const delay = Number(el.dataset.revealDelay) || 0
        el.style.transitionDelay = `${delay * 100}ms`
        el.classList.add('revealed')
        observer.unobserve(el)
      }
    },
    { threshold: 0.15 }
  )

  els.forEach((el) => observer.observe(el))
}
