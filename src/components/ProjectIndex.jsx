import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, hasFinePointer } from '../animations/gsap'
import { TransitionLink } from './PageTransition'
import ProjectCover from './ProjectCover'
import './ProjectIndex.css'

/**
 * "Index" of every project: a filterable list of big rows.
 * On desktop, a preview of the hovered project follows the cursor.
 */
export default function ProjectIndex({ projects, categories }) {
  const [filter, setFilter] = useState('All')
  const [hovered, setHovered] = useState(null)
  const preview = useRef(null)
  const list = useRef(null)

  const used = useMemo(() => categories.filter((c) => projects.some((p) => p.category === c)), [projects, categories])
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  // Cursor-following preview (desktop only)
  useEffect(() => {
    if (!hasFinePointer()) return
    const el = preview.current
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Animate rows in when the filter changes (not on first render)
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) return void (mounted.current = true)
    gsap.fromTo(list.current.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, overwrite: true })
  }, [filter])

  return (
    <div className="pindex">
      <div className="pindex-filters" role="group" aria-label="Filter projects by category">
        {['All', ...used].map((c) => (
          <button
            key={c}
            className={`pindex-chip mono ${filter === c ? 'is-active' : ''}`}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
            <sup>{c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}</sup>
          </button>
        ))}
      </div>

      <ol ref={list} className="pindex-list" role="list" onMouseLeave={() => setHovered(null)}>
        {shown.map((p) => {
          const n = String(projects.indexOf(p) + 1).padStart(2, '0')
          return (
            <li key={p.slug} className={`pindex-row c-${p.accent}`}>
              <TransitionLink
                to={`/work/${p.slug}`}
                label={p.title}
                className="pindex-link"
                data-cursor="explore"
                onMouseEnter={() => setHovered(p)}
                onFocus={() => setHovered(null)}
              >
                <span className="pindex-num mono">{n}</span>
                <span className="pindex-title display">{p.title}</span>
                <span className="pindex-cat mono">{p.category}</span>
                <span className="pindex-year mono">{p.year}</span>
                <span className="pindex-arrow" aria-hidden="true">↗</span>
              </TransitionLink>
            </li>
          )
        })}
      </ol>

      <div ref={preview} className={`pindex-preview ${hovered ? 'is-on' : ''}`} aria-hidden="true">
        <div className="pindex-preview-card">
          {hovered && <ProjectCover project={hovered} label={false} />}
        </div>
      </div>
    </div>
  )
}
