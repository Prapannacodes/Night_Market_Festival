import SectionBackground from "../components/SectionBackground"

const LOOKS = [
  { id: "static", title: "STATIC THREADS", image: "/images/fashion-static-threads.jpg" },
  { id: "after", title: "AFTER DARK", image: "/images/fashion-after-dark.jpg" },
  { id: "lumen", title: "LUMEN TAILOR", image: "/images/fashion-lumen-tailor.jpg" },
  { id: "silk", title: "NIGHT SILK", image: "/images/fashion-night-silk.jpg" },
]

export default function FashionSection() {
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
      <div className="fashion__runway" aria-hidden="true">
        {LOOKS.map((look) => (
          <figure
            key={look.id}
            className="fashion__strip"
            data-cursor="link"
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
