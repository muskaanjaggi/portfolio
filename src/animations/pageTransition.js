import { gsap } from './gsap'

/**
 * Page wipe: three coloured panels sweep up to cover the page,
 * the route changes underneath, then they continue up and away.
 * Total ≈ 0.9s so it never gets in the way.
 */
export function coverPage(overlay) {
  const panels = overlay.querySelectorAll('.pt-panel')
  const label = overlay.querySelector('.pt-label')
  overlay.style.visibility = 'visible'
  return gsap
    .timeline()
    .set(panels, { yPercent: 100, y: 0 })
    .set(label, { opacity: 0, y: 20 })
    .to(panels, { yPercent: 0, duration: 0.5, stagger: 0.06, ease: 'power3.inOut' })
    .to(label, { opacity: 1, y: 0, duration: 0.25 }, '-=0.2')
    .then()
}

export function revealPage(overlay) {
  const panels = overlay.querySelectorAll('.pt-panel')
  const label = overlay.querySelector('.pt-label')
  return gsap
    .timeline({ onComplete: () => (overlay.style.visibility = 'hidden') })
    .to(label, { opacity: 0, y: -20, duration: 0.2 })
    .to([...panels].reverse(), { yPercent: -100, duration: 0.55, stagger: 0.06, ease: 'power3.inOut' }, '<0.05')
    .then()
}
