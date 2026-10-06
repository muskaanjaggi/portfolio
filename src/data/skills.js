/**
 * SKILLS — shown as an interactive cluster.
 * Keep only what you genuinely use. `note` appears on hover/focus.
 * `size`: 'xl' | 'lg' | 'md' controls visual weight (not a rating).
 * `group` lets the legend highlight related skills.
 */

export const skillGroups = {
  code: { label: 'Code', color: 'pink' },
  data: { label: 'Data & AI', color: 'lime' },
  make: { label: 'Make', color: 'yellow' },
}

export const skills = [
  { name: 'Python', group: 'data', size: 'xl', note: 'Data analysis · ML · automation' },
  { name: 'Data Analysis', group: 'data', size: 'lg', note: 'Cleaning, exploring and explaining datasets' },
  { name: 'Machine Learning', group: 'data', size: 'lg', note: 'Build Ml models' },
  { name: 'SQL', group: 'data', size: 'md', note: 'CRUD operations' },
  { name: 'AI', group: 'data', size: 'xl', note: 'Claude, GPT, Learning everyday' },
  { name: 'JavaScript', group: 'code', size: 'lg', note: 'Interactive front-endsn like this one' },
  { name: 'React', group: 'code', size: 'xl', note: 'Component-driven interfaces' },
  { name: 'HTML / CSS', group: 'code', size: 'md', note: 'Layout, typography, responsive design' },
  { name: 'Design', group: 'make', size: 'lg', note: 'Basic girl using Canva' },
]
