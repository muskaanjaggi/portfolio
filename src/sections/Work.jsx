import { useRef } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SectionHeading from '../components/SectionHeading'
import ProjectIndex from '../components/ProjectIndex'
import { projects, projectCategories } from '../data/projects'
import './Work.css'

/** "Things I've made": every project as a filterable list with hover previews. */
export default function Work({ index, total }) {
  const root = useRef(null)
  useSectionAnimations(root)

  return (
    <section ref={root} id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <SectionHeading
          id="work-title"
          index={index}
          total={total}
          label="Selected work"
          title={['Things', "*I've* made"]}
        >
          <p>
            From idea → something real. A mix of data science, AI, the web and whatever else I couldn’t stop
            thinking about.
          </p>
        </SectionHeading>

        <span className="work-count display" aria-hidden="true" data-parallax="-0.4">
          {String(projects.length).padStart(2, '0')}
        </span>

        <div className="work-list">
          <ProjectIndex projects={projects} categories={projectCategories} />
        </div>
      </div>
    </section>
  )
}
