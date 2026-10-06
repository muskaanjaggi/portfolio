import { useGSAP, prefersReducedMotion } from '../animations/gsap'
import { setupReveals } from '../animations/reveal'
import { setupParallax } from '../animations/parallax'

/**
 * Wire up declarative [data-reveal] and [data-parallax] animations
 * inside a section. useGSAP scopes + reverts everything on unmount.
 */
export function useSectionAnimations(ref, extra) {
  useGSAP(
    (ctx, contextSafe) => {
      if (!ref.current || prefersReducedMotion()) return
      setupReveals(ref.current)
      setupParallax(ref.current)
      return extra?.(ref.current, contextSafe)
    },
    { scope: ref },
  )
}
