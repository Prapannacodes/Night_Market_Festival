import SectionBackground from "../components/SectionBackground"
import { STAMPS } from "../data/content"
import { useExperience } from "../context/ExperienceContext"

export default function PassportSection() {
  const { stamps, reward, setPassportOpen } = useExperience()
  const collected = stamps.filter((id) => id !== "champion").length

  return (
    <section className="passport-sec">
      <SectionBackground image="/images/intro-bg.jpg" opacity={0.42} />
      <p className="kicker">THE NIGHT MARKET PASSPORT</p>
      <h2 className="display">COLLECT THE NIGHT.</h2>
      <p className="lede">
        {collected} / {STAMPS.length} STAMPS COLLECTED
      </p>
      <div className="passport-sec__row">
        {STAMPS.map((stamp) => (
          <button
            key={stamp.id}
            type="button"
            className={`stamp ${stamps.includes(stamp.id) ? "is-on" : ""}`}
            data-cursor="button"
            onClick={() => setPassportOpen(true)}
          >
            {stamp.label}
          </button>
        ))}
        <button type="button" className={`stamp ${stamps.includes("champion") ? "is-on" : ""}`} onClick={() => setPassportOpen(true)}>
          CHAMPION
        </button>
      </div>
      {reward?.code ? <p className="lede">Reward stored: {reward.code}</p> : null}
    </section>
  )
}
