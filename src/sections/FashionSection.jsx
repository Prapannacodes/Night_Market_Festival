import SectionBackground from "../components/SectionBackground"
import { useExperience } from "../context/ExperienceContext"
import { FASHION_STYLES } from "../data/content"

export default function FashionSection() {
  const { setActiveFashionDrawer } = useExperience()

  return (
    <section className="fashion" id="fashion">
      <SectionBackground image="/images/fashion-bg.jpg" opacity={0.48} />
      <div className="fashion__copy">
        <p className="kicker">FASHION ROW</p>
        <h2 className="display fashion__title">
          WEAR
          <br />
          THE
          <br />
          NIGHT.
        </h2>
        <ul>
          <li>LOCAL DESIGNERS</li>
          <li>LIMITED DROPS</li>
          <li>CUSTOM PIECES</li>
        </ul>
      </div>
      <div className="fashion__runway">
        {FASHION_STYLES.map((look) => (
          <figure
            key={look.id}
            className="fashion__strip"
            data-cursor="button"
            role="button"
            tabIndex={0}
            aria-label={`Open ${look.title} fashion collection`}
            onClick={() => setActiveFashionDrawer(look)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setActiveFashionDrawer(look)
              }
            }}
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(8, 4, 14, 0.2) 0%, rgba(8, 4, 14, 0.75) 75%, rgba(8, 4, 14, 0.95) 100%), url(${look.image})`,
            }}
          >
            <span>{look.title}</span>
          </figure>
        ))}
      </div>
    </section>
  )
}

