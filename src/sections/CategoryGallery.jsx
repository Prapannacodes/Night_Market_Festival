import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SectionBackground from "../components/SectionBackground"
import { CATEGORIES } from "../data/content"
import { useReducedMotion } from "../hooks/useReducedMotion"

gsap.registerPlugin(ScrollTrigger)

export default function CategoryGallery() {
  const section = useRef(null)
  const track = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const node = section.current
    const row = track.current
    const mm = gsap.matchMedia()
    mm.add("(min-width: 901px)", () => {
      const tween = gsap.to(row, {
        x: () => -(row.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: node,
          start: "top top",
          end: () => `+=${Math.max(row.scrollWidth - window.innerWidth, 500)}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })
    return () => mm.revert()
  }, [reduced])

  return (
    <section className="flavours" ref={section} aria-label="Market flavours">
      <SectionBackground image="/images/categories-bg.jpg" opacity={0.45} />
      <div className="flavours__track" ref={track}>
        {CATEGORIES.map((cat) => (
          <article key={cat.id} className="flavour" style={{ "--tone": cat.tone }} data-cursor="button">
            <p className="flavour__num">{cat.num}</p>
            <h3>{cat.title}</h3>
            <p className="flavour__line">{cat.line}</p>
            <p className="flavour__copy">{cat.copy}</p>
            <div className="flavour__visual" aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  )
}
