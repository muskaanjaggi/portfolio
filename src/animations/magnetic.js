import { gsap } from './gsap'

/**
 * Makes an element drift toward the cursor when it gets close.
 * `strength` = fraction of the cursor offset the element follows.
 * `reach`    = extra px around the element where the pull starts.
 * An optional child with [data-magnetic-inner] moves a little further
 * for a subtle parallax feel.
 */
export function magnetic(el, { strength = 0.3, reach = 40 } = {}) {
  const inner = el.querySelector('[data-magnetic-inner]')
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
  const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' })
  const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' })
  let active = false

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    const inside =
      e.clientX > r.left - reach &&
      e.clientX < r.right + reach &&
      e.clientY > r.top - reach &&
      e.clientY < r.bottom + reach

    if (inside) {
      active = true
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      ixTo?.(dx * strength * 0.4)
      iyTo?.(dy * strength * 0.4)
    } else if (active) {
      active = false
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)', overwrite: true })
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)', overwrite: true })
    }
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  return () => {
    window.removeEventListener('pointermove', onMove)
    gsap.killTweensOf([el, inner].filter(Boolean))
  }
}
