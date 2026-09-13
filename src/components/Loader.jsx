import { useEffect, useState } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useExperience } from "../context/ExperienceContext"
import { useReducedMotion } from "../hooks/useReducedMotion"

export default function Loader() {
  const { ready, setReady } = useExperience()
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState("neon")
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (reduced) {
      setReady(true)
      return undefined
    }

    let frame
    const start = performance.now()
    const duration = 2200

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(Math.round(t * 100))
      if (t > 0.22) setPhase("init")
      if (t >= 1) {
        setLeaving(true)
        window.setTimeout(() => setReady(true), 620)
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduced, setReady])

  useEffect(() => {
    if (ready) {
      window.__nmLenis?.start()
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return undefined
    }
    let id
    const halt = () => {
      if (window.__nmLenis) {
        window.__nmLenis.stop()
        return
      }
      id = requestAnimationFrame(halt)
    }
    halt()
    return () => cancelAnimationFrame(id)
  }, [ready])

  if (ready) return null

  return (
    <div className={`loader ${leaving ? "is-leaving" : ""}`} role="status" aria-live="polite">
      <div className="loader__slice" />
      <div className="loader__slice" />
      <div className="loader__slice" />
      <div className="loader__slice" />
      <div className="loader__slice" />
      <div className="loader__copy">
        <p className={`loader__neon ${phase === "neon" ? "is-flicker" : ""}`}>NIGHT MARKET</p>
        <p className="loader__init">INITIALIZING NIGHT MARKET...</p>
        <div className="loader__term">
          <span>SYS/ACM-PS-03</span>
          <span>{String(progress).padStart(3, "0")}%</span>
        </div>
        <div className="loader__bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
