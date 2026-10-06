import { gsap } from './gsap'

/**
 * Declarative scroll reveals. Call inside a gsap.context / useGSAP scope.
 *
 *   data-reveal="up"       fade + rise
 *   data-reveal="words"    SplitText words slide up (use <SplitText/>)
 *   data-reveal="clip"     clip-path wipe from the bottom
 *   data-reveal="stagger"  direct children rise one after another
 *   data-reveal="line"     horizontal rule draws from the left
 *   data-reveal-delay="0.2"
 *
 * Elements are fully visible without JS / with reduced motion.
 */
export function setupReveals(scope, { immediate = false } = {}) {
  const els = scope.querySelectorAll('[data-reveal]')

  els.forEach((el) => {
    const type = el.getAttribute('data-reveal')
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || 0)
    const scrollTrigger = immediate ? undefined : { trigger: el, start: 'top 88%', once: true }
    const base = { delay, scrollTrigger }

    switch (type) {
      case 'words':
        gsap.from(el.querySelectorAll('.split-inner'), {
          ...base,
          yPercent: 115,
          rotate: 3,
          duration: 1.1,
          stagger: 0.06,
          ease: 'power4.out',
        })
        break
      case 'clip':
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { ...base, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' },
        )
        break
      case 'stagger':
        gsap.from(el.children, { ...base, y: 36, opacity: 0, stagger: 0.08 })
        break
      case 'line':
        gsap.from(el, { ...base, scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power4.inOut' })
        break
      case 'fade':
        gsap.from(el, { ...base, opacity: 0, duration: 1.2 })
        break
      default:
        gsap.from(el, { ...base, y: 40, opacity: 0 })
    }
  })
}
