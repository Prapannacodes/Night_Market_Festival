import { useState } from "react"
import SectionBackground from "../components/SectionBackground"
import { useExperience } from "../context/ExperienceContext"
import { VENDORS } from "../data/content"

export default function VendorSection() {
  const [active, setActive] = useState(null)
  const { setActiveVendorDrawer } = useExperience()

  return (
    <section id="vendors" className="vendors">
      <SectionBackground image="/images/vendors-bg.jpg" opacity={0.5} />
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
            onClick={() => setActiveVendorDrawer(vendor)}
          >
            <div
              className="stall__bg"
              style={{ backgroundImage: `url(${vendor.image})` }}
              aria-hidden="true"
            />
            <div className="stall__shade" aria-hidden="true" />
            <div className="stall__content">
              <p>{vendor.stall}</p>
              <h3>{vendor.name}</h3>
              <span>{vendor.cat}</span>
              {active === vendor.id ? <b>VISIT STALL →</b> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
