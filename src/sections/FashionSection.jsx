const LOOKS = ["STATIC THREADS", "AFTER DARK", "LUMEN TAILOR", "NIGHT SILK"]

export default function FashionSection() {
  return (
    <section className="fashion" id="fashion">
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
          <figure key={look} className="fashion__strip" data-cursor="link">
            <span>{look}</span>
          </figure>
        ))}
      </div>
    </section>
  )
}
