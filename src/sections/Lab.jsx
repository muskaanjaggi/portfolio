import { useRef } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SplitText from '../components/SplitText'
import LabBoard from '../components/LabBoard'
import MagneticButton from '../components/MagneticButton'
import { labIntro, labItems } from '../data/lab'
import './Lab.css'

/** THE LAB — where the grid breaks on purpose. */
export default function Lab({ index, total, standalone = false }) {
  const root = useRef(null)
  useSectionAnimations(root)

  return (
    <section ref={root} id="lab" className={`section lab ${standalone ? 'lab--page' : ''}`} aria-labelledby="lab-title">
      <div className="lab-grid-bg" aria-hidden="true" />
      <div className="container">
        <div className="lab-head">
          <div className="lab-meta mono" aria-hidden="true">
            <span>{index ? `${index} / ${total}` : 'Lab'}</span>
            <span>The Lab ⚗</span>
            <span>Exp. log — ongoing</span>
          </div>
          <SplitText
            as={standalone ? 'h1' : 'h2'}
            id="lab-title"
            className="display lab-title"
            text={[labIntro.heading[0], `*${labIntro.heading[1]}*`, labIntro.heading[2]]}
            data-reveal="words"
          />
          <p className="lab-intro" data-reveal="up">{labIntro.body}</p>
          <span className="lab-badge display" aria-hidden="true">LAB</span>
        </div>

        <LabBoard items={labItems} tall={standalone} />

        {!standalone && (
          <div className="lab-foot">
            <MagneticButton href="/lab" variant="paper">Open the full lab</MagneticButton>
          </div>
        )}
      </div>
    </section>
  )
}
