import { useState } from "react"
import { VENDORS } from "../data/content"

export default function VendorSection() {
  const [active, setActive] = useState(null)
  return (
    <section id="vendors" className="vendors">
      <p className="kicker">MEET THE MAKERS.</p>
      <h2 className="display">WALK THE STALLS.</h2>
      <div className="vendors__lane">
        {VENDORS.map((vendor, i) => (
          <article
            key={vendor.id}
            className={`stall ${active === vendor.id ? "is-on" : ""}`}
            style={{ "--z": i }}
            data-cursor="button"
            onMouseEnter={() => setActive(vendor.id)}
            onMouseLeave={() => setActive(null)}
          >
            <p>{vendor.stall}</p>
            <h3>{vendor.name}</h3>
            <span>{vendor.cat}</span>
            {active === vendor.id ? <b>VISIT STALL →</b> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
