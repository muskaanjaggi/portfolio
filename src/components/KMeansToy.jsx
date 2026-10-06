import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../animations/gsap'

/**
 * A real, tiny experiment: k-means clustering you can poke.
 * Click / tap the canvas to drop points; centroids glide to the
 * mean of their cluster every iteration.
 */
const COLORS = ['#FF4FA3', '#C7F36B', '#FFD84D']
const W = 320
const H = 220

const blob = (cx, cy, n, spread) =>
  Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * spread
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, c: 0 }
  })

const seedPoints = () => [...blob(80, 70, 22, 40), ...blob(230, 80, 22, 40), ...blob(160, 165, 22, 42)]
const seedCentroids = () => COLORS.map(() => ({ x: 30 + Math.random() * (W - 60), y: 30 + Math.random() * (H - 60), tx: 0, ty: 0 }))

export default function KMeansToy() {
  const canvas = useRef(null)
  const state = useRef({ points: seedPoints(), centroids: seedCentroids(), iter: 0 })
  const [iter, setIter] = useState(0)
  const [count, setCount] = useState(state.current.points.length)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    cv.width = W * dpr
    cv.height = H * dpr
    ctx.scale(dpr, dpr)
    const reduced = prefersReducedMotion()

    let raf = 0
    let last = 0
    let visible = true
    const s = state.current
    s.centroids.forEach((c) => ((c.tx = c.x), (c.ty = c.y)))

    const step = () => {
      // Assign
      s.points.forEach((p) => {
        let best = 0
        let bd = Infinity
        s.centroids.forEach((c, i) => {
          const d = (p.x - c.tx) ** 2 + (p.y - c.ty) ** 2
          if (d < bd) (bd = d), (best = i)
        })
        p.c = best
      })
      // Update
      s.centroids.forEach((c, i) => {
        const mine = s.points.filter((p) => p.c === i)
        if (mine.length) {
          c.tx = mine.reduce((a, p) => a + p.x, 0) / mine.length
          c.ty = mine.reduce((a, p) => a + p.y, 0) / mine.length
        }
      })
      s.iter += 1
      setIter(s.iter)
    }

    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (!visible) return
      if (t - last > 700) {
        last = t
        step()
      }
      s.centroids.forEach((c) => {
        c.x += (c.tx - c.x) * (reduced ? 1 : 0.08)
        c.y += (c.ty - c.y) * (reduced ? 1 : 0.08)
      })

      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(255,248,239,0.07)'
      ctx.lineWidth = 1
      for (let x = 20; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 20; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }
      s.points.forEach((p) => {
        const c = s.centroids[p.c]
        ctx.strokeStyle = COLORS[p.c] + '22'
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(c.x, c.y); ctx.stroke()
      })
      s.points.forEach((p) => {
        ctx.fillStyle = COLORS[p.c]
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill()
      })
      s.centroids.forEach((c, i) => {
        ctx.strokeStyle = '#FFF8EF'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(c.x - 7, c.y - 7); ctx.lineTo(c.x + 7, c.y + 7)
        ctx.moveTo(c.x + 7, c.y - 7); ctx.lineTo(c.x - 7, c.y + 7)
        ctx.stroke()
        ctx.fillStyle = COLORS[i]
        ctx.beginPath(); ctx.arc(c.x, c.y, 3, 0, Math.PI * 2); ctx.fill()
      })
    }
    raf = requestAnimationFrame(draw)

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(cv)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  const addPoints = (e) => {
    const r = canvas.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * W
    const y = ((e.clientY - r.top) / r.height) * H
    state.current.points.push(...blob(x, y, 8, 18))
    if (state.current.points.length > 400) state.current.points.splice(0, 8)
    setCount(state.current.points.length)
  }

  const reset = () => {
    const s = state.current
    s.points = seedPoints()
    s.centroids = seedCentroids()
    s.centroids.forEach((c) => ((c.tx = c.x), (c.ty = c.y)))
    s.iter = 0
    setIter(0)
    setCount(s.points.length)
  }

  return (
    <div className="kmeans">
      <canvas
        ref={canvas}
        className="kmeans-canvas"
        onClick={addPoints}
        data-cursor="play"
        data-cursor-label="+ POINTS"
        role="img"
        aria-label={`Interactive k-means clustering with ${count} points and 3 clusters. Click to add points.`}
      />
      <div className="kmeans-bar mono">
        <span>k=3 · n={count} · iter {String(iter).padStart(3, '0')}</span>
        <button type="button" onClick={reset} className="kmeans-reset">
          reset ↺
        </button>
      </div>
    </div>
  )
}
