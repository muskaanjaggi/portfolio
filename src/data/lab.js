/**
 * THE LAB — the playground. Things that don't need to be "projects".
 *
 * `kind` decides how the object is drawn:
 *   'note'     — sticky note (text)
 *   'code'     — tiny terminal snippet (text = the code)
 *   'image'    — polaroid (set `image` to a path in /public/images/…)
 *   'sticker'  — round sticker (short text)
 *   'kmeans'   — the live k-means toy (a real, interactive experiment)
 *   'idea'     — index-card for a startup / weird idea
 *
 * `x`, `y` are percentages on the desktop board; `r` is rotation (deg).
 * On phones the board becomes a swipeable stack, so positions don't matter.
 */

export const labIntro = {
  heading: ['Not everything', 'needs to be', 'a project.'],
  body: 'A drawer of experiments, sketches, prototypes and half-ideas. Drag things around — nothing in here is precious.',
}

export const labItems = [
  { id: 'kmeans', kind: 'kmeans', title: 'k-means, by hand', caption: 'Click to add points. Watch them find their people.', color: 'ink', x: 4, y: 6, r: -2, w: 360 },
  { id: 'note-1', kind: 'note', title: 'Idea', text: 'What if every chart had a "why should I care" button?', color: 'yellow', x: 40, y: 2, r: 4, w: 230 },
  { id: 'code-1', kind: 'code', title: 'currently.py', text: 'while curious:\n    build()\n    break_things()\n    learn()', color: 'ink', x: 62, y: 12, r: -3, w: 280 },
  { id: 'img-1', kind: 'image', title: '[PHOTO / SKETCH]', image: '', caption: '[CAPTION — replace in src/data/lab.js]', color: 'coral', x: 38, y: 40, r: -5, w: 230 },
  { id: 'sticker-1', kind: 'sticker', text: 'made in mumbai', color: 'pink', x: 86, y: 4, r: 12, w: 130 },
  { id: 'idea-1', kind: 'idea', title: 'Petals & Pixels', text: 'A creative platform to design and customize personalized digital bouquets with flowers, colors, and arrangements.', color: 'lime', x: 68, y: 50, r: 3, w: 260 },
  { id: 'note-2', kind: 'note', title: 'Experiment', text: '[A UI / ANIMATION EXPERIMENT — link it when ready]', color: 'purple', x: 8, y: 62, r: 3, w: 240 },
  { id: 'sticker-2', kind: 'sticker', text: 'drag me ↔', color: 'yellow', x: 84, y: 70, r: -10, w: 120 },
]
