import { useRef } from 'react'
import { gsap, Draggable, useGSAP, hasFinePointer } from '../animations/gsap'
import KMeansToy from './KMeansToy'
import './LabBoard.css'

/**
 * The Lab pin-board. On desktop, every object can be dragged around
 * (GSAP Draggable, bounded to the board). On touch devices it becomes a
 * horizontal swipe row so it never fights the page scroll.
 */
export default function LabBoard({ items, tall = false }) {
  const board = useRef(null)

  useGSAP(
    () => {
      if (!hasFinePointer()) return
      let z = 10
      const els = gsap.utils.toArray('.lab-item', board.current)
      els.forEach((el) => {
        const handle = el.querySelector('[data-drag-handle]')
        Draggable.create(el, {
          type: 'x,y',
          bounds: board.current,
          trigger: handle || el,
          zIndexBoost: false,
          onPress() {
            el.style.zIndex = ++z
            gsap.to(el, { scale: 1.04, rotate: '+=2', duration: 0.25, boxShadow: '14px 14px 0 #111' })
          },
          onRelease() {
            gsap.to(el, { scale: 1, rotate: el.dataset.r, duration: 0.6, ease: 'elastic.out(1, 0.5)', boxShadow: '6px 6px 0 #111' })
          },
        })
      })
      // Scatter-in when the board enters
      gsap.from(els, {
        y: 80,
        opacity: 0,
        rotate: () => gsap.utils.random(-25, 25),
        stagger: 0.07,
        duration: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: board.current, start: 'top 75%', once: true },
      })
    },
    { scope: board },
  )

  return (
    <div ref={board} className={`lab-board ${tall ? 'lab-board--tall' : ''}`}>
      {items.map((item) => (
        <LabItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function LabItem({ item }) {
  const style = {
    '--x': `${item.x}%`,
    '--y': `${item.y}%`,
    '--r': `${item.r}deg`,
    '--w': `${item.w}px`,
  }
  const draggable = item.kind !== 'kmeans'

  return (
    <div
      className={`lab-item lab-item--${item.kind} c-${item.color}`}
      style={style}
      data-r={item.r}
      data-cursor={draggable ? 'drag' : undefined}
    >
      {item.kind === 'kmeans' && (
        <>
          <div className="lab-bar mono" data-drag-handle data-cursor="drag">
            <span>● ● ●</span>
            <span>{item.title}</span>
          </div>
          <KMeansToy />
          <p className="lab-caption mono">{item.caption}</p>
        </>
      )}

      {item.kind === 'note' && (
        <>
          <p className="lab-kicker mono">{item.title}</p>
          <p className="lab-note-text">{item.text}</p>
        </>
      )}

      {item.kind === 'idea' && (
        <>
          <p className="lab-kicker mono">{item.title}</p>
          <p className="lab-note-text">{item.text}</p>
          <p className="lab-stamp mono">status: brewing</p>
        </>
      )}

      {item.kind === 'code' && (
        <>
          <div className="lab-bar mono">
            <span>● ● ●</span>
            <span>{item.title}</span>
          </div>
          <pre className="lab-code"><code>{item.text}</code></pre>
        </>
      )}

      {item.kind === 'image' && (
        <figure className="lab-polaroid">
          <div className="lab-polaroid-img">
            {item.image ? (
              <img src={item.image} alt={item.caption} loading="lazy" decoding="async" draggable="false" />
            ) : (
              <span className="mono">{item.title}</span>
            )}
          </div>
          <figcaption className="serif">{item.caption}</figcaption>
        </figure>
      )}

      {item.kind === 'sticker' && <span className="lab-sticker-text display">{item.text}</span>}
    </div>
  )
}
