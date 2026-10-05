export function init() {
  const bar = document.querySelector<HTMLElement>('.metrics-bar')
  if (!bar) return

  let fired = false
  const observer = new IntersectionObserver(
    (entries) => {
      if (fired) return
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        fired = true
        observer.disconnect()
        animateAll(bar)
      }
    },
    { threshold: 0.3 }
  )
  observer.observe(bar)
}

function animateAll(bar: HTMLElement) {
  const els = bar.querySelectorAll<HTMLElement>('.metric-number')
  els.forEach((el) => {
    const target = Number(el.dataset.target) || 0
    const suffix = el.dataset.suffix || ''
    animateNumber(el, target, suffix)
  })
}

function animateNumber(el: HTMLElement, target: number, suffix: string) {
  const duration = 1200
  let start: number | null = null

  function easeOutExpo(t: number): number {
    return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function tick(timestamp: number) {
    if (start === null) start = timestamp
    const elapsed = timestamp - start
    const progress = Math.min(elapsed / duration, 1)
    const value = Math.round(easeOutExpo(progress) * target)

    el.textContent = value + (progress >= 1 ? suffix : '')

    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
}
