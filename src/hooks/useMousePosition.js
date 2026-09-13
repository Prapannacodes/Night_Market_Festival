import { useEffect, useRef } from "react"

export function useMousePosition() {
  const position = useRef({ x: 0, y: 0, vx: 0, vy: 0 })

  useEffect(() => {
    let lastX = window.innerWidth / 2
    let lastY = window.innerHeight / 2
    let frame = 0

    const onMove = (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        const x = event.clientX
        const y = event.clientY
        position.current.vx = x - lastX
        position.current.vy = y - lastY
        position.current.x = x
        position.current.y = y
        lastX = x
        lastY = y
        frame = 0
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return position
}
