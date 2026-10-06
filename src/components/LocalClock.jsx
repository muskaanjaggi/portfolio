import { useEffect, useState } from 'react'
import { profile } from '../data/profile'

const fmt = (tz, seconds) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    ...(seconds ? { second: '2-digit' } : {}),
    hour12: false,
    timeZone: tz,
  }).format(new Date())

/** Live local time in Muskaan's timezone (updates every second or minute). */
export default function LocalClock({ seconds = false, className = '' }) {
  const [time, setTime] = useState(() => fmt(profile.timezone, seconds))
  useEffect(() => {
    const id = setInterval(() => setTime(fmt(profile.timezone, seconds)), seconds ? 1000 : 15000)
    return () => clearInterval(id)
  }, [seconds])
  return (
    <time className={className} aria-label={`Local time in ${profile.location}: ${time}`}>
      {time}
    </time>
  )
}
