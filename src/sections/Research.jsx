import { useRef } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SectionHeading from '../components/SectionHeading'
import { research } from '../data/research'
import './Research.css'

/** Research & publications in an academic, journal-like layout. */
export default function Research({ index, total }) {
  const root = useRef(null)
  useSectionAnimations(root)
  if (!research.length) return null

  return (
    <section ref={root} id="research" className="section research" aria-labelledby="research-title">
      <div className="container">
        <SectionHeading id="research-title" index={index} total={total} label="Research / Publications" title={['Research', '& *papers*']}>
          <p>Questions I’ve chased properly with data, methods and a write-up.</p>
        </SectionHeading>

        <ol role="list" className="research-list">
          {research.map((r, i) => (
            <li key={i} className="paper" data-reveal="up">
              <p className="paper-num mono">[{String(i + 1).padStart(2, '0')}]</p>
              <div className="paper-body">
                <p className="paper-venue mono">
                  {r.venue} · {r.year} <span className="paper-status">{r.status}</span>
                </p>
                <h3 className="paper-title">{r.title}</h3>
                <p className="paper-authors">{r.authors}</p>
                <p className="paper-desc">{r.description}</p>
                {(r.pdf || r.github) && (
                  <p className="paper-links mono">
                    {r.pdf && (
                      <a className="u-link" href={r.pdf} target="_blank" rel="noopener noreferrer" data-cursor="open" data-cursor-label="PDF ↗">
                        PDF ↗
                      </a>
                    )}
                    {r.github && (
                      <a className="u-link" href={r.github} target="_blank" rel="noopener noreferrer" data-cursor="visit">
                        Code ↗
                      </a>
                    )}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
