import { useEffect } from 'react'

const BASE = 'Muskaan Jaggi — Data × AI × Creative Technology'

/** Sets <title> (and the meta description when given) per page. */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — Muskaan Jaggi` : BASE
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
