import { useEffect, useState } from "react"
import { NAV_LINKS } from "../data/nav"
import { useMagneticHover } from "../hooks/useMagneticHover"
import { useCompactScroll } from "../hooks/useScrollProgress"
import "../styles/navigation.css"

export default function Navigation() {
  const compact = useCompactScroll(48)
  const ctaRef = useMagneticHover(0.22)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const ids = ["hero", ...NAV_LINKS.map((link) => link.id)]
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { threshold: [0.25, 0.5, 0.75] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const go = (href) => {
    setOpen(false)
    const target = document.querySelector(href)
    const lenis = window.__nmLenis
    if (target && lenis) {
      lenis.scrollTo(target, { offset: -8 })
      return
    }
    target?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <a className="skip-link" href="#hero">
        SKIP TO MARKET
      </a>
      <header className={`hud ${compact ? "is-compact" : ""}`}>
        <div className="hud__plate">
          <div className="hud__mark">
            <span className="hud__code">NM/03</span>
            <span className="hud__sub">ACM/PS/03</span>
          </div>
          <p className="hud__status">
            <span className="hud__pulse" aria-hidden="true" />
            MARKET ONLINE
          </p>
        </div>

        <nav className="hud__nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`hud__link ${active === link.id ? "is-active" : ""}`}
              data-cursor="link"
              onClick={(event) => {
                event.preventDefault()
                go(link.href)
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hud__cta-wrap">
          <button
            ref={ctaRef}
            className="hud__cta"
            type="button"
            data-cursor="button"
            onClick={() => go("#visit")}
          >
            ENTER MARKET
            <span className="hud__cta-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </div>

        <button
          className="hud__menu"
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
        </button>
      </header>

      <div
        className={`hud__drawer ${open ? "is-open" : ""}`}
        hidden={!open}
        inert={!open || undefined}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            onClick={(event) => {
              event.preventDefault()
              go(link.href)
            }}
          >
            {link.label}
          </a>
        ))}
        <button type="button" onClick={() => go("#visit")}>
          ENTER MARKET →
        </button>
      </div>
    </>
  )
}
