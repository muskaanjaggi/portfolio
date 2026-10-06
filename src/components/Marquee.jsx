import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { scrollState } from '../animations/smoothScroll'
import './Marquee.css'

/**
 * Infinite ticker. Speed gets a kick from scroll velocity and the
 * direction follows the scroll direction. Pauses when off-screen.
 *   <Marquee items={['Data','Design']} tone="pink" speed={60} />
 */
export default function Marquee({ items, speed = 60, tone = 'ink', size = 'lg', separator = '•', reverse = false, tilt = 0 }) {
  const track = useRef(null)
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = track.current
    let x = 0
    let half = el.scrollWidth / 2
    let visible = true
    const base = reverse ? 1 : -1
    const setX = gsap.quickSetter(el, 'x', 'px')

    const tick = (_, dt) => {
      if (!visible) return
      const boost = 1 + Math.min(Math.abs(scrollState.velocity) * 4, 8)
      const dir = base * scrollState.direction
      x += (dir * speed * boost * dt) / 1000
      if (x <= -half) x += half
      if (x > 0) x -= half
      setX(x)
    }

    const ro = new ResizeObserver(() => (half = el.scrollWidth / 2))
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(root.current)
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      io.disconnect()
    }
  }, [speed, reverse])

  const row = (key) => (
    <div className="marquee-group" key={key} aria-hidden={key > 0 || undefined}>
      {items.map((item, i) => (
        <span className="marquee-item" key={i}>
          <span className={i % 3 === 1 ? 'serif' : ''}>{item}</span>
          <span className="marquee-sep" aria-hidden="true">{separator}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div
      ref={root}
      className={`marquee marquee--${tone} marquee--${size}`}
      style={{ '--tilt': `${tilt}deg` }}
      role="marquee"
      aria-label={items.join(', ')}
    >
      <div ref={track} className="marquee-track">
        {row(0)}
        {row(1)}
        {row(2)}
        {row(3)}
      </div>
    </div>
  )
}
