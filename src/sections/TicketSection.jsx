import { useState } from "react"
import MagneticButton from "../components/MagneticButton"
import SectionBackground from "../components/SectionBackground"
import { useExperience } from "../context/ExperienceContext"
import { EVENT, PASS_TIERS } from "../data/content"

export default function TicketSection() {
  const [selected, setSelected] = useState(PASS_TIERS[1] || PASS_TIERS[0])
  const { setActivePassPayment } = useExperience()

  const handlePassClick = (tier) => {
    setSelected(tier)
    setActivePassPayment(tier)
  }

  return (
    <section id="visit" className="ticket">
      <SectionBackground image="/images/ticket-bg.jpg" opacity={0.52} />
      <p className="kicker">YOUR NIGHT STARTS HERE.</p>
      <h2 className="display">
        TAKE
        <br />
        THE PASS.
      </h2>
      <div className="passes__grid">
        {PASS_TIERS.map((tier) => (
          <article
            key={tier.id}
            className={`pass ${selected.id === tier.id ? "is-selected" : ""}`}
            data-cursor="button"
            onClick={() => handlePassClick(tier)}
          >
            <header>
              <span>{EVENT.code} · {tier.tier}</span>
              <strong className="pass__price">{tier.price}</strong>
            </header>
            <span className="pass__tag">{tier.tag}</span>
            <h3>{tier.name}</h3>
            <p className="pass__details">
              {EVENT.dateShort} · {EVENT.hours}
              <br />
              {EVENT.place}
            </p>
            <ul className="pass__benefits">
              {tier.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="pass__code" aria-hidden="true">
              {Array.from({ length: 28 }, (_, i) => (
                <i key={i} style={{ height: `${30 + ((i * 17) % 50)}%` }} />
              ))}
            </div>
          </article>
        ))}
      </div>
      <MagneticButton
        className="btn btn--primary"
        onClick={() => setActivePassPayment(selected)}
      >
        GET {selected.name} — {selected.price} →
      </MagneticButton>
    </section>
  )
}
