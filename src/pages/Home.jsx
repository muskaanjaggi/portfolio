import Hero from '../sections/Hero'
import About from '../sections/About'
import Pillars from '../sections/Pillars'
import Work from '../sections/Work'
import Lab from '../sections/Lab'
import CreativeWork from '../sections/CreativeWork'
import Skills from '../sections/Skills'
import Experience from '../sections/Experience'
import Education from '../sections/Education'
import Research from '../sections/Research'
import Contact from '../sections/Contact'
import Marquee from '../components/Marquee'
import { sections, marquees } from '../data/site'
import { research } from '../data/research'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

/**
 * Section order + the rhythm of the page:
 * LOUD (hero) → quiet (about) → LOUD (pillars) → quiet (work) → LOUD (lab)
 * → quiet (creative) → LOUD (skills) → quiet (experience, education, research) → LOUD (contact)
 * Section numbers ("03 / 09") are computed from whatever is switched on.
 */
const ORDER = [
  { key: 'about', Component: About, on: true },
  { key: 'work', Component: Work, on: sections.work },
  { key: 'lab', Component: Lab, on: sections.lab },
  { key: 'creative', Component: CreativeWork, on: sections.creative },
  { key: 'skills', Component: Skills, on: sections.skills },
  { key: 'experience', Component: Experience, on: sections.experience },
  { key: 'education', Component: Education, on: sections.education },
  { key: 'research', Component: Research, on: sections.research && research.length > 0 },
  { key: 'contact', Component: Contact, on: true },
].filter((s) => s.on)

const pad = (n) => String(n).padStart(2, '0')

export default function Home() {
  useDocumentTitle()
  const total = pad(ORDER.length)
  const meta = (key) => ({ index: pad(ORDER.findIndex((s) => s.key === key) + 1), total })
  const render = (key) => {
    const s = ORDER.find((x) => x.key === key)
    return s ? <s.Component key={key} {...meta(key)} /> : null
  }

  return (
    <>
      <Hero />
      <Marquee items={marquees.primary} tone="pink" tilt={-1.5} speed={70} />
      {render('about')}
      {sections.pillars && <Pillars />}
      {render('work')}
      {render('lab')}
      <Marquee items={marquees.secondary} tone="ink" size="sm" speed={45} separator="—" />
      {render('creative')}
      {render('skills')}
      {render('experience')}
      {render('education')}
      {render('research')}
      {render('contact')}
    </>
  )
}
