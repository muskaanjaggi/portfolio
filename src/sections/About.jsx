import { useRef } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SectionHeading from '../components/SectionHeading'
import { about, profile } from '../data/profile'
import './About.css'

const LINE_STYLES = ['', 'outline-ink', 'serif', 'hl-pink', 'hl-lime']

export default function About({ index, total }) {
  const root = useRef(null)

  useSectionAnimations(root)

  return (
    <section ref={root} id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          id="about-title"
          index={index}
          total={total}
          label="About"
          title={[about.heading[0], `*${about.heading[1]}*`]}
        />

        <div className="about-grid">
          <div className="about-left">
            <ol className="about-lines" role="list" data-reveal="stagger">
              {about.lines.map((line, i) => (
                <li key={line} className={`about-line display ${LINE_STYLES[i % LINE_STYLES.length]}`}>
                  <span className="about-line-num mono">0{i + 1}</span>
                  <span><span className="about-line-text">{line}</span></span>
                </li>
              ))}
            </ol>

          </div>

          <figure className="about-portrait" data-reveal="up">
            <div className="about-portrait-frame" data-cursor={profile.photo ? 'open' : undefined}>
              {profile.photo ? (
                <img src={profile.photo} alt={`Portrait of ${profile.name}`} loading="lazy" decoding="async" />
              ) : (
                <div className="about-portrait-ph">
                  <span className="display">{profile.firstName[0]}{profile.lastName[0]}</span>
                  <span className="mono">[ your photo — set profile.photo ]</span>
                </div>
              )}
            </div>
            <figcaption className="mono">
              <span>Fig. 01 — the human behind it</span>
              <span>{profile.locationShort}</span>
            </figcaption>
            <span className="about-tape" aria-hidden="true" />
          </figure>
        </div>


        <div className="about-detail">
          <div className="about-copy" data-reveal="stagger">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="about-avail mono">
              <span className="about-avail-dot" aria-hidden="true" /> {profile.availability}
            </p>
          </div>

          <dl className="about-facts" data-reveal="stagger">
            {about.facts.map((f) => (
              <div key={f.label} className="about-fact">
                <dt className="mono">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
