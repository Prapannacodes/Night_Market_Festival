import { useCallback, useEffect, useState } from "react"
import { EVENT } from "../data/content"

export default function PaymentModal({ pass, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState("upi") // 'upi' | 'card'
  const [status, setStatus] = useState("checkout") // 'checkout' | 'processing' | 'success'
  const [isClosing, setIsClosing] = useState(false)
  const [bookingRef, setBookingRef] = useState("")

  // Form states
  const [upiApp, setUpiApp] = useState("gpay")
  const [upiId, setUpiId] = useState("")
  const [showQr, setShowQr] = useState(false)

  const [cardHolder, setCardHolder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [selectedBank, setSelectedBank] = useState("HDFC Bank")

  const [countdown, setCountdown] = useState(4)

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 320)
  }, [onClose])

  const handleReturnToMarket = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onPaymentSuccess(pass, bookingRef)
    }, 320)
  }, [onPaymentSuccess, pass, bookingRef])

  useEffect(() => {
    if (!pass) return
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && status !== "processing") {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [pass, status, handleClose])

  // Prevent background scroll while open
  useEffect(() => {
    if (pass) {
      const orig = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [pass])

  // Countdown timer when payment succeeds
  useEffect(() => {
    let timer
    if (status === "success") {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleReturnToMarket()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [status, handleReturnToMarket])

  if (!pass) return null

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16)
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim()
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4)
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`)
    } else {
      setCardExpiry(raw)
    }
  }

  const handleConfirmPayment = (e) => {
    e.preventDefault()
    setStatus("processing")

    const ref = `NM26-${Math.floor(100000 + Math.random() * 900000)}`
    setBookingRef(ref)

    setTimeout(() => {
      setStatus("success")
      setCountdown(4)
    }, 1500)
  }

  return (
    <div
      className={`payment-modal-wrapper ${isClosing ? "is-closing" : "is-open"}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div
        className="payment-modal__scrim"
        onClick={() => {
          if (status !== "processing") handleClose()
        }}
        aria-label="Close payment"
      />

      <div className="payment-modal__card">
        {status === "checkout" && (
          <>
            <header className="payment-modal__header">
              <div className="payment-modal__tag">NIGHT MARKET SECURE CHECKOUT</div>
              <h2 id="payment-modal-title" className="payment-modal__title">
                TAKE THE PASS
              </h2>
              <button
                type="button"
                className="payment-modal__close-btn"
                onClick={handleClose}
                aria-label="Close checkout"
                data-cursor="button"
              >
                ✕
              </button>
            </header>

            <div className="payment-modal__body">
              {/* Pass Summary Bar */}
              <div className="payment-summary">
                <div className="payment-summary__main">
                  <span className="payment-summary__tier">{pass.tier}</span>
                  <h3 className="payment-summary__name">{pass.name}</h3>
                  <p className="payment-summary__meta">
                    {EVENT.date} · {EVENT.hours} · {EVENT.place}
                  </p>
                </div>
                <div className="payment-summary__price-box">
                  <span className="payment-summary__price-label">TOTAL</span>
                  <strong className="payment-summary__price">{pass.price}</strong>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="payment-method-nav">
                <button
                  type="button"
                  className={`payment-method-tab ${method === "upi" ? "is-active" : ""}`}
                  onClick={() => setMethod("upi")}
                  data-cursor="button"
                >
                  ⚡ UPI / INSTANT PAY
                </button>
                <button
                  type="button"
                  className={`payment-method-tab ${method === "card" ? "is-active" : ""}`}
                  onClick={() => setMethod("card")}
                  data-cursor="button"
                >
                  💳 CARD / NET BANKING
                </button>
              </div>

              <form onSubmit={handleConfirmPayment} className="payment-form">
                {method === "upi" ? (
                  <div className="upi-content">
                    <p className="payment-hint">
                      Choose your favorite UPI application or enter your Virtual Payment Address (VPA).
                    </p>

                    <div className="upi-apps-grid">
                      {[
                        { id: "gpay", name: "Google Pay" },
                        { id: "phonepe", name: "PhonePe" },
                        { id: "paytm", name: "Paytm" },
                        { id: "bhim", name: "BHIM UPI" },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          className={`upi-app-btn ${upiApp === app.id ? "is-selected" : ""}`}
                          onClick={() => {
                            setUpiApp(app.id)
                            setShowQr(false)
                          }}
                          data-cursor="button"
                        >
                          <span className="upi-app-icon">⚡</span>
                          <span>{app.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="payment-field">
                      <label htmlFor="upi-vpa">OR ENTER UPI ID</label>
                      <div className="input-wrap">
                        <input
                          id="upi-vpa"
                          type="text"
                          placeholder="e.g. mobileNumber@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                        />
                        <span className="input-verify">VERIFIED</span>
                      </div>
                    </div>

                    <div className="qr-toggle-section">
                      <button
                        type="button"
                        className="btn-text-toggle"
                        onClick={() => setShowQr(!showQr)}
                        data-cursor="button"
                      >
                        {showQr ? "▲ HIDE QR CODE" : "▼ SCAN QR CODE INSTEAD"}
                      </button>

                      {showQr && (
                        <div className="upi-qr-box">
                          <div className="upi-qr-matrix">
                            <div className="qr-corner qr-tl" />
                            <div className="qr-corner qr-tr" />
                            <div className="qr-corner qr-bl" />
                            <div className="qr-center-text">
                              <span>MELA UPI</span>
                              <strong>{pass.price}</strong>
                            </div>
                          </div>
                          <p>Scan with any UPI camera to complete instantly</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="card-content">
                    <div className="payment-field">
                      <label htmlFor="card-name">CARDHOLDER NAME</label>
                      <input
                        id="card-name"
                        type="text"
                        placeholder="NAME AS PRINTED ON CARD"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>

                    <div className="payment-field">
                      <label htmlFor="card-number">CARD NUMBER</label>
                      <div className="input-wrap">
                        <input
                          id="card-number"
                          type="text"
                          placeholder="4532 •••• •••• 8920"
                          maxLength={19}
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                        />
                        <span className="card-icons">VISA / MC / RUPAY</span>
                      </div>
                    </div>

                    <div className="payment-row">
                      <div className="payment-field">
                        <label htmlFor="card-expiry">EXPIRY (MM/YY)</label>
                        <input
                          id="card-expiry"
                          type="text"
                          placeholder="MM / YY"
                          maxLength={5}
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                        />
                      </div>
                      <div className="payment-field">
                        <label htmlFor="card-cvv">CVV / CVC</label>
                        <input
                          id="card-cvv"
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        />
                      </div>
                    </div>

                    <div className="payment-field">
                      <label htmlFor="net-bank">OR SELECT NET BANKING</label>
                      <select
                        id="net-bank"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="payment-select"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="payment-security-notice">
                  <span>🔒 256-Bit SSL Encrypted · Instant Festival Pass Issuance</span>
                </div>

                <div className="payment-actions">
                  <button
                    type="submit"
                    className="btn-payment-confirm"
                    data-cursor="button"
                  >
                    CONFIRM PAYMENT ({pass.price}) →
                  </button>
                  <button
                    type="button"
                    className="btn-payment-cancel"
                    onClick={handleClose}
                    data-cursor="button"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {status === "processing" && (
          <div className="payment-processing">
            <div className="payment-spinner" />
            <h3>CONNECTING TO PAYMENT GATEWAY...</h3>
            <p>Authorizing {pass.price} with bank server...</p>
            <div className="processing-bar">
              <div className="processing-bar__fill" />
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="payment-success">
            <div className="success-badge">
              <span className="success-check">✓</span>
            </div>

            <span className="success-kicker">PAYMENT CONFIRMED</span>
            <h2 className="success-title">YOU&apos;RE IN FOR THE NIGHT</h2>

            <div className="success-pass-card">
              <header className="success-pass-header">
                <span>NIGHT MARKET FESTIVAL · {pass.tier}</span>
                <strong>{pass.price}</strong>
              </header>

              <h3 className="success-pass-name">{pass.name}</h3>

              <div className="success-pass-info">
                <div>
                  <small>BOOKING REF</small>
                  <strong>{bookingRef}</strong>
                </div>
                <div>
                  <small>DATE & TIME</small>
                  <strong>{EVENT.dateShort} · {EVENT.hours}</strong>
                </div>
                <div>
                  <small>VENUE</small>
                  <strong>{EVENT.place}</strong>
                </div>
              </div>

              <div className="success-pass-barcode">
                {Array.from({ length: 32 }, (_, i) => (
                  <i key={i} style={{ height: `${28 + ((i * 19) % 45)}%` }} />
                ))}
              </div>
            </div>

            <p className="success-redirect-msg">
              Redirecting to festival market in <strong>{countdown}s</strong>...
            </p>

            <button
              type="button"
              className="btn-return-market"
              onClick={handleReturnToMarket}
              data-cursor="button"
            >
              RETURN TO MARKET NOW →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
