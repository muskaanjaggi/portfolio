import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { startScroll, stopScroll } from '../animations/smoothScroll'
import { TransitionLink, useTransitionNav } from './PageTransition'
import { profile } from '../data/profile'
import { nav } from '../data/site'
import { socials } from '../data/social'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menu = useRef(null)
  const toggle = useRef(null)
  const { go } = useTransitionNav()
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu on route change
  useEffect(() => setOpen(false), [pathname])

  // Mobile menu animation + a11y (Escape, focus, scroll lock)
  useEffect(() => {
    const el = menu.current
    if (!el) return
    const reduced = prefersReducedMotion()
    if (open) {
      stopScroll()
      document.body.style.overflow = 'hidden'
      el.hidden = false
      gsap.fromTo(
        el,
        { clipPath: 'circle(0% at 92% 40px)' },
        { clipPath: 'circle(150% at 92% 40px)', duration: reduced ? 0 : 0.7, ease: 'power3.inOut' },
      )
      gsap.from(el.querySelectorAll('.menu-link-inner'), {
        yPercent: 110,
        duration: reduced ? 0 : 0.8,
        stagger: 0.06,
        delay: reduced ? 0 : 0.2,
        ease: 'power4.out',
      })
      el.querySelector('a')?.focus()
      const onKey = (e) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    } else if (!el.hidden) {
      startScroll()
      document.body.style.overflow = ''
      gsap.to(el, {
        clipPath: 'circle(0% at 92% 40px)',
        duration: reduced ? 0 : 0.5,
        ease: 'power3.inOut',
        onComplete: () => (el.hidden = true),
      })
      toggle.current?.focus()
    }
  }, [open])

  const onNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    go(href)
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-bar">
        <TransitionLink to="/" label="Hello" className="nav-logo" aria-label={`${profile.name} — home`}>
          <span className="nav-logo-mark" aria-hidden="true">✳</span>
          <span className="nav-logo-text">{profile.firstName}</span>
        </TransitionLink>

        <p className="nav-status mono" aria-label={`Status: ${profile.status}`}>
          <span className="nav-status-dot" aria-hidden="true" />
          <span className="nav-status-label">Status</span>
          <span>{profile.status}</span>
        </p>

        <nav className="nav-links" aria-label="Primary">
          <ul role="list">
            {nav.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="nav-link mono" onClick={(e) => onNav(e, item.href)}>
                  <span className="nav-link-clip">
                    <span className="nav-link-text" data-text={item.label}>{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="nav-resume mono"
          href={profile.resume}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="open"
          data-cursor-label="PDF ↗"
        >
          Resume <span aria-hidden="true">↗</span>
          <span className="visually-hidden"> (PDF, opens in a new tab)</span>
        </a>

        <button
          ref={toggle}
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="nav-toggle-line" aria-hidden="true" />
          <span className="nav-toggle-line" aria-hidden="true" />
        </button>
      </div>

      <div ref={menu} id="mobile-menu" className="menu theme-ink" hidden role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Mobile">
          <ul role="list" className="menu-list">
            {nav.map((item, i) => (
              <li key={item.label}>
                <a href={item.href} className="menu-link display" onClick={(e) => onNav(e, item.href)}>
                  <span className="menu-link-inner">
                    <span className="menu-num mono">0{i + 1}</span>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-foot">
          <a className="btn btn--pink" href={profile.resume} target="_blank" rel="noopener noreferrer">
            Resume <span aria-hidden="true">↗</span>
          </a>
          <ul role="list" className="menu-socials mono">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mono muted">{profile.locationShort} · {profile.coordinates}</p>
        </div>
      </div>
    </header>
  )
}
