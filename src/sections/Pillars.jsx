import { useEffect, useRef } from 'react'
import { pillars } from '../data/profile'
import './Pillars.css'

/**
 * Build / Think / Create — a horizontal scroll on desktop, a calm vertical
 * stack on phones and for reduced motion.
 *
 * The "pin" is plain CSS `position: sticky`, so the browser locks the panels
 * exactly when the section's top reaches the top of the screen — nothing is
 * pre-measured, so nothing can go stale. The sideways offset is worked out
 * live, every frame, from where the section actually is right now.
 */
const DESKTOP = '(min-width: 901px) and (prefers-reduced-motion: no-preference)'

export default function Pillars() {
  const root = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const section = root.current
    const rail = track.current
    const mq = window.matchMedia(DESKTOP)
    const nums = [...section.querySelectorAll('.pillar-num')]
    let distance = 0
    let x = 0
    let raf = 0
    let visible = false

    // Section height = one screen + however far the track has to slide
    const measure = () => {
      distance = mq.matches ? Math.max(0, rail.scrollWidth - window.innerWidth) : 0
      section.style.height = mq.matches ? `calc(100svh + ${distance}px)` : ''
      if (!mq.matches) {
        rail.style.transform = ''
        nums.forEach((n) => (n.style.transform = ''))
      }
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!mq.matches) return
      const r = section.getBoundingClientRect()
      const travel = r.height - window.innerHeight
      const progress = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0
      x += (-progress * distance - x) * 0.18 // light easing, like a scrub
      if (Math.abs(x + progress * distance) < 0.1) x = -progress * distance
      rail.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
      // Each big number counter-rotates as its card crosses the screen
      nums.forEach((n) => {
        const c = n.parentElement.getBoundingClientRect()
        const q = (c.left + c.width / 2) / window.innerWidth - 0.5
        n.style.transform = `rotate(${(-q * 20).toFixed(2)}deg) translateY(${(q * 30).toFixed(1)}%)`
      })
    }

    // Only animate while the section is on (or near) the screen
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting
        cancelAnimationFrame(raf)
        if (visible) raf = requestAnimationFrame(tick)
      },
      { rootMargin: '200px 0px' },
    )
    const ro = new ResizeObserver(measure)

    measure()
    io.observe(section)
    ro.observe(rail)
    window.addEventListener('resize', measure)
    mq.addEventListener('change', measure)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('resize', measure)
      mq.removeEventListener('change', measure)
      section.style.height = ''
    }
  }, [])

  return (
    <section ref={root} className="pillars theme-ink" aria-labelledby="pillars-title">
      <div className="pillars-sticky">
        <div ref={track} className="pillars-track">
          <div className="pillars-intro">
            <p className="eyebrow">In ten seconds</p>
            <h2 id="pillars-title" className="display pillars-title">
              Three <span className="serif">things</span> to know
              <span className="pillars-arrow" aria-hidden="true">
                →
              </span>
            </h2>
          </div>

          {pillars.map((p) => (
            <article key={p.number} className={`pillar c-${p.color}`}>
              <span className="pillar-num display" aria-hidden="true">
                {p.number}
              </span>
              <div className="pillar-body">
                <p className="mono pillar-label">{p.number} / 03</p>
                <h3 className="display pillar-title">
                  I can <span className="serif">{p.verb.toLowerCase()}.</span>
                </h3>
                <p className="pillar-text">{p.body}</p>
                <ul role="list" className="tag-list">
                  {p.tags.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
