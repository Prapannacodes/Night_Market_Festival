import { useEffect } from "react"
import { useExperience } from "../context/ExperienceContext"

export default function MarketToast() {
  const { marketToast, setMarketToast } = useExperience()

  useEffect(() => {
    if (!marketToast) return
    const timer = setTimeout(() => {
      setMarketToast(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [marketToast, setMarketToast])

  if (!marketToast) return null

  return (
    <div className="market-toast" role="alert" aria-live="polite">
      <div className="market-toast__content">
        <span className="market-toast__icon">✓</span>
        <div className="market-toast__text">
          <strong>{marketToast.title || "SUCCESS"}</strong>
          <span>{marketToast.message}</span>
        </div>
        <button
          type="button"
          className="market-toast__close"
          onClick={() => setMarketToast(null)}
          aria-label="Dismiss toast"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
