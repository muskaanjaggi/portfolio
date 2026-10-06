import { useEffect, useRef } from 'react'
import { magnetic } from '../animations/magnetic'
import { hasFinePointer, prefersReducedMotion } from '../animations/gsap'
import { TransitionLink } from './PageTransition'

/**
 * Tactile pill button that drifts toward the cursor.
 *  <MagneticButton href="/work/x">View project</MagneticButton>          internal (page transition)
 *  <MagneticButton href="https://…" external>GitHub</MagneticButton>      new tab, VISIT cursor
 *  <MagneticButton onClick={fn}>Do thing</MagneticButton>                 <button>
 * `variant`: '' | 'paper' | 'pink' | 'lime' | 'yellow' | 'ghost'
 */
export default function MagneticButton({
  href,
  external = false,
  download,
  variant = '',
  size = '',
  arrow = '↗',
  strength = 0.3,
  className = '',
  children,
  ...rest
}) {
  const wrap = useRef(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return
    return magnetic(wrap.current, { strength })
  }, [strength])

  const cls = ['btn', variant && `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ')
  const inner = (
    <>
      <span data-magnetic-inner>{children}</span>
      {arrow && <span className="btn-arrow" aria-hidden="true">{arrow}</span>}
    </>
  )

  let el
  if (!href) {
    el = <button type="button" className={cls} {...rest}>{inner}</button>
  } else if (external || download !== undefined || href.startsWith('mailto:') || href.endsWith('.pdf')) {
    el = (
      <a
        className={cls}
        href={href}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer', 'data-cursor': 'visit' } : {})}
        {...rest}
      >
        {inner}
        {external && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    )
  } else {
    el = <TransitionLink to={href} className={cls} {...rest}>{inner}</TransitionLink>
  }

  return (
    <span ref={wrap} className="magnetic">
      {el}
    </span>
  )
}
