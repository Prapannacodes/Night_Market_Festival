import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MagneticButton from "../components/MagneticButton"
import SectionBackground from "../components/SectionBackground"
import { EVENT } from "../data/content"
import { useReducedMotion } from "../hooks/useReducedMotion"

gsap.registerPlugin(ScrollTrigger)

export default function FinalCTA() {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.from(".finale__orb", {
        y: 160,
        scale: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", end: "top 20%", scrub: true },
      })
      gsap.from(".finale__seq span", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: { trigger: ".finale__seq", start: "top 80%" },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const go = () => {
    window.__nmLenis?.scrollTo("#visit", { offset: -8 })
  }

  return (
    <section className="finale" ref={root}>
      <SectionBackground image="/images/finale-bg.jpg" opacity={0.55} />
      <div className="finale__orb" aria-hidden="true" />
      <h2 className="finale__title">
        SEE YOU
        <br />
        AFTER DARK.
      </h2>
      <p className="finale__seq">
        <span>FOOD.</span>
        <span>MUSIC.</span>
        <span>ART.</span>
        <span>PEOPLE.</span>
        <span>ONE NIGHT.</span>
      </p>
      <p className="finale__brand">
        {EVENT.name}
        <small>{EVENT.code}</small>
      </p>
      <MagneticButton className="btn btn--primary" onClick={go}>
        ENTER THE NIGHT →
      </MagneticButton>
    </section>
  )
}
