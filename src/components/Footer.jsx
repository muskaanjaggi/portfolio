import { profile } from '../data/profile'
import { footer } from '../data/site'
import { socials } from '../data/social'
import LocalClock from './LocalClock'
import { scrollTo } from '../animations/smoothScroll'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer theme-ink">
      <div className="container footer-grid">
        <div className="footer-id">
          <p className="footer-name display">{profile.name}</p>
          <p className="mono muted">{profile.title}</p>
        </div>

        <div className="footer-col mono">
          <p className="muted">Local time</p>
          <p>
            <LocalClock seconds /> <span className="muted">IST</span>
          </p>
          <p>{profile.location}</p>
        </div>

        <ul role="list" className="footer-col footer-links mono">
          {socials.map((s) => (
            <li key={s.label}>
              <a className="u-link" href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="footer-bottom mono">
          <span>© {year}</span>
          <span className="muted">{footer.line}</span>
          <button className="footer-top" onClick={() => scrollTo(0)} data-cursor-label="UP ↑" data-cursor="explore">
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
