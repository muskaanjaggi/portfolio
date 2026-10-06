import { memo, useMemo } from 'react'
import { generateBloom } from './bloomGeometry'

/**
 * Lightweight SVG version of the Data Bloom for phones, tablets,
 * reduced-motion users and browsers without WebGL.
 * ~400 circles, rotated slowly with CSS (paused by reduced-motion).
 */
function BloomFallback({ className }) {
  const pts = useMemo(() => generateBloom(420, { seed: 7 }), [])
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="-3.4 -3.4 6.8 6.8" className="bloom-fallback">
        <g>
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.x.toFixed(3)}
              cy={p.y.toFixed(3)}
              r={(0.018 * p.size + 0.01).toFixed(3)}
              fill={p.color}
              opacity={0.55 + p.r[2] * 0.45}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default memo(BloomFallback)

export function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}
