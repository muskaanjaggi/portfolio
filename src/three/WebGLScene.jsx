import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { generateBloom } from './bloomGeometry'
import { scrollState } from '../animations/smoothScroll'
import noise from '../shaders/noise.glsl?raw'
import vertexShader from '../shaders/bloom.vert.glsl?raw'
import fragmentShader from '../shaders/bloom.frag.glsl?raw'

// Pointer in normalised device coords, tracked globally so the canvas can
// sit *behind* the hero text with pointer-events: none.
const pointer = new THREE.Vector2(0, 0)

function Bloom({ count, onFrame }) {
  const group = useRef()
  const target = useMemo(() => new THREE.Vector2(), [])

  const { geometry, material } = useMemo(() => {
    const pts = generateBloom(count)
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)
    const siz = new Float32Array(count)
    const c = new THREE.Color()
    pts.forEach((p, i) => {
      pos.set([p.x, p.y, p.z], i * 3)
      c.set(p.color)
      col.set([c.r, c.g, c.b], i * 3)
      rnd.set(p.r, i * 3)
      siz[i] = p.size
    })
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    geometry.setAttribute('aRand', new THREE.BufferAttribute(rnd, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(siz, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader.replace('#include <noise>', noise),
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uVelocity: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
        uSize: { value: 34 },
        uMouse: { value: new THREE.Vector2(99, 99) },
      },
    })
    return { geometry, material }
  }, [count])

  // Free GPU memory when the hero unmounts (e.g. route change)
  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  useFrame((state, delta) => {
    const u = material.uniforms
    const dt = Math.min(delta, 0.05)
    u.uTime.value += dt

    const { width, height } = state.viewport
    target.set((pointer.x * width) / 2, (pointer.y * height) / 2)
    u.uMouse.value.lerp(target, 0.1)

    const heroProgress = Math.min(scrollState.y / window.innerHeight, 1.5)
    u.uScroll.value += (heroProgress - u.uScroll.value) * 0.08
    u.uVelocity.value += (Math.abs(scrollState.velocity) - u.uVelocity.value) * 0.1

    const g = group.current
    g.rotation.z += dt * 0.06
    g.rotation.x += (-pointer.y * 0.35 - 0.35 - g.rotation.x) * 0.04
    g.rotation.y += (pointer.x * 0.45 - g.rotation.y) * 0.04

    onFrame?.(u.uTime.value)
  })

  return (
    <group ref={group} position={[1.3, 0.1, 0]}>
      <points geometry={geometry} material={material} />
    </group>
  )
}

export default function WebGLScene({ count = 7000, onFrame, className }) {
  const wrap = useRef()
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    // Stop rendering entirely when the hero is off-screen
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '100px' })
    io.observe(wrap.current)
    return () => {
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [])

  return (
    <div
      ref={wrap}
      className={className}
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 1.4s ease' }}
    >
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        onCreated={() => requestAnimationFrame(() => setReady(true))}
        style={{ pointerEvents: 'none' }}
      >
        <Bloom count={count} onFrame={onFrame} />
      </Canvas>
    </div>
  )
}
