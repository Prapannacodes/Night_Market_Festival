import { useRef, useState } from "react"
import { CREATORS } from "../data/content"
import { useExperience } from "../context/ExperienceContext"
import { useStampOnView } from "../hooks/useStampOnView"

export default function ArtSection() {
  const root = useRef(null)
  const [active, setActive] = useState(null)
  const { unlockStamp } = useExperience()
  useStampOnView(root, "art-hunter", 1400)

  return (
    <section className="art" ref={root}>
      <p className="kicker">THE PEOPLE</p>
      <h2 className="display">
        MAKING
        <br />
        THE NIGHT.
      </h2>
      <div className="art__field">
        {CREATORS.map((person, index) => (
          <article
            key={person.id}
            className={`creator ${active === person.id ? "is-on" : ""} ${active && active !== person.id ? "is-away" : ""}`}
            style={{ "--x": `${(index % 3) * 28 + 6}%`, "--y": `${Math.floor(index / 3) * 42 + index * 4}%` }}
            data-cursor="button"
            onMouseEnter={() => {
              setActive(person.id)
              unlockStamp("art-hunter")
            }}
            onMouseLeave={() => setActive(null)}
          >
            <div className="creator__face" aria-hidden="true">
              {person.name.slice(0, 1)}
            </div>
            <h3>{person.name}</h3>
            <p>{person.discipline}</p>
            {active === person.id ? <small>{person.bio}</small> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
