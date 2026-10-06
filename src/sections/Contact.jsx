import { useRef, useState } from 'react'
import { useSectionAnimations } from '../hooks/useSectionAnimations'
import SplitText from '../components/SplitText'
import MagneticButton from '../components/MagneticButton'
import { contact } from '../data/site'
import { email, socials } from '../data/social'
import './Contact.css'

export default function Contact() {
  const root = useRef(null)
  const [copied, setCopied] = useState(false)
  useSectionAnimations(root)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <section ref={root} id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <SplitText
          as="h2"
          id="contact-title"
          className="display contact-title"
          text={[contact.heading[0], `*${contact.heading[1]}*`, contact.heading[2]]}
          data-reveal="words"
        />

        <div className="contact-row">
          <MagneticButton href={`mailto:${email}`} size="lg" strength={0.45} className="contact-cta">
            {contact.cta}
          </MagneticButton>

          <button type="button" className="contact-email mono" onClick={copy} data-cursor="explore" data-cursor-label={copied ? 'COPIED ✓' : 'COPY'}>
            <span>{email}</span>
            <span className="contact-copy" aria-live="polite">{copied ? 'copied ✓' : 'copy'}</span>
          </button>
        </div>

        <ul role="list" className="contact-socials">
          {socials.map((s, i) => {
            const external = s.url.startsWith('http')
            return (
              <li key={s.label}>
                <a
                  href={s.url}
                  className="contact-social"
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  data-cursor={external ? 'visit' : undefined}
                >
                  <span className="mono">0{i + 1}</span>
                  <span className="display contact-social-label">{s.label}</span>
                  <span className="mono contact-social-handle">{s.handle}</span>
                  <span className="contact-social-arrow" aria-hidden="true">↗</span>
                  {external && <span className="visually-hidden"> (opens in a new tab)</span>}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
