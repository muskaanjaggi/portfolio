import { useRef } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import { education } from '../data/profile'
import './Education.css'

/** Deliberately small. */
export default function Education({ index, total }) {
  const root = useRef(null)
  useSectionAnimations(root)
  const real = (list) => list?.filter((c) => c && !c.startsWith('[')) ?? []

  return (
    <section ref={root} id="education" className="edu" aria-labelledby="edu-title">
      <div className="container">
        <div className="edu-card" data-reveal="up">
          <div className="edu-meta mono">
            <span>{index} / {total}</span>
            <h2 id="edu-title" className="eyebrow">Education</h2>
          </div>
          {education.map((e, i) => (
            <div key={e.degree} className={`edu-row ${i > 0 ? 'edu-row--past' : ''}`}>
              <span className="edu-num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <p className="edu-degree display">{e.degree}</p>
              <p className="edu-school">
                <span className="serif">{e.schoolShort}</span>
                <span className="mono muted">{e.school}</span>
              </p>
              <p className="edu-years display" aria-label={`${e.start} to ${e.end}`}>
                {e.start}<span className="serif"> — </span>{e.end}
              </p>
              {e.coursework?.length > 0 && (
                <ul role="list" className="tag-list edu-courses">
                  {/* Unfilled placeholders are shown dimmed so they're easy to spot */}
                  {e.coursework.map((c) => (
                    <li key={c} className={`tag ${real([c]).length ? '' : 'edu-ph'}`}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
