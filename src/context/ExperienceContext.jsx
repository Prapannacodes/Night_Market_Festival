import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

const KEYS = {
  stamps: "nm03-stamps",
  night: "nm03-night",
  score: "nm03-highscore",
  reward: "nm03-reward",
}

const ExperienceContext = createContext(null)

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function ExperienceProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [night, setNight] = useState(false)
  const [stamps, setStamps] = useState([])
  const [highScore, setHighScore] = useState(0)
  const [reward, setReward] = useState(null)
  const [passportOpen, setPassportOpen] = useState(false)
  const [sound, setSound] = useState(false)
  const [activeVendorDrawer, setActiveVendorDrawer] = useState(null)
  const [activePassPayment, setActivePassPayment] = useState(null)
  const [marketToast, setMarketToast] = useState(null)

  useEffect(() => {
    setStamps(readJson(KEYS.stamps, []))
    setHighScore(Number(localStorage.getItem(KEYS.score) || 0))
    setReward(readJson(KEYS.reward, null))
    const savedNight = localStorage.getItem(KEYS.night) === "after"
    setNight(savedNight)
    document.documentElement.dataset.night = savedNight ? "after" : "dusk"
  }, [])

  useEffect(() => {
    document.documentElement.dataset.night = night ? "after" : "dusk"
    localStorage.setItem(KEYS.night, night ? "after" : "dusk")
  }, [night])

  const unlockStamp = useCallback((id) => {
    setStamps((current) => {
      if (current.includes(id)) return current
      const next = [...current, id]
      localStorage.setItem(KEYS.stamps, JSON.stringify(next))
      return next
    })
  }, [])

  const applyScore = useCallback((score) => {
    setHighScore((current) => {
      const next = Math.max(current, score)
      localStorage.setItem(KEYS.score, String(next))
      return next
    })

    let nextReward = { label: "KEEP EXPLORING", off: 0, code: null }
    if (score >= 300) nextReward = { label: "15% OFF", off: 15, code: "NIGHT15" }
    else if (score >= 200) nextReward = { label: "10% OFF", off: 10, code: "NIGHT10" }
    else if (score >= 100) nextReward = { label: "5% OFF", off: 5, code: "NIGHT05" }

    setReward(nextReward)
    localStorage.setItem(KEYS.reward, JSON.stringify(nextReward))
    if (score >= 100) unlockStamp("champion")
    return nextReward
  }, [unlockStamp])

  const value = useMemo(
    () => ({
      ready,
      setReady,
      night,
      setNight,
      stamps,
      unlockStamp,
      highScore,
      reward,
      applyScore,
      passportOpen,
      setPassportOpen,
      sound,
      setSound,
      activeVendorDrawer,
      setActiveVendorDrawer,
      activePassPayment,
      setActivePassPayment,
      marketToast,
      setMarketToast,
    }),
    [
      ready,
      night,
      stamps,
      unlockStamp,
      highScore,
      reward,
      applyScore,
      passportOpen,
      sound,
      activeVendorDrawer,
      activePassPayment,
      marketToast,
    ],
  )

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
}

export function useExperience() {
  const ctx = useContext(ExperienceContext)
  if (!ctx) throw new Error("useExperience must be used inside ExperienceProvider")
  return ctx
}
