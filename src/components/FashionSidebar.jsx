import { useCallback, useEffect, useState } from "react"

export default function FashionSidebar({ fashion, onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const [savedItems, setSavedItems] = useState({})

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 320)
  }, [onClose])

  // Handle ESC key to close
  useEffect(() => {
    if (!fashion) return
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [fashion, handleClose])

  // Prevent background body scroll while drawer is open
  useEffect(() => {
    if (fashion) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [fashion])

  if (!fashion) return null

  const toggleItem = (itemId) => {
    setSavedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const handleLocateOnRunway = () => {
    handleClose()
    setTimeout(() => {
      const fashionEl = document.getElementById("fashion")
      if (fashionEl) {
        fashionEl.scrollIntoView({ behavior: "smooth" })
      }
    }, 350)
  }

  return (
    <div
      className={`vendor-drawer-wrapper fashion-drawer-wrapper ${isClosing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fashion-drawer-title"
    >
      <div
        className="vendor-drawer__scrim"
        onClick={handleClose}
        aria-label="Close fashion details"
      />
      <aside className="vendor-drawer__panel fashion-drawer__panel">
        <header className="vendor-drawer__header">
          <div>
            <span className="vendor-drawer__stall-badge">
              STALL {fashion.stall} · {fashion.tag}
            </span>
            <h2 id="fashion-drawer-title" className="vendor-drawer__title">
              {fashion.title}
            </h2>
          </div>
          <button
            type="button"
            className="vendor-drawer__close-btn"
            onClick={handleClose}
            aria-label="Close fashion drawer"
            data-cursor="button"
          >
            ✕
          </button>
        </header>

        <div className="vendor-drawer__body">
          <div
            className="vendor-drawer__banner"
            style={{ backgroundImage: `url(${fashion.image})` }}
          >
            <div className="vendor-drawer__banner-shade" />
            <div className="vendor-drawer__banner-badge">
              <span className="live-dot" /> LIVE ON RUNWAY · 4 DROPS
            </div>
          </div>

          <div className="vendor-drawer__meta">
            <div className="vendor-drawer__meta-pill">
              <strong>DESIGNER / CURATOR</strong>
              <span>{fashion.designer}</span>
            </div>
            <div className="vendor-drawer__meta-pill">
              <strong>RUNWAY LOCATION</strong>
              <span>{fashion.zone}</span>
            </div>
            <div className="vendor-drawer__meta-pill">
              <strong>HOURS</strong>
              <span>{fashion.hours}</span>
            </div>
            <div className="vendor-drawer__meta-pill">
              <strong>FITTING BOOTH</strong>
              <span>ON-SITE TRY-ON</span>
            </div>
          </div>

          <div className="vendor-drawer__desc-block">
            <h3>STYLE PROFILE & CONCEPT</h3>
            <p>{fashion.description}</p>
          </div>

          <div className="vendor-drawer__catalog">
            <div className="vendor-drawer__catalog-header">
              <h3>RUNWAY COLLECTION & PIECES</h3>
              <span>{fashion.items?.length || 0} PIECES</span>
            </div>

            <div className="vendor-drawer__items-list">
              {fashion.items?.map((item) => {
                const isSelected = !!savedItems[item.id]
                return (
                  <article
                    key={item.id}
                    className={`vendor-item-card fashion-item-card ${isSelected ? "is-selected" : ""}`}
                  >
                    <div className="vendor-item-card__header">
                      <div className="vendor-item-card__info">
                        <span className="vendor-item-card__tag">{item.tag}</span>
                        <h4 className="vendor-item-card__title">{item.name}</h4>
                      </div>
                      <div className="vendor-item-card__price-wrap">
                        <strong className="vendor-item-card__price">{item.price}</strong>
                      </div>
                    </div>
                    <p className="vendor-item-card__desc">{item.desc}</p>
                    
                    <div className="fashion-item-card__specs">
                      {item.fabric && (
                        <div className="fashion-spec-chip">
                          <strong>FABRIC:</strong> {item.fabric}
                        </div>
                      )}
                      {item.sizes && (
                        <div className="fashion-spec-chip">
                          <strong>SIZES:</strong> {item.sizes}
                        </div>
                      )}
                    </div>

                    <div className="vendor-item-card__action">
                      <button
                        type="button"
                        className={`vendor-item-btn fashion-item-btn ${isSelected ? "is-added" : ""}`}
                        onClick={() => toggleItem(item.id)}
                        data-cursor="button"
                      >
                        {isSelected ? "✓ SAVED TO TRY-ON LIST" : "+ ADD TO TRY-ON LIST"}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <footer className="vendor-drawer__footer">
          <button
            type="button"
            className="btn-drawer btn-drawer--map btn-drawer--fashion"
            onClick={handleLocateOnRunway}
            data-cursor="button"
          >
            📍 LOCATE ON RUNWAY
          </button>
          <button
            type="button"
            className="btn-drawer btn-drawer--close"
            onClick={handleClose}
            data-cursor="button"
          >
            CLOSE
          </button>
        </footer>
      </aside>
    </div>
  )
}
