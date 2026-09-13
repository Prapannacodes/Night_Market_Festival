import { useEffect, useState } from "react"

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(hover: none), (pointer: coarse)").matches
  })

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)")
    const onChange = () => setIsTouch(media.matches)
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return isTouch
}
