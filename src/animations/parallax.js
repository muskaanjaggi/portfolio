import { gsap } from './gsap'

/**
 * Scroll parallax: <div data-parallax="0.3"> moves at a different speed
 * than the page. Positive = slower (drifts down), negative = faster.
 * Call inside a gsap.context / useGSAP scope.
 */
export function setupParallax(scope) {
  scope.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2
    gsap.fromTo(
      el,
      { y: () => -speed * 120 },
      {
        y: () => speed * 120,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('[data-parallax-root]') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  })
}

/**
 * Pointer parallax: children with data-depth="0.5" follow the mouse.
 * Returns a cleanup function.
 */
export function pointerParallax(scope, { amount = 30 } = {}) {
  const items = [...scope.querySelectorAll('[data-depth]')].map((el) => {
    const depth = parseFloat(el.getAttribute('data-depth')) || 0.2
    return {
      depth,
      x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }),
      y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }),
    }
  })

  const onMove = (e) => {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    items.forEach(({ depth, x, y }) => {
      x(nx * amount * depth)
      y(ny * amount * depth)
    })
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  return () => window.removeEventListener('pointermove', onMove)
}
