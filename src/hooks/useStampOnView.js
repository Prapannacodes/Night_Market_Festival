import { useEffect } from "react"
import { useExperience } from "../context/ExperienceContext"

export function useStampOnView(ref, stamp, ms = 900) {
  const { unlockStamp } = useExperience()

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    let timer

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => unlockStamp(stamp), ms)
        } else if (timer) {
          clearTimeout(timer)
        }
      },
      { threshold: 0.45 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [ref, stamp, ms, unlockStamp])
}
