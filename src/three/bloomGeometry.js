/**
 * Generates the "Data Bloom" point cloud.
 * Shared by the WebGL scene and the lightweight SVG fallback so both
 * look like the same object.
 *
 * Six clusters → six petals (like a k-means scatter plot), a dense
 * "centroid" core, and a sprinkle of outliers — because real data has noise.
 */

export const BLOOM_COLORS = ['#FF4FA3', '#FF6B57', '#FFD84D', '#C7F36B', '#8C5CFF', '#FFF8EF']
const CORE = '#FFD84D'
const NOISE = '#FFF8EF'

// Small deterministic PRNG so the shape is identical on every load
export function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const gauss = (rand) => {
  const u = Math.max(rand(), 1e-6)
  const v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function generateBloom(count, { clusters = 6, length = 2.2, seed = 7 } = {}) {
  const rand = mulberry32(seed)
  const points = []

  for (let i = 0; i < count; i++) {
    const roll = rand()
    let x, y, z, color, size

    if (roll < 0.1) {
      // Core / centroid
      const r = Math.abs(gauss(rand)) * 0.28
      const a = rand() * Math.PI * 2
      x = Math.cos(a) * r
      y = Math.sin(a) * r
      z = gauss(rand) * 0.15
      color = CORE
      size = 1.1
    } else if (roll < 0.17) {
      // Outliers
      const r = 0.8 + rand() * 3.2
      const a = rand() * Math.PI * 2
      x = Math.cos(a) * r
      y = Math.sin(a) * r
      z = gauss(rand) * 0.9
      color = NOISE
      size = 0.6 + rand() * 0.5
    } else {
      // Petal cluster
      const c = i % clusters
      const theta = (c / clusters) * Math.PI * 2 + 0.25
      const along = Math.pow(rand(), 0.75) * length
      const u = along / length
      const width = Math.sin(Math.PI * Math.min(u * 1.05, 1)) * 0.52
      const across = gauss(rand) * width * 0.55
      const lx = 0.18 + along
      const ly = across
      x = lx * Math.cos(theta) - ly * Math.sin(theta)
      y = lx * Math.sin(theta) + ly * Math.cos(theta)
      z = gauss(rand) * 0.12 * (1 - u) - 0.45 * u * u
      color = BLOOM_COLORS[c % BLOOM_COLORS.length]
      size = 0.7 + rand() * 0.8 + (1 - u) * 0.3
    }

    points.push({ x, y, z, color, size, r: [rand(), rand(), rand()] })
  }
  return points
}
