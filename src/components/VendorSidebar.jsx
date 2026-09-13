import { useCallback, useEffect, useState } from "react"

export default function VendorSidebar({ vendor, onClose }) {
  const [isClosing, setIsClosing] = useState(false)
  const [addedItems, setAddedItems] = useState({})

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 320)
  }, [onClose])

  // Handle ESC key to close
  useEffect(() => {
    if (!vendor) return
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [vendor, handleClose])

  // Prevent background body scroll while drawer is open
  useEffect(() => {
    if (vendor) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [vendor])

  if (!vendor) return null

  const toggleItem = (itemId) => {
    setAddedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const handleLocateOnMap = () => {
    handleClose()
    setTimeout(() => {
      const mapEl = document.getElementById("map")
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: "smooth" })
      }
    }, 350)
  }

  return (
    <div
      className={`vendor-drawer-wrapper ${isClosing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="vendor-drawer-title"
    >
      <div
        className="vendor-drawer__scrim"
        onClick={handleClose}
        aria-label="Close vendor details"
      />
      <aside className="vendor-drawer__panel">
        <header className="vendor-drawer__header">
          <div>
            <span className="vendor-drawer__stall-badge">
              STALL {vendor.stall} · {vendor.cat}
            </span>
            <h2 id="vendor-drawer-title" className="vendor-drawer__title">
              {vendor.name}
            </h2>
          </div>
          <button
            type="button"
            className="vendor-drawer__close-btn"
            onClick={handleClose}
            aria-label="Close drawer"
            data-cursor="button"
          >
            ✕
          </button>
        </header>

        <div className="vendor-drawer__body">
          <div
            className="vendor-drawer__banner"
            style={{ backgroundImage: `url(${vendor.image})` }}
          >
            <div className="vendor-drawer__banner-shade" />
            <div className="vendor-drawer__banner-badge">
              <span className="live-dot" /> OPEN TONIGHT · {vendor.hours}
            </div>
          </div>

          <div className="vendor-drawer__meta">
            <div className="vendor-drawer__meta-pill">
              <strong>LOCATION</strong>
              <span>{vendor.zone}</span>
            </div>
            <div className="vendor-drawer__meta-pill">
              <strong>PAYMENTS</strong>
              <span>UPI · CARDS · CASH</span>
            </div>
          </div>

          <div className="vendor-drawer__desc-block">
            <h3>ABOUT THE STALL</h3>
            <p>{vendor.description}</p>
          </div>

          <div className="vendor-drawer__catalog">
            <div className="vendor-drawer__catalog-header">
              <h3>STALL MENU & COLLECTION</h3>
              <span>{vendor.items?.length || 0} ITEMS</span>
            </div>

            <div className="vendor-drawer__items-list">
              {vendor.items?.map((item) => {
                const isSelected = !!addedItems[item.id]
                return (
                  <article key={item.id} className={`vendor-item-card ${isSelected ? "is-selected" : ""}`}>
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
                    <div className="vendor-item-card__action">
                      <button
                        type="button"
                        className={`vendor-item-btn ${isSelected ? "is-added" : ""}`}
                        onClick={() => toggleItem(item.id)}
                        data-cursor="button"
                      >
                        {isSelected ? "✓ ADDED TO TASTING LIST" : "+ ADD TO TASTING LIST"}
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
            className="btn-drawer btn-drawer--map"
            onClick={handleLocateOnMap}
            data-cursor="button"
          >
            📍 LOCATE ON MAP
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
