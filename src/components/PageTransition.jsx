import { createContext, forwardRef, useCallback, useContext, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { coverPage, revealPage } from '../animations/pageTransition'
import { prefersReducedMotion } from '../animations/gsap'
import { scrollTo } from '../animations/smoothScroll'
import './PageTransition.css'

const TransitionContext = createContext({ go: () => {} })
export const useTransitionNav = () => useContext(TransitionContext)

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))

/**
 * Wraps the router so any internal navigation can play the wipe:
 *   const { go } = useTransitionNav(); go('/work/slug', { label: 'Title' })
 * Same-page hash links (/#work while on /) just smooth-scroll.
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const locRef = useRef(location)
  locRef.current = location
  const overlay = useRef(null)
  const busy = useRef(false)
  const [label, setLabel] = useState('')

  const go = useCallback(
    async (to, { label: nextLabel = '' } = {}) => {
      if (busy.current) return
      const url = new URL(to, window.location.origin)
      const current = locRef.current

      if (url.pathname === current.pathname) {
        scrollTo(url.hash ? url.hash : 0)
        window.history.replaceState(window.history.state, '', url.pathname + url.hash)
        return
      }

      if (prefersReducedMotion()) {
        navigate(url.pathname + url.hash)
        return
      }

      busy.current = true
      setLabel(nextLabel)
      await coverPage(overlay.current)
      navigate(url.pathname + url.hash)
      await nextFrame()
      await revealPage(overlay.current)
      busy.current = false
    },
    [navigate],
  )

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={overlay} className="pt-overlay" aria-hidden="true">
        <div className="pt-panel pt-panel--pink" />
        <div className="pt-panel pt-panel--yellow" />
        <div className="pt-panel pt-panel--ink">
          <span className="pt-label display">{label || 'Loading'}</span>
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

/** Drop-in <a> that plays the page transition for internal routes. */
export const TransitionLink = forwardRef(function TransitionLink(
  { to, label, onClick, children, ...rest },
  ref,
) {
  const { go } = useTransitionNav()
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    go(to, { label })
  }
  return (
    <a ref={ref} href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
})
