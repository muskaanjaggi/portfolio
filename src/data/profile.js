/**
 * ─────────────────────────────────────────────────────────────
 *  PROFILE — the single source of truth for "who is Muskaan".
 *  Anything in [SQUARE BRACKETS] is a placeholder to replace.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  firstName: 'Muskaan',
  lastName: 'Jaggi',
  name: 'Muskaan Jaggi',

  // Short identity line used in the hero, footer and meta labels
  title: 'Data × AI × Creative Technology',
  discipline: ['Data', 'AI', 'Creative Technology'],

  // Hero intro — keep it to one or two sentences
  intro: 'I build things at the intersection of data, technology and creativity.',

  location: 'Mumbai, India',
  locationShort: 'Mumbai, IN',
  timezone: 'Asia/Kolkata',
  coordinates: '19.07°N  72.87°E',

  // Little status pill in the navbar. Change whenever you like.
  status: 'Building something',

  // Open to… (shown in the About + Contact sections)
  availability: 'Open to internships, research & interesting collaborations',

  // Resume — drop your PDF into /public/resume/ and update the filename here.
  resume: '/resume/Muskaan_Jaggi_Resume.pdf',

  // Portrait — e.g. '/images/portrait.webp' (portrait orientation works best).
  // Leave '' to show the illustrated placeholder card.
  photo: '/images/portrait.jpg',
}

export const about = {
  heading: ['Who is', 'Muskaan?'],

  // The stacked, editorial list. One short line each.
  lines: [
    'Data Science student.',
    'Builder.',
    'Creative technologist.',
    'Occasional overthinker.',
    'Always making something.',
  ],

  // Scroll-highlighted manifesto paragraph. Write it in your own voice.
  manifesto:
    'I like turning ideas into things people can actually interact with. I build, break, learn, and build again.',

  // Longer intro paragraphs.
  // ✏️ Replace the bracketed bits with your own details.
  paragraphs: [
    "I'm a BTech Data Science student at NMIMS (MPSTME), Mumbai. I'm happiest where data, technology, and creativity come together whether that's finding patterns in numbers, building something with AI, or turning an idea into something people can actually use.",
    "Right now, I'm learning more about machine learning, AI, and data science, while working on projects that let me experiment and build. Outside class, you'll probably find me at hackathons, working on random side projects, exploring new ideas, or doing something creative.",
  ],

  facts: [
    { label: 'Studying', value: 'BTech in Data Science' },
    { label: 'At', value: 'NMIMS · MPSTME' },
    { label: 'Based in', value: 'Mumbai, India' },
    { label: 'Into', value: 'Data Science, AI/ML, Creativity and Painting' },
    { label: 'Heading towards', value: 'a Data Science/AI career, followed by a top-tier MS in the US' },
  ],
}

// The three things a visitor should get in 10 seconds.
export const pillars = [
  {
    number: '01',
    verb: 'Build',
    title: 'I can build.',
    body: 'Websites, tools and prototypes that actually ship from a Python notebook to something people can click on.',
    color: 'pink',
    tags: ['React', 'Python', 'HTML/CSS'],
  },
  {
    number: '02',
    verb: 'Think',
    title: 'I can think.',
    body: 'Data, research and machine learning asking better questions, then letting evidence answer them.',
    color: 'lime',
    tags: ['Data analysis', 'ML', 'Research'],
  },
  {
    number: '03',
    verb: 'Create',
    title: 'I can create.',
    body: 'Design, motion and visual experiments. Because the way something feels is part of how it works.',
    color: 'yellow',
    tags: ['Design', 'Motion', 'Generative art'],
  },
]

export const education = [
  {
    degree: 'BTech — Data Science',
    school: 'NMIMS · Mukesh Patel School of Technology Management & Engineering',
    schoolShort: 'NMIMS / MPSTME',
    location: 'Mumbai',
    start: '2022',
    end: '2028',
    // Optional — delete the array (or leave it empty) to hide coursework.
  },
  {
    degree: 'Secondary Education',
    school: 'Bombay Cambridge International School',
    schoolShort: 'BCIS',
    location: 'Mumbai',
    start: '2010',
    end: '2022',
    // Optional — delete the array (or leave it empty) to hide coursework.
  },
]
