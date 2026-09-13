import { STAMPS } from "../data/content"
import { useExperience } from "../context/ExperienceContext"

export default function PassportDock() {
  const { stamps, reward, passportOpen, setPassportOpen } = useExperience()
  const count = stamps.filter((id) => id !== "champion").length
  const max = STAMPS.length

  return (
    <>
      <button
        className="passport-dock"
        type="button"
        data-cursor="button"
        onClick={() => setPassportOpen(true)}
        aria-label="Open Night Market passport"
      >
        <span>PASSPORT NM/03</span>
        <strong>
          {Math.min(count, max)} / {max}
        </strong>
      </button>

      {passportOpen ? (
        <div className="passport-modal" role="dialog" aria-modal="true" aria-labelledby="passport-title">
          <button className="passport-modal__scrim" type="button" aria-label="Close passport" onClick={() => setPassportOpen(false)} />
          <article className="passport-card">
            <header>
              <p>PASSPORT</p>
              <h2 id="passport-title">NM/03</h2>
            </header>
            <ul>
              {STAMPS.map((stamp) => (
                <li key={stamp.id} className={stamps.includes(stamp.id) ? "is-on" : ""}>
                  <b>{stamp.label}</b>
                  <span>{stamps.includes(stamp.id) ? "STAMPED" : stamp.hint}</span>
                </li>
              ))}
              <li className={stamps.includes("champion") ? "is-on is-champ" : ""}>
                <b>MARKET CHAMPION</b>
                <span>{stamps.includes("champion") ? "ARCADE CLEARED" : "Win a discount"}</span>
              </li>
            </ul>
            {reward?.code ? (
              <p className="passport-card__code">
                CHAMPION · {reward.label}
                <strong>{reward.code}</strong>
              </p>
            ) : null}
            <button type="button" data-cursor="button" onClick={() => setPassportOpen(false)}>
              CLOSE
            </button>
          </article>
        </div>
      ) : null}
    </>
  )
}
