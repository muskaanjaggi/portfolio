import { useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger, prefersReducedMotion, hasFinePointer } from './animations/gsap'
import { initSmoothScroll, scrollTo } from './animations/smoothScroll'
import { TransitionProvider } from './components/PageTransition'
import { EasterEggProvider } from './components/EasterEggs'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import NotFound from './pages/NotFound'

/** Jump to top (or #hash) whenever the route changes. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      // wait a frame so the new page has rendered
      requestAnimationFrame(() => {
        ScrollTrigger.refresh() // pinned sections add height — measure first
        scrollTo(hash, { immediate: true })
      })
    } else {
      scrollTo(0, { immediate: true })
    }
    // Fonts & images change layout — recalc trigger positions once settled
    const id = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(id)
  }, [pathname, hash])

  return null
}

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    // Smooth scrolling only for mouse/trackpad users who haven't asked for less motion
    const destroy = initSmoothScroll({ smooth: hasFinePointer() && !prefersReducedMotion() })
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    // Re-measure scroll animations whenever the page height changes (late images,
    // fonts, content edits) — otherwise pinned sections drift and overlap the next one.
    let timer = 0
    let lastHeight = 0
    const ro = new ResizeObserver(([entry]) => {
      const h = Math.round(entry.contentRect.height)
      if (h === lastHeight) return
      lastHeight = h
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.getElementById('main'))

    return () => {
      ro.disconnect()
      clearTimeout(timer)
      destroy()
    }
  }, [])

  return (
    <TransitionProvider>
      <EasterEggProvider>
        <a className="skip-link" href="#main">Skip to content</a>
        <ScrollManager />
        <CustomCursor />
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <div className="grain" aria-hidden="true" />
      </EasterEggProvider>
    </TransitionProvider>
  )
}
