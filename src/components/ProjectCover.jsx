import { memo, useMemo } from 'react'
import { mulberry32 } from '../three/bloomGeometry'
import './ProjectCover.css'

const PALETTE = {
  pink: '#FF4FA3',
  coral: '#FF6B57',
  yellow: '#FFD84D',
  lime: '#C7F36B',
  purple: '#8C5CFF',
  ink: '#111111',
  paper: '#FFF8EF',
}

const hash = (s) => [...s].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261)

/**
 * Project image. Uses `image` if provided, otherwise draws a deterministic
 * generative cover from the project's `cover` style + `accent` colour, so
 * the layout always looks finished while you collect real screenshots.
 */
function ProjectCover({ project, image = project.image, alt, label = true, eager = false }) {
  if (image) {
    return (
      <img
        className="cover-img"
        src={image}
        alt={alt ?? `${project.title} — screenshot`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }
  return <GenerativeCover project={project} label={label} />
}

const GenerativeCover = memo(function GenerativeCover({ project, label }) {
  const accent = PALETTE[project.accent] || PALETTE.pink
  const shapes = useMemo(() => drawCover(project.cover, project.slug, accent), [project.cover, project.slug, accent])

  return (
    <div className="cover-gen" style={{ '--cover-accent': accent }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Placeholder artwork for ${project.title}`}>
        <rect width="400" height="300" fill={PALETTE.ink} />
        {shapes}
      </svg>
      {label && (
        <span className="cover-note mono" aria-hidden="true">
          FIG. — {project.cover || 'cover'} · replace with screenshot
        </span>
      )}
    </div>
  )
})

function drawCover(type, slug, accent) {
  const rand = mulberry32(hash(slug))
  const { paper, yellow, pink, lime, purple, coral } = PALETTE
  const pick = (arr) => arr[Math.floor(rand() * arr.length)]
  const out = []

  switch (type) {
    case 'grid': {
      for (let y = 0; y < 6; y++)
        for (let x = 0; x < 8; x++) {
          const r = rand()
          const cx = 25 + x * 50
          const cy = 25 + y * 50
          if (r < 0.28) out.push(<rect key={`${x}-${y}`} x={cx - 18} y={cy - 18} width="36" height="36" rx="6" fill={accent} transform={`rotate(${r * 90} ${cx} ${cy})`} />)
          else if (r < 0.4) out.push(<circle key={`${x}-${y}`} cx={cx} cy={cy} r="14" fill="none" stroke={paper} strokeWidth="2" />)
          else out.push(<circle key={`${x}-${y}`} cx={cx} cy={cy} r="2.5" fill={paper} opacity=".5" />)
        }
      out.push(<circle key="big" cx="290" cy="150" r="90" fill={yellow} style={{ mixBlendMode: 'difference' }} />)
      break
    }
    case 'dots': {
      // A scatter plot with three clusters and axes
      out.push(<path key="ax" d="M40 260 H370 M40 260 V30" stroke={paper} strokeWidth="1.5" opacity=".5" />)
      const centers = [[120, 190, accent], [230, 110, yellow], [310, 200, pink]]
      centers.forEach(([cx, cy, col], k) => {
        for (let i = 0; i < 70; i++) {
          const a = rand() * Math.PI * 2
          const d = Math.sqrt(rand()) * 45
          out.push(<circle key={`${k}-${i}`} cx={cx + Math.cos(a) * d} cy={cy + Math.sin(a) * d * 0.8} r={2 + rand() * 2.5} fill={col} opacity={0.6 + rand() * 0.4} />)
        }
        out.push(<path key={`x${k}`} d={`M${cx - 7} ${cy - 7} L${cx + 7} ${cy + 7} M${cx + 7} ${cy - 7} L${cx - 7} ${cy + 7}`} stroke={paper} strokeWidth="3" />)
      })
      break
    }
    case 'bars': {
      for (let i = 0; i < 14; i++) {
        const h = 30 + rand() * 190
        out.push(<rect key={i} x={30 + i * 25} y={260 - h} width="16" height={h} rx="3" fill={i % 4 === 0 ? pink : accent} opacity={0.5 + rand() * 0.5} />)
      }
      out.push(<path key="trend" d="M30 210 C 120 190, 180 120, 380 70" stroke={paper} strokeWidth="3" fill="none" strokeDasharray="6 6" />)
      break
    }
    case 'wave': {
      for (let i = 0; i < 16; i++) {
        const amp = 20 + i * 3
        const y0 = 40 + i * 15
        const ph = rand() * 6
        let d = `M0 ${y0}`
        for (let x = 0; x <= 400; x += 10) d += ` L${x} ${(y0 + Math.sin(x / 45 + ph) * amp * 0.4).toFixed(1)}`
        out.push(<path key={i} d={d} fill="none" stroke={i % 5 === 0 ? yellow : accent} strokeWidth={i % 5 === 0 ? 3 : 1.5} opacity={0.4 + (i / 16) * 0.6} />)
      }
      break
    }
    case 'rings': {
      for (let i = 0; i < 9; i++) {
        const col = pick([accent, yellow, lime, paper, purple])
        out.push(<circle key={i} cx={120 + rand() * 180} cy={80 + rand() * 140} r={20 + rand() * 90} fill="none" stroke={col} strokeWidth={2 + rand() * 10} opacity=".85" />)
      }
      break
    }
    case 'bloom':
    default: {
      const colors = [pink, coral, yellow, lime, purple, paper]
      for (let i = 0; i < 360; i++) {
        const c = i % 6
        const th = (c / 6) * Math.PI * 2
        const along = Math.pow(rand(), 0.75) * 120
        const across = (rand() - 0.5) * Math.sin((Math.PI * along) / 120) * 40
        const x = 200 + (10 + along) * Math.cos(th) - across * Math.sin(th)
        const y = 150 + (10 + along) * Math.sin(th) + across * Math.cos(th)
        out.push(<circle key={i} cx={x} cy={y} r={1.2 + rand() * 2.2} fill={colors[c]} opacity={0.5 + rand() * 0.5} />)
      }
    }
  }
  return out
}

export default ProjectCover
