import { lazy, Suspense, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MagneticButton from "../components/MagneticButton"
import { EVENT } from "../data/content"
import { useExperience } from "../context/ExperienceContext"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { marketRuntime } from "../runtime/marketRuntime"

gsap.registerPlugin(ScrollTrigger)

const HeroCanvas = lazy(() => import("../three/HeroCanvas"))

export default function Hero() {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const { night, unlockStamp } = useExperience()
  const [active, setActive] = useState(true)

  useEffect(() => {
    marketRuntime.night = night
    marketRuntime.reduced = reduced
  }, [night, reduced])

  useEffect(() => {
    const timer = setTimeout(() => unlockStamp("nightowl"), 2400)
    return () => clearTimeout(timer)
  }, [unlockStamp])

  useEffect(() => {
    const node = root.current
    if (!node) return undefined

    const onMove = (event) => {
      marketRuntime.mouseX = event.clientX / window.innerWidth
      marketRuntime.mouseY = event.clientY / window.innerHeight
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    if (reduced) {
      marketRuntime.scroll = 0
      return () => window.removeEventListener("pointermove", onMove)
    }

    const title = node.querySelector(".hero__title")
    const rest = node.querySelectorAll(".hero__meta, .hero__actions, .hero__kicker")
    const trigger = ScrollTrigger.create({
      trigger: node,
      start: "top top",
      end: "+=160%",
      pin: true,
      scrub: 1.1,
      onUpdate: (self) => {
        marketRuntime.scroll = self.progress
        marketRuntime.intensity = 1 + self.progress * 2
        if (title) {
          title.style.transform = `translate3d(0, ${self.progress * -80}px, 0) scale(${1 + self.progress * 0.12})`
          title.style.opacity = String(1 - self.progress * 1.15)
          title.style.filter = `blur(${self.progress * 8}px)`
          title.style.letterSpacing = `${self.progress * 0.35}em`
        }
        rest.forEach((el, i) => {
          el.style.opacity = String(1 - self.progress * 1.4)
          el.style.transform = `translate3d(0, ${self.progress * -40 * (i + 1)}px, 0)`
        })
      },
      onEnter: () => setActive(true),
      onEnterBack: () => setActive(true),
      onLeave: () => setActive(false),
    })

    return () => {
      trigger.kill()
      window.removeEventListener("pointermove", onMove)
    }
  }, [reduced])

  const go = (id) => {
    const target = document.querySelector(id)
    window.__nmLenis?.scrollTo(target, { offset: -8 })
  }

  return (
    <section id="hero" className="hero" ref={root}>
      <div className="hero__stage" data-cursor="reticle">
        <Suspense fallback={<div className="hero__fallback" />}>
          <HeroCanvas active={active} />
        </Suspense>
      </div>
      <div className="hero__veil" aria-hidden="true" />
      <div className="hero__copy">
        <p className="hero__kicker">{EVENT.code}</p>
        <h1 className="hero__title">
          <span>NIGHT</span>
          <span>MARKET</span>
        </h1>
        <p className="hero__meta">FOOD / FASHION / MUSIC / ART / PERFORMANCE</p>
        <p className="hero__meta hero__meta--dim">
          {EVENT.date} · {EVENT.place} · {EVENT.hours}
        </p>
        <div className="hero__actions">
          <MagneticButton className="btn btn--primary" onClick={() => go("#visit")}>
            ENTER THE MARKET →
          </MagneticButton>
          <MagneticButton className="btn btn--ghost" onClick={() => go("#lineup")}>
            EXPLORE LINEUP
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
