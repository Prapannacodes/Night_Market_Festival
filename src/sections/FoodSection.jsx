import { useRef, useState } from "react"
import { DISHES } from "../data/content"
import { useExperience } from "../context/ExperienceContext"
import { useStampOnView } from "../hooks/useStampOnView"

export default function FoodSection() {
  const root = useRef(null)
  const [active, setActive] = useState(DISHES[0])
  const { unlockStamp } = useExperience()
  useStampOnView(root, "foodie", 1200)

  return (
    <section id="food" className="food" ref={root}>
      <p className="kicker">FOOD STREET</p>
      <h2 className="display">
        SCAN THE
        <br />
        STEAM.
      </h2>
      <div className="food__grid">
        <ul className="food__orbit">
          {DISHES.map((dish, i) => (
            <li key={dish.id} style={{ "--i": i }}>
              <button
                type="button"
                className={`food__orb ${active.id === dish.id ? "is-on" : ""}`}
                data-cursor="reticle"
                onMouseEnter={() => {
                  setActive(dish)
                  unlockStamp("foodie")
                }}
                onFocus={() => setActive(dish)}
              >
                <span>{dish.glyph}</span>
                <b>{dish.name}</b>
              </button>
            </li>
          ))}
        </ul>
        <aside className="scanner" aria-live="polite">
          <p>FOOD SCANNER // NM-CAM</p>
          <h3>{active.name}</h3>
          <dl>
            <div>
              <dt>STATUS</dt>
              <dd>{active.tag}</dd>
            </div>
            <div>
              <dt>SPICE LEVEL</dt>
              <dd>{"▲".repeat(active.spice) || "—"}</dd>
            </div>
            <div>
              <dt>VENDOR</dt>
              <dd>{active.vendor}</dd>
            </div>
            <div>
              <dt>AVAILABLE TONIGHT</dt>
              <dd>YES</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  )
}
