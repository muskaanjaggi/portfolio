import MagneticButton from '../components/MagneticButton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('404')
  return (
    <section
      className="section theme-ink"
      style={{ minHeight: '100svh', display: 'grid', alignContent: 'center', paddingTop: 'calc(var(--nav-h) + 60px)' }}
    >
      <div className="container" style={{ display: 'grid', gap: 32 }}>
        <p className="mono muted">Error 404 — outlier detected</p>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)' }}>
          This page <span className="serif" style={{ color: 'var(--pink)' }}>wandered</span>
          <br /> off the chart.
        </h1>
        <div>
          <MagneticButton href="/" variant="paper" arrow="←">Back home</MagneticButton>
        </div>
      </div>
    </section>
  )
}
