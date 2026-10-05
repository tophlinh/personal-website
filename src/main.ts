import './style.css'
import { init as initNav } from './modules/navigation'
import { init as initGallery } from './modules/gallery'
import { init as initLightbox } from './modules/lightbox'
import { init as initMetrics } from './modules/metrics'
import { init as initProjects } from './modules/projects'
import { init as initScrollReveal } from './modules/scroll-reveal'

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  initGallery()
  initLightbox()
  initProjects()
  initMetrics()
  initScrollReveal()
})
