import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Shared scroll state — read by the marquee, WebGL scene, etc.
 * velocity is in px/ms (smoothed), so ~0–5 in practice.
 */
export const scrollState = { y: 0, velocity: 0, direction: 1, progress: 0 }

let lenis = null

export function initSmoothScroll({ smooth = true } = {}) {
  let lastY = window.scrollY
  let lastT = performance.now()
  let maxScroll = 1

  const measure = () => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  }
  measure()
  window.addEventListener('resize', measure)
  ScrollTrigger.addEventListener('refresh', measure)

  if (smooth) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
  }

  const tick = (time) => {
    if (lenis) lenis.raf(time * 1000)
    const now = performance.now()
    const y = window.scrollY
    const dt = Math.max(now - lastT, 1)
    const raw = (y - lastY) / dt
    scrollState.velocity += (raw - scrollState.velocity) * 0.12
    if (Math.abs(raw) > 0.02) scrollState.direction = raw > 0 ? 1 : -1
    scrollState.y = y
    scrollState.progress = y / maxScroll
    lastY = y
    lastT = now
  }

  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    window.removeEventListener('resize', measure)
    ScrollTrigger.removeEventListener('refresh', measure)
    lenis?.destroy()
    lenis = null
  }
}

/** Scroll to a selector, element or number. Uses Lenis when active. */
export function scrollTo(target, { immediate = false, offset = 0 } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (target !== 0 && !el && typeof target !== 'number') return
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(typeof target === 'number' ? target : el, {
      immediate,
      offset,
      duration: 1.3,
      force: true,
    })
    return
  }
  const top =
    typeof target === 'number' ? target : el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' })
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()
