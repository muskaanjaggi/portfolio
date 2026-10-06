import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../animations/gsap'
import { startScroll, stopScroll } from '../animations/smoothScroll'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SectionHeading from '../components/SectionHeading'
import { creativeAlbums } from '../data/creative'
import './CreativeWork.css'

const toImage = (img) => (typeof img === 'string' ? { src: img, caption: '' } : img)

/** Gallery of albums. Click a tile → full-screen album with all its images. */
export default function CreativeWork({ index, total }) {
  const root = useRef(null)
  const [open, setOpen] = useState(null) // the album being viewed
  const opener = useRef(null)
  useSectionAnimations(root)

  const show = (album, e) => {
    opener.current = e.currentTarget
    setOpen(album)
  }
  const close = useCallback(() => {
    setOpen(null)
    opener.current?.focus()
  }, [])

  return (
    <section ref={root} id="creative" className="section creative" aria-labelledby="creative-title">
      <div className="container">
        <SectionHeading id="creative-title" index={index} total={total} label="Creative work" title={['Visual', '*things*']}>
          <p>Design, visuals, photography and experiments the stuff that keeps the other half of my brain busy.</p>
        </SectionHeading>

        <ul role="list" className="creative-grid">
          {creativeAlbums.map((album, i) => {
            const images = album.images.map(toImage)
            const cover = album.cover // no cover set → coloured tile with the album name
            const empty = images.length === 0
            const inner = (
              <>
                <div className="creative-media">
                  {cover ? (
                    <img src={cover} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="creative-ph display" aria-hidden="true">{album.title}</span>
                  )}
                </div>
                <span className="creative-caption">
                  <span className="mono">
                    {String(i + 1).padStart(2, '0')} · {empty ? 'coming soon' : `${images.length} ${images.length === 1 ? 'image' : 'images'}`}
                  </span>
                  <span className="creative-title">{album.title}</span>
                </span>
              </>
            )
            return (
              <li key={album.title} className={`creative-tile creative-tile--${album.ratio} c-${album.color}`} style={{ '--tilt': `${(i % 3) - 1}deg` }}>
                {empty ? (
                  <div className="creative-card is-empty">{inner}</div>
                ) : (
                  <button
                    type="button"
                    className="creative-card"
                    onClick={(e) => show(album, e)}
                    data-cursor="open"
                    aria-haspopup="dialog"
                    aria-label={`Open album: ${album.title}, ${images.length} images`}
                  >
                    {inner}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {open && <Album album={open} onClose={close} />}
    </section>
  )
}

function Album({ album, onClose }) {
  const el = useRef(null)
  const closeBtn = useRef(null)
  const images = album.images.map(toImage)

  useEffect(() => {
    stopScroll()
    document.body.style.overflow = 'hidden'
    closeBtn.current.focus()
    // fromTo with explicit end values, so a re-run can never leave images hidden
    const items = el.current.querySelectorAll('.album-item')
    if (!prefersReducedMotion()) {
      gsap.fromTo(el.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, delay: 0.1, overwrite: true })
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      // the close button is the only control, so keep keyboard focus on it
      if (e.key === 'Tab') {
        e.preventDefault()
        closeBtn.current.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      gsap.killTweensOf([el.current, ...items])
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      startScroll()
    }
  }, [onClose])

  return (
    <div
      ref={el}
      className={`album c-${album.color}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${album.title} album`}
      data-lenis-prevent
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="album-inner">
        <header className="album-head">
          <div>
            <p className="mono album-count">Album · {images.length} {images.length === 1 ? 'image' : 'images'}</p>
            <h3 className="display album-title">{album.title}</h3>
            {album.note && <p className="album-note">{album.note}</p>}
          </div>
          <button ref={closeBtn} type="button" className="btn btn--paper album-close" onClick={onClose}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </header>

        <ul role="list" className="album-grid">
          {images.map((img, i) => (
            <li key={img.src} className="album-item">
              <figure>
                <img src={img.src} alt={img.caption || `${album.title} — image ${i + 1}`} decoding="async" />
                {img.caption && <figcaption className="mono">{img.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
