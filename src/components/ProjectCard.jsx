import { TransitionLink } from './PageTransition'
import ProjectCover from './ProjectCover'
import './ProjectCard.css'

/**
 * Large editorial project card. Alternates sides via `flip`.
 * The whole card is one link (keyboard friendly); the cursor says VIEW ↗.
 */
export default function ProjectCard({ project, index, flip = false }) {
  const lines = project.titleLines?.length ? project.titleLines : [project.title]

  return (
    <article className={`pcard c-${project.accent} ${flip ? 'pcard--flip' : ''}`} data-parallax-root>
      <TransitionLink
        to={`/work/${project.slug}`}
        label={project.title}
        className="pcard-link"
        data-cursor="view"
        aria-label={`${project.title} — ${project.category}, ${project.year}. Read the case study.`}
      >
        <div className="pcard-inner">
          <div className="pcard-media-wrap">
            <span className="pcard-shadow" aria-hidden="true" />
            <div className="pcard-media" data-reveal="clip">
              <div className="pcard-media-inner" data-parallax="0.12">
                <ProjectCover project={project} />
              </div>
            </div>
            <span className="pcard-num display" aria-hidden="true">{index}</span>
          </div>

          <div className="pcard-body">
            <p className="pcard-tags mono">{project.tags.join(' / ')}</p>
            <h3 className="pcard-title display">
              {lines.map((l, i) => (
                <span key={i} className="pcard-title-line">{l}</span>
              ))}
            </h3>
            <p className="pcard-desc">{project.description}</p>

            <dl className="pcard-meta mono">
              <div><dt>Year</dt><dd>{project.year}</dd></div>
              <div><dt>Type</dt><dd>{project.type}</dd></div>
              <div><dt>Stack</dt><dd>{project.technologies.join(' · ')}</dd></div>
            </dl>

            <div className="pcard-foot">
              <span className="pcard-cta mono">
                Case study <span className="pcard-arrow" aria-hidden="true">↗</span>
              </span>
              {project.placeholder && <span className="placeholder-sticker">Placeholder · edit projects.js</span>}
            </div>
          </div>
        </div>
      </TransitionLink>
    </article>
  )
}
