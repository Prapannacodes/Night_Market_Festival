import { useEffect, useRef } from "react"
import { lerp } from "../utils/math"
import { useReducedMotion } from "./useReducedMotion"

export function useMagneticHover(strength = 0.28) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return

    let frame = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.18)
      currentY = lerp(currentY, targetY, 0.18)
      node.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    const onMove = (event) => {
      const rect = node.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      targetX = dx * strength
      targetY = dy * strength
    }

    const onLeave = () => {
      targetX = 0
      targetY = 0
    }

    node.addEventListener("pointermove", onMove)
    node.addEventListener("pointerleave", onLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      node.removeEventListener("pointermove", onMove)
      node.removeEventListener("pointerleave", onLeave)
      cancelAnimationFrame(frame)
      node.style.transform = ""
    }
  }, [reduced, strength])

  return ref
}
