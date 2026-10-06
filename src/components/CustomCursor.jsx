import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { initCursor } from '../animations/cursor'
import { useFinePointer } from '../hooks/useMedia'
import './CustomCursor.css'

/**
 * Desktop-only cursor: a dot that tracks tightly + a ring that lags.
 * Touch devices never render it and keep the native cursor.
 */
export default function CustomCursor() {
  const fine = useFinePointer()
  const root = useRef(null)
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)
  const ctrl = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!fine) return
    document.documentElement.classList.add('has-custom-cursor')
    ctrl.current = initCursor({ root: root.current, dot: dot.current, ring: ring.current, label: label.current })
    return () => {
      ctrl.current?.destroy()
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [fine])

  // Hovered element may disappear on navigation — reset the state
  useEffect(() => ctrl.current?.reset(), [pathname])

  if (!fine) return null

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <div className="cursor-ring-shape" />
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  )
}
