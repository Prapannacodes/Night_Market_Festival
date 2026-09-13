import { EVENT } from "../data/content"

export default function Footer() {
  return (
    <footer className="site-foot">
      <div>
        <p>{EVENT.code}</p>
        <strong>NIGHT MARKET FESTIVAL</strong>
      </div>
      <nav aria-label="Footer">
        <a href="https://instagram.com" data-cursor="link">
          Instagram
        </a>
        <a href="https://x.com" data-cursor="link">
          X
        </a>
        <a href="mailto:night@market.festival" data-cursor="link">
          Contact
        </a>
        <a href="#visit" data-cursor="link">
          Location
        </a>
        <a href="#market" data-cursor="link">
          FAQ
        </a>
      </nav>
      <p className="hud__status">
        <span className="hud__pulse" aria-hidden="true" />
        MARKET ONLINE
      </p>
    </footer>
  )
}
