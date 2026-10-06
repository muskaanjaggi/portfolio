import { useRef } from 'react'
import { gsap } from '../animations/gsap'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SectionHeading from '../components/SectionHeading'
import { experience } from '../data/experience'
import './Experience.css'

/** Calm, editorial timeline. A line draws itself as you scroll. */
export default function Experience({ index, total }) {
  const root = useRef(null)
  useSectionAnimations(root, (el) => {
    gsap.fromTo(
      el.querySelector('.xp-progress'),
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: el.querySelector('.xp-list'), start: 'top 70%', end: 'bottom 60%', scrub: true } },
    )
  })

  return (
    <section ref={root} id="experience" className="section xp" aria-labelledby="xp-title">
      <div className="container">
        <SectionHeading id="xp-title" index={index} total={total} label="Experience" title={['Where', "I've *been*"]} />

        <div className="xp-wrap">
          <span className="xp-rail" aria-hidden="true"><span className="xp-progress" /></span>
          <ol role="list" className="xp-list">
            {experience.map((x, i) => (
              <li key={i} className="xp-item" data-reveal="up">
                <span className="xp-dot" aria-hidden="true" />
                <p className="xp-year display" aria-hidden="true">{x.year}</p>
                <div className="xp-body">
                  <h3 className="xp-role">{x.role}</h3>
                  <p className="xp-org">
                    {x.link ? (
                      <a className="u-link" href={x.link} target="_blank" rel="noopener noreferrer" data-cursor="visit">
                        {x.organization} ↗
                      </a>
                    ) : (
                      x.organization
                    )}
                  </p>
                  <p className="xp-dates mono">{x.dates}</p>
                  <p className="xp-desc">{x.description}</p>
                  {x.technologies?.length > 0 && (
                    <ul role="list" className="tag-list">
                      {x.technologies.map((t, j) => (
                        <li key={j} className="tag">{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
