import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Lets you `import vertex from './shader.vert.glsl?raw'`
  assetsInclude: ['**/*.glsl'],
  build: {
    target: 'es2020',
    // The WebGL chunk (three + R3F) is lazy-loaded on desktop only
    chunkSizeWarningLimit: 1000,
  },
})
