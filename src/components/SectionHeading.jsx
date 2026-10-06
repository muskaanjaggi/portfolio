import SplitText from './SplitText'
import './SectionHeading.css'

/**
 *  01 / 09 ─── SELECTED WORK
 *  BIG
 *  TITLE
 */
export default function SectionHeading({ index, total, label, title, id, className = '', children }) {
  return (
    <header className={`sh ${className}`}>
      <div className="sh-meta mono" aria-hidden="true">
        <span className="sh-index">{index}</span>
        <span className="sh-slash">/</span>
        <span>{total}</span>
      </div>
      <p className="eyebrow sh-label">{label}</p>
      <SplitText as="h2" id={id} className="display sh-title" text={title} data-reveal="words" />
      {children && <div className="sh-aside">{children}</div>}
    </header>
  )
}
