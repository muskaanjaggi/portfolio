import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../animations/gsap'
import { scrollTo } from '../animations/smoothScroll'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getProject, projects } from '../data/projects'
import ProjectCover from '../components/ProjectCover'
import MagneticButton from '../components/MagneticButton'
import SplitText from '../components/SplitText'
import { TransitionLink } from '../components/PageTransition'
import NotFound from './NotFound'
import './ProjectDetail.css'

/**
 * Case-study page. Everything comes from the project's `details` object
 * in src/data/projects.js — sections with no content are skipped.
 */
// Remount per slug so every animation/ScrollTrigger is rebuilt cleanly
export default function ProjectDetailRoute() {
  const { slug } = useParams()
  return <ProjectDetail key={slug} slug={slug} />
}

function ProjectDetail({ slug }) {
  const project = getProject(slug)
  const root = useRef(null)
  useDocumentTitle(project?.title, project?.description)

  useSectionAnimations(root)

  // Table of contents highlights the chapter you're reading
  useGSAP(
    () => {
      if (!root.current || !project) return
      const links = root.current.querySelectorAll('.cs-toc a')
      root.current.querySelectorAll('.cs-chapter').forEach((ch, i) => {
        ScrollTrigger.create({
          trigger: ch,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => links[i]?.classList.toggle('is-active', self.isActive),
        })
      })
      if (prefersReducedMotion()) return
      gsap.from(root.current.querySelectorAll('.cs-hero .split-inner'), { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'power4.out', delay: 0.5 })
      gsap.from(root.current.querySelectorAll('.cs-arch-node'), {
        scale: 0.6,
        opacity: 0,
        stagger: 0.12,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: root.current.querySelector('.cs-arch'), start: 'top 80%', once: true },
      })
    },
    { scope: root },
  )

  if (!project) return <NotFound />

  const d = project.details || {}
  const i = projects.indexOf(project)
  const next = projects[(i + 1) % projects.length]
  const lines = project.titleLines?.length ? project.titleLines : [project.title]

  const chapters = [
    d.problem && { id: 'problem', title: 'The problem', body: <p>{d.problem}</p> },
    d.idea && { id: 'idea', title: 'The idea', body: <p>{d.idea}</p> },
    d.howItWorks?.length && {
      id: 'how',
      title: 'How it works',
      body: (
        <>
          <ol role="list" className="cs-steps">
            {d.howItWorks.map((s, k) => (
              <li key={k}>
                <span className="mono">{String(k + 1).padStart(2, '0')}</span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
          {d.architecture?.length > 0 && (
            <figure className="cs-arch" aria-label={`Architecture: ${d.architecture.join(' → ')}`}>
              <div className="cs-arch-flow" aria-hidden="true">
                {d.architecture.map((node, k) => (
                  <div key={node} className="cs-arch-step">
                    <span className="cs-arch-node">
                      <span className="mono">{String(k + 1).padStart(2, '0')}</span>
                      {node}
                    </span>
                    {k < d.architecture.length - 1 && <span className="cs-arch-arrow" />}
                  </div>
                ))}
              </div>
              <figcaption className="mono">Fig. — system overview</figcaption>
            </figure>
          )}
        </>
      ),
    },
    d.contribution?.length && {
      id: 'contribution',
      title: 'My contribution',
      body: (
        <ul role="list" className="cs-bullets">
          {d.contribution.map((c, k) => <li key={k}>{c}</li>)}
        </ul>
      ),
    },
    d.result && { id: 'result', title: 'Result', body: <p className="cs-result">{d.result}</p> },
    {
      id: 'stack',
      title: 'Tech stack',
      body: (
        <ul role="list" className="cs-stack">
          {project.technologies.map((t) => <li key={t} className="display">{t}</li>)}
        </ul>
      ),
    },
  ].filter(Boolean)

  return (
    <article ref={root} className={`cs c-${project.accent}`}>
      {/* ── Header ─────────────────────────────── */}
      <header className="cs-hero">
        <div className="container">
          <div className="cs-crumbs mono">
            <TransitionLink to="/#work" className="u-link" label="Work">← All work</TransitionLink>
            <span>Case study {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          </div>

          <span className="cs-hero-num display" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <p className="cs-tags mono">{project.tags.join(' / ')}</p>
          <SplitText as="h1" className="display cs-title" text={lines} />
          <p className="cs-lede lead">{project.description}</p>

          {project.placeholder && (
            <p className="placeholder-sticker cs-ph">Placeholder content — edit src/data/projects.js → “{project.slug}”</p>
          )}

          <dl className="cs-spec mono">
            <div><dt>Year</dt><dd>{project.year}</dd></div>
            <div><dt>Team</dt><dd>{d.team || project.type}</dd></div>
            <div><dt>Technologies</dt><dd>{project.technologies.join(' · ')}</dd></div>
          </dl>

          {(project.github || project.live) && (
            <div className="cs-links">
              {project.github && <MagneticButton href={project.github} external variant="paper">GitHub</MagneticButton>}
              {project.live && (
                project.live.startsWith('http')
                  ? <MagneticButton href={project.live} external variant="lime">Live demo</MagneticButton>
                  : <MagneticButton href={project.live} variant="lime">Live demo</MagneticButton>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="container">
        <div className="cs-cover" data-reveal="clip">
          <ProjectCover project={project} eager />
        </div>
      </div>

      {/* ── Chapters ───────────────────────────── */}
      <div className="container cs-body">
        <nav className="cs-toc mono" aria-label="Case study sections">
          <ol role="list">
            {chapters.map((c, k) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollTo(`#${c.id}`, { offset: -90 })
                  }}
                >
                  <span>{String(k + 1).padStart(2, '0')}</span> {c.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="cs-chapters">
          {chapters.map((c, k) => (
            <section key={c.id} id={c.id} className="cs-chapter" aria-labelledby={`${c.id}-h`}>
              <p className="mono cs-chapter-num">{String(k + 1).padStart(2, '0')} ——</p>
              <h2 id={`${c.id}-h`} className="display cs-chapter-title" data-reveal="up">{c.title}</h2>
              <div className="cs-chapter-body" data-reveal="up">{c.body}</div>
            </section>
          ))}

          {d.gallery?.length > 0 && (
            <section className="cs-gallery" aria-label="Screenshots">
              {d.gallery.map((g, k) => (
                <figure key={k} data-reveal="clip" data-cursor="open">
                  <img src={g.src} alt={g.alt} loading="lazy" decoding="async" />
                  {g.caption && <figcaption className="mono">{g.caption}</figcaption>}
                </figure>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* ── Next project ───────────────────────── */}
      {/* Compact "next project" card, tucked to the right */}
      <div className="container cs-next-wrap">
        <TransitionLink to={`/work/${next.slug}`} label={next.title} className={`cs-next c-${next.accent}`} data-cursor="view" data-cursor-label="NEXT →">
          <span className="cs-next-text">
            <span className="mono cs-next-label">Next project</span>
            <span className="display cs-next-title">{next.title}</span>
          </span>
          <span className="cs-next-arrow" aria-hidden="true">→</span>
        </TransitionLink>
      </div>
    </article>
  )
}
