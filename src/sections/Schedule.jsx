import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import SectionBackground from "../components/SectionBackground"
import { SCHEDULE } from "../data/content"
import { useReducedMotion } from "../hooks/useReducedMotion"

gsap.registerPlugin(ScrollTrigger)

export default function Schedule() {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined
    const line = root.current.querySelector(".time__line span")
    const tween = gsap.fromTo(
      line,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 40%", scrub: true },
      },
    )
    return () => tween.kill()
  }, [reduced])

  return (
    <section className="time" ref={root}>
      <SectionBackground image="/images/schedule-bg.jpg" opacity={0.45} />
      <p className="kicker">THE NIGHT UNFOLDS.</p>
      <h2 className="display">FOLLOW THE HOUR.</h2>
      <div className="time__line" aria-hidden="true">
        <span />
      </div>
      <ol className="time__row">
        {SCHEDULE.map((item) => (
          <li key={item.hour} data-cursor="link">
            <b>{item.hour}</b>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
