import { useRef, useState } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SectionHeading from '../components/SectionHeading'
import Marquee from '../components/Marquee'
import { skillGroups, skills } from '../data/skills'
import './Skills.css'

/**
 * An interactive cluster of skills. Hover or focus a word to read what
 * it means in practice; hover a legend group to highlight its members.
 */
export default function Skills({ index, total }) {
  const root = useRef(null)
  const [active, setActive] = useState(null)
  const [group, setGroup] = useState(null)
  useSectionAnimations(root)

  const current = active ?? { name: 'Hover a skill', note: 'or tab through them with your keyboard', group: null }

  return (
    <section ref={root} id="skills" className="section skills theme-ink" aria-labelledby="skills-title">
      <div className="container skills-layout">
        <div className="skills-side">
          <SectionHeading id="skills-title" index={index} total={total} label="Toolkit" title={['I work', '*with*']} />

          <div className={`skills-readout c-${active ? skillGroups[active.group].color : 'ink'}`} aria-live="polite">
            <p className="mono skills-readout-label">
              {active ? skillGroups[active.group].label : 'readout'}
            </p>
            <p className="display skills-readout-name">{current.name}</p>
            <p className="skills-readout-note">{current.note}</p>
          </div>

          <ul role="list" className="skills-legend mono">
            {Object.entries(skillGroups).map(([key, g]) => (
              <li key={key}>
                <button
                  type="button"
                  className={`skills-legend-btn c-${g.color}`}
                  aria-pressed={group === key}
                  onMouseEnter={() => setGroup(key)}
                  onMouseLeave={() => setGroup(null)}
                  onClick={() => setGroup((g2) => (g2 === key ? null : key))}
                >
                  <span className="skills-dot" aria-hidden="true" /> {g.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ul role="list" className={`skills-cloud ${group ? 'has-group' : ''}`} data-reveal="stagger">
          {skills.map((s) => (
            <li key={s.name}>
              <button
                type="button"
                className={`skill skill--${s.size} c-${skillGroups[s.group].color} ${group === s.group ? 'is-lit' : ''}`}
                onMouseEnter={() => setActive(s)}
                onFocus={() => setActive(s)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                aria-describedby={active?.name === s.name ? 'skill-note' : undefined}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
        <span id="skill-note" className="visually-hidden">{active?.note}</span>
      </div>

      <div className="skills-marquee">
        <Marquee items={skills.map((s) => s.name).filter((n) => !n.startsWith('['))} tone="lime" size="sm" speed={40} separator="✳" reverse />
      </div>
    </section>
  )
}
