import { useEffect, useRef } from "react"
import { useIsTouchDevice } from "../hooks/useIsTouchDevice"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { clamp, lerp } from "../utils/math"
import "../styles/cursor.css"

export default function CustomCursor() {
  const isTouch = useIsTouchDevice()
  const reduced = useReducedMotion()
  const rootRef = useRef(null)
  const coreRef = useRef(null)
  const ringRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (isTouch || reduced) {
      document.documentElement.classList.remove("has-custom-cursor")
      return undefined
    }

    document.documentElement.classList.add("has-custom-cursor")
    const root = rootRef.current
    const core = coreRef.current
    const ring = ringRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const mouse = { x: width / 2, y: height / 2 }
    const corePos = { x: mouse.x, y: mouse.y }
    const ringPos = { x: mouse.x, y: mouse.y }
    const trail = []
    const bursts = []
    let mode = "default"
    let visible = false
    let last = performance.now()
    let frame = 0

    const onMove = (event) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
      visible = true
      const speed = Math.hypot(event.movementX, event.movementY)
      if (speed > 12) {
        trail.push({
          x: mouse.x,
          y: mouse.y,
          life: 1,
          hue: speed > 28 ? 310 : 190,
        })
        if (trail.length > 28) trail.shift()
      }
    }

    const onOver = (event) => {
      const target = event.target.closest("[data-cursor]")
      mode = target?.getAttribute("data-cursor") || "default"
      root.classList.toggle("is-button", mode === "button")
      root.classList.toggle("is-link", mode === "link")
      root.classList.toggle("is-reticle", mode === "reticle")
    }

    const onDown = () => {
      bursts.push({ x: mouse.x, y: mouse.y, life: 1, r: 6 })
    }

    const tick = (now) => {
      const dt = Math.min((now - last) / 16.67, 2)
      last = now
      const dx = mouse.x - corePos.x
      const dy = mouse.y - corePos.y
      const velocity = Math.hypot(dx, dy)
      corePos.x = lerp(corePos.x, mouse.x, 0.35 * dt)
      corePos.y = lerp(corePos.y, mouse.y, 0.35 * dt)
      ringPos.x = lerp(ringPos.x, mouse.x, 0.16 * dt)
      ringPos.y = lerp(ringPos.y, mouse.y, 0.16 * dt)

      const stretch = 1 + clamp(velocity / 80, 0, 0.85)
      const angle = Math.atan2(dy, dx)

      core.style.opacity = visible ? "1" : "0"
      ring.style.opacity = visible ? "1" : "0"
      core.style.transform = `translate3d(${corePos.x}px, ${corePos.y}px, 0) scale(${stretch}, ${2 - stretch}) rotate(${angle}rad)`
      if (mode !== "reticle") {
        ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) scale(${stretch * 0.15 + 1}, 1)`
      } else {
        ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) rotate(45deg)`
      }

      ctx.clearRect(0, 0, width, height)
      for (let i = trail.length - 1; i >= 0; i -= 1) {
        const point = trail[i]
        point.life -= 0.045 * dt
        if (point.life <= 0) {
          trail.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.fillStyle = `hsla(${point.hue}, 100%, 62%, ${point.life * 0.55})`
        ctx.arc(point.x, point.y, 2.2 * point.life + 0.6, 0, Math.PI * 2)
        ctx.fill()
      }

      bursts.forEach((burst, index) => {
        burst.life -= 0.06 * dt
        burst.r += 2.4 * dt
        ctx.beginPath()
        ctx.strokeStyle = `rgba(42, 240, 255, ${burst.life})`
        ctx.lineWidth = 1.4
        ctx.arc(burst.x, burst.y, burst.r, 0, Math.PI * 2)
        ctx.stroke()
        if (burst.life <= 0) bursts.splice(index, 1)
      })

      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerover", onOver)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("resize", resize)
    frame = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove("has-custom-cursor")
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(frame)
    }
  }, [isTouch, reduced])

  if (isTouch || reduced) return null

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <canvas ref={canvasRef} className="cursor__canvas" />
      <div ref={ringRef} className="cursor__ring" />
      <div ref={coreRef} className="cursor__core" />
    </div>
  )
}
