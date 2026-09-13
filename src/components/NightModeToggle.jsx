import { useExperience } from "../context/ExperienceContext"

export default function NightModeToggle() {
  const { night, setNight, sound, setSound } = useExperience()
  return (
    <div className="float-toggles">
      <button
        className={`night-toggle ${night ? "is-on" : ""}`}
        type="button"
        data-cursor="button"
        aria-pressed={night}
        onClick={() => setNight(!night)}
      >
        NIGHT MODE
      </button>
      <button
        className="night-toggle"
        type="button"
        data-cursor="button"
        aria-pressed={sound}
        onClick={() => setSound(!sound)}
      >
        SOUND {sound ? "ON" : "OFF"}
      </button>
    </div>
  )
}
