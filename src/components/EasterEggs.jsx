import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { gsap } from '../animations/gsap'

/**
 * Tiny secrets:
 *  • ↑ ↑ ↓ ↓ ← → ← → B A  → "party mode" (palette goes a bit feral)
 *  • Click the big name in the hero → a note
 *  • A hello in the dev console for the curious
 */
const EggContext = createContext({ toast: () => {} })
export const useEasterEgg = () => useContext(EggContext)

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function EasterEggProvider({ children }) {
  const [message, setMessage] = useState('')
  const el = useRef(null)
  const timer = useRef(0)

  const toast = useCallback((text) => {
    setMessage(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(''), 2800)
  }, [])

  useEffect(() => {
    if (message && el.current) gsap.fromTo(el.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(2)' })
  }, [message])

  useEffect(() => {
    console.log(
      '%c hey, you opened the console :) %c\nThis site is hand-built with React, Three.js & GSAP.\nTry the Konami code.',
      'background:#FF4FA3;color:#111;font:700 14px monospace;padding:6px 10px;border-radius:6px',
      'color:inherit;font:12px monospace',
    )
    let pos = 0
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0
      if (pos === KONAMI.length) {
        pos = 0
        const on = document.documentElement.classList.toggle('party')
        toast(on ? 'party mode: on ✺' : 'party mode: off')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toast])

  return (
    <EggContext.Provider value={{ toast }}>
      {children}
      <div role="status" aria-live="polite" className="visually-hidden">{message}</div>
      {message && (
        <div ref={el} className="toast" aria-hidden="true">
          {message}
        </div>
      )}
    </EggContext.Provider>
  )
}
