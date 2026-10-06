import { lazy, Suspense, useCallback, useMemo, useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion, hasFinePointer } from '../animations/gsap'
import { pointerParallax } from '../animations/parallax'
import BloomFallback, { canUseWebGL } from '../three/BloomFallback'
import MagneticButton from '../components/MagneticButton'
import LocalClock from '../components/LocalClock'
import { useEasterEgg } from '../components/EasterEggs'
import { useFinePointer, useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { profile } from '../data/profile'
import './Hero.css'

// Three.js is only downloaded on devices that will actually render it
const WebGLScene = lazy(() => import('../three/WebGLScene'))

const POINTS = 7000

function Letters({ word, className }) {
  return (
    <span className={className} aria-hidden="true">
      {[...word].map((ch, i) => (
        <span className="hero-letter" key={i}>
          <span className="hero-letter-inner">{ch}</span>
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const root = useRef(null)
  const clicks = useRef(0)
  const { toast } = useEasterEgg()
  const fine = useFinePointer()
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const webgl = useMemo(() => canUseWebGL(), [])
  const showGL = fine && !mobile && !reduced && webgl

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const q = gsap.utils.selector(root)
      gsap
        .timeline({ delay: 0.15, defaults: { ease: 'power4.out' } })
        .from(q('.hero-hello'), { y: 30, opacity: 0, duration: 0.8 })
        .from(q('.hero-name--first .hero-letter-inner'), { yPercent: 110, rotate: 6, duration: 1.2, stagger: 0.05 }, '<0.1')
        .from(q('.hero-name--last .hero-letter-inner'), { yPercent: 110, rotate: -6, duration: 1.2, stagger: 0.05 }, '<0.25')
        .from(q('.hero-disc .split-inner'), { yPercent: 110, duration: 0.9, stagger: 0.05 }, '<0.4')
        .from(q('.hero-intro > *'), { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, '<0.2')
        .from(q('.hero-float-inner'), { scale: 0, rotate: -30, duration: 0.9, stagger: 0.08, ease: 'back.out(2)' }, '<')
        .from(q('.hero-meta'), { opacity: 0, duration: 1, stagger: 0.1 }, '<0.2')

      // Hero content drifts up + fades as you scroll away (parallax depth)
      gsap.to(q('.hero-inner'), {
        yPercent: -12,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      if (hasFinePointer()) return pointerParallax(root.current, { amount: 60 })
    },
    { scope: root },
  )

  // Easter egg: poke the name
  const onNameClick = useCallback(() => {
    clicks.current += 1
    const letters = root.current.querySelectorAll('.hero-letter-inner')
    gsap.fromTo(
      letters,
      { y: 0 },
      { y: -40, rotate: () => gsap.utils.random(-15, 15), duration: 0.25, stagger: 0.03, yoyo: true, repeat: 1, ease: 'power2.out' },
    )
    if (clicks.current === 1) toast('you found something :)')
    else if (clicks.current === 5) toast('ok ok, that tickles')
  }, [toast])

  return (
    <section ref={root} className="hero theme-ink" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-blob hero-blob--a" />
        <span className="hero-blob hero-blob--b" />
      </div>

      {showGL ? (
        <Suspense fallback={null}>
          <WebGLScene className="hero-gl" count={POINTS} />
        </Suspense>
      ) : (
        <BloomFallback className="hero-gl hero-gl--svg" />
      )}

      <div className="hero-inner container">
        <div className="hero-top mono hero-meta" aria-hidden="true">
          <span>Portfolio / {new Date().getFullYear()} edition</span>
      
        </div>

        <h1 id="hero-title" className="hero-title" onClick={onNameClick} aria-label={`Hello, I'm ${profile.name}`}>
          <span className="hero-hello serif" aria-hidden="true">Hello, I’m</span>
          <Letters word={profile.firstName.toUpperCase()} className="hero-name hero-name--first display" />
          <Letters word={profile.lastName.toUpperCase()} className="hero-name hero-name--last display" />
        </h1>

        <div className="hero-bottom">
          <p className="hero-disc display" aria-label={profile.title}>
            {profile.discipline.map((d, i) => (
              <span key={d} aria-hidden="true" className={i === profile.discipline.length - 1 ? 'hero-disc-last' : ''}>
                <span className="split-word"><span className="split-inner">{d}</span></span>
                {i < profile.discipline.length - 1 && (
                  <span className="split-word"><span className="split-inner hero-x serif"> × </span></span>
                )}
              </span>
            ))}
          </p>

          <div className="hero-intro">
            <p className="lead">{profile.intro}</p>
            <div className="hero-ctas">
              <MagneticButton href="/#work" variant="paper" arrow="↓">See my work</MagneticButton>
              <MagneticButton href={profile.resume} external variant="ghost" arrow="↗">Resume</MagneticButton>
            </div>
          </div>
        </div>
      </div>

      

      <p className="hero-vertical mono hero-meta" aria-hidden="true">
        BTech Data Science — 2022 → 2028
      </p>

      <a href="#about" className="hero-scroll hero-meta" data-cursor="explore" data-cursor-label="SCROLL ↓" aria-label="Scroll to About">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <path id="circle-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
          </defs>
          <text>
            <textPath href="#circle-path">scroll · keep going · scroll · keep going ·</textPath>
          </text>
        </svg>
        <span className="hero-scroll-arrow">↓</span>
      </a>
    </section>
  )
}
