import { gsap } from './gsap'

/**
 * Custom cursor controller.
 *
 * Any element can opt into a cursor state with data attributes:
 *   data-cursor="view"      → VIEW ↗       (project cards)
 *   data-cursor="explore"   → EXPLORE
 *   data-cursor="open"      → OPEN         (images)
 *   data-cursor="visit"     → VISIT ↗      (external links)
 *   data-cursor="drag"      → DRAG         (draggable things)
 *   data-cursor="hide"      → hides the cursor
 *   data-cursor-label="HI"  → custom text
 * Links & buttons without a data-cursor get the "link" state automatically.
 */

const LABELS = {
  view: 'View ↗',
  explore: 'Explore',
  open: 'Open',
  visit: 'Visit ↗',
  drag: '← Drag →',
  play: 'Play',
}

const STATES = ['link', 'hide', 'text', 'pressed', 'labelled', ...Object.keys(LABELS)]

export function initCursor({ root, dot, ring, label }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 })

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
  const ringX = gsap.quickTo(ring, 'x', { duration: reduced ? 0.12 : 0.55, ease: 'power3' })
  const ringY = gsap.quickTo(ring, 'y', { duration: reduced ? 0.12 : 0.55, ease: 'power3' })

  let visible = false
  let current = ''

  const setState = (state, text = '') => {
    if (state === current && label.textContent === text) return
    STATES.forEach((s) => root.classList.remove(`is-${s}`))
    if (state) root.classList.add(`is-${state}`)
    if (text) root.classList.add('is-labelled')
    label.textContent = text
    current = state
  }

  const onMove = (e) => {
    if (!visible) {
      visible = true
      root.classList.add('is-visible')
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
    }
    dotX(e.clientX)
    dotY(e.clientY)
    ringX(e.clientX)
    ringY(e.clientY)
  }

  const onOver = (e) => {
    const t = e.target instanceof Element ? e.target : null
    if (!t) return
    const tagged = t.closest('[data-cursor]')
    if (tagged) {
      const type = tagged.getAttribute('data-cursor')
      const text = tagged.getAttribute('data-cursor-label') ?? LABELS[type] ?? ''
      setState(type, text)
      return
    }
    if (t.closest('input, textarea, [contenteditable="true"]')) return setState('text')
    if (t.closest('a, button, [role="button"], label, select, summary')) return setState('link')
    setState('')
  }

  const onDown = () => root.classList.add('is-pressed')
  const onUp = () => root.classList.remove('is-pressed')
  const onLeave = () => {
    visible = false
    root.classList.remove('is-visible')
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  document.documentElement.addEventListener('pointerleave', onLeave)

  return {
    reset: () => setState(''),
    destroy() {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    },
  }
}
