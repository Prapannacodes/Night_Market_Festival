import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotion } from "./useReducedMotion"

gsap.registerPlugin(ScrollTrigger)

export function useLenis() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.add("reduced-motion")
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1,
    })

    window.__nmLenis = lenis
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) lenis.scrollTo(value, { immediate: true })
        return lenis.scroll
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })
    lenis.on("scroll", ScrollTrigger.update)
    ScrollTrigger.defaults({ scroller: document.body })

    const ticker = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      window.__nmLenis = null
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [reduced])
}
