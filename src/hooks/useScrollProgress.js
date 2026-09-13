import { useEffect, useState } from "react"

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [y, setY] = useState(0)

  useEffect(() => {
    let frame = 0
    let unsubscribe

    const attach = () => {
      const lenis = window.__nmLenis
      if (!lenis) {
        frame = requestAnimationFrame(attach)
        return
      }

      const onScroll = ({ scroll, limit }) => {
        const max = limit || 1
        const next = max <= 0 ? 0 : scroll / max
        setY(scroll)
        setProgress(next)
      }

      lenis.on("scroll", onScroll)
      unsubscribe = () => lenis.off("scroll", onScroll)
    }

    attach()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      unsubscribe?.()
    }
  }, [])

  return { progress, y }
}

export function useCompactScroll(threshold = 48) {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    let frame = 0
    let unsubscribe

    const attach = () => {
      const lenis = window.__nmLenis
      if (!lenis) {
        frame = requestAnimationFrame(attach)
        return
      }

      const onScroll = ({ scroll }) => {
        const next = scroll > threshold
        setCompact((current) => (current === next ? current : next))
      }

      onScroll({ scroll: window.__nmLenis?.scroll || window.scrollY })
      lenis.on("scroll", onScroll)
      unsubscribe = () => lenis.off("scroll", onScroll)
    }

    attach()
    return () => {
      if (frame) cancelAnimationFrame(frame)
      unsubscribe?.()
    }
  }, [threshold])

  return compact
}
