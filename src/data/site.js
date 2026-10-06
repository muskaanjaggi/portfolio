/**
 * SITE SETTINGS — section switches, navigation and ticker text.
 */

// Flip any of these to false to hide a section on the homepage.
export const sections = {
  pillars: true,
  work: true,
  lab: false, // also re-add the Lab nav link + /lab route in App.jsx to bring it back
  creative: true, // set to true once you have real pieces in src/data/creative.js
  skills: true,
  experience: true,
  education: true,
  research: true,
}

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export const marquees = {
  primary: ['Data', 'Design', 'AI', 'Creativity', 'Build', 'Experiment', 'Repeat'],
  secondary: ['Made in Mumbai', 'Built with curiosity', 'Powered by too many ideas'],
}

export const contact = {
  heading: ["Let's make", 'something', 'interesting.'],
  cta: 'Say hello',
}

export const footer = {
  line: 'Built with React + JavaScript + curiosity.',
}
