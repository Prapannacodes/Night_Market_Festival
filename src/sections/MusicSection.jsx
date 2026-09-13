import { useEffect, useRef, useState } from "react"
import SectionBackground from "../components/SectionBackground"
import { LINEUP } from "../data/content"
import { useExperience } from "../context/ExperienceContext"
import { marketRuntime } from "../runtime/marketRuntime"
import { useStampOnView } from "../hooks/useStampOnView"

export default function MusicSection() {
  const root = useRef(null)
  const canvas = useRef(null)
  const [act, setAct] = useState(0)
  const { unlockStamp } = useExperience()
  useStampOnView(root, "music-lover", 1000)

  useEffect(() => {
    const node = canvas.current
    const ctx = node.getContext("2d")
    let frame
    let t = 0
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      node.width = node.clientWidth * dpr
      node.height = node.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const w = node.clientWidth
      const h = node.clientHeight
      t += 0.05 + act * 0.01
      marketRuntime.musicIndex = act
      ctx.clearRect(0, 0, w, h)
      const bars = 36
      for (let i = 0; i < bars; i += 1) {
        const n = Math.abs(Math.sin(t + i * 0.35 + act)) * (0.35 + (i % 7) * 0.08)
        const bh = n * h * 0.7
        const x = (w / bars) * i
        ctx.fillStyle = i % 3 === 0 ? "#ff2ec8" : "#2af0ff"
        ctx.fillRect(x + 3, h / 2 - bh / 2, w / bars - 6, bh)
      }
      ctx.strokeStyle = "rgba(255,176,32,0.45)"
      ctx.beginPath()
      for (let x = 0; x < w; x += 6) {
        const y = h / 2 + Math.sin(x * 0.02 + t * 2) * (18 + act * 6)
        ctx.lineTo(x, y)
      }
      ctx.stroke()
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [act])

  return (
    <section id="lineup" className="music" ref={root}>
      <SectionBackground image="/images/music-bg.jpg" opacity={0.48} />
      <p className="kicker">TONIGHT'S FREQUENCY</p>
      <h2 className="display">STAGE IS LIVE.</h2>
      <div className="music__stage">
        <canvas ref={canvas} className="music__viz" />
        <ol>
          {LINEUP.map((item, index) => (
            <li key={item.time}>
              <button
                type="button"
                className={act === index ? "is-on" : ""}
                data-cursor="reticle"
                onMouseEnter={() => {
                  setAct(index)
                  unlockStamp("music-lover")
                }}
              >
                <span>{item.time}</span>
                <strong>{item.act}</strong>
                <em>{item.note}</em>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
