import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SectionBackground from "../components/SectionBackground"
import { INTRO_WORDS } from "../data/content"
import { useReducedMotion } from "../hooks/useReducedMotion"

gsap.registerPlugin(ScrollTrigger)

export default function MarketIntro() {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const ctx = gsap.context(() => {
      gsap.from(".intro__word", {
        y: 90,
        rotateX: 55,
        opacity: 0,
        filter: "blur(12px)",
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      })
      gsap.from(".intro__num", {
        scale: 1.4,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: ".intro__aside", start: "top 80%" },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="market" className="intro" ref={root}>
      <SectionBackground image="/images/intro-bg.jpg" opacity={0.48} />
      <p className="kicker">WHAT IS NIGHT MARKET?</p>
      <h2 className="intro__headline">
        {INTRO_WORDS.map((word) => (
          <span key={word.text} className={`intro__word depth-${word.depth}`}>
            {word.text}
          </span>
        ))}
      </h2>
      <div className="intro__aside">
        <p className="intro__num">01</p>
        <p className="intro__label">ONE NIGHT. THOUSANDS OF STORIES.</p>
        <p className="intro__copy">
          A collision of food, music, fashion, art, independent creators and unforgettable performances.
        </p>
      </div>
    </section>
  )
}
