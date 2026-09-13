import MagneticButton from "../components/MagneticButton"
import { EVENT } from "../data/content"

export default function TicketSection() {
  return (
    <section id="visit" className="ticket">
      <p className="kicker">YOUR NIGHT STARTS HERE.</p>
      <h2 className="display">
        TAKE
        <br />
        THE PASS.
      </h2>
      <article className="pass" data-cursor="button">
        <header>
          <span>{EVENT.code}</span>
          <strong>ENTRY PASS</strong>
        </header>
        <h3>{EVENT.name}</h3>
        <p>
          {EVENT.dateShort}
          <br />
          {EVENT.hours}
          <br />
          {EVENT.place}
        </p>
        <div className="pass__code" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <i key={i} style={{ height: `${30 + ((i * 17) % 50)}%` }} />
          ))}
        </div>
      </article>
      <MagneticButton className="btn btn--primary">GET YOUR PASS →</MagneticButton>
    </section>
  )
}
