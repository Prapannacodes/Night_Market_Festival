import { useEffect, useRef, useState } from "react"
import { useExperience } from "../context/ExperienceContext"

const TYPES = [
  { id: "normal", pts: 10, r: [16, 24], color: "#ff4d9a", weight: 0.55 },
  { id: "neon", pts: 50, r: [18, 22], color: "#2af0ff", weight: 0.22 },
  { id: "gold", pts: 100, r: [14, 18], color: "#ffb020", weight: 0.12 },
  { id: "bonus", pts: 0, r: [20, 26], color: "#9dff4a", weight: 0.11, extra: 5 },
]

function pickType() {
  const n = Math.random()
  let acc = 0
  for (const type of TYPES) {
    acc += type.weight
    if (n <= acc) return type
  }
  return TYPES[0]
}

function makeBalloon(w, h, speedBoost) {
  const type = pickType()
  const r = type.r[0] + Math.random() * (type.r[1] - type.r[0])
  return {
    x: 40 + Math.random() * (w - 80),
    y: h + 20 + Math.random() * 80,
    vx: (Math.random() - 0.5) * (1.4 + speedBoost),
    vy: -(0.7 + Math.random() * 1.1 + speedBoost * 0.4),
    r,
    type,
    wobble: Math.random() * Math.PI * 2,
  }
}

export default function ArcadeGame() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const { applyScore, highScore, setPassportOpen, sound } = useExperience()
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [hud, setHud] = useState({ score: 0, ammo: 12, time: 30, combo: 1 })
  const hudTick = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let frame
    const state = {
      w: 800,
      h: 460,
      balloons: [],
      corks: [],
      bursts: [],
      score: 0,
      ammo: 12,
      maxAmmo: 12,
      time: 30,
      combo: 1,
      lastHit: 0,
      shake: 0,
      mouse: { x: 400, y: 230 },
      reload: 0,
      spawn: 0,
      playing: false,
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.w = rect.width
      state.h = rect.height
    }
    resize()
    window.addEventListener("resize", resize)

    const beep = (freq) => {
      if (!sound) return
      try {
        const audio = new AudioContext()
        const osc = audio.createOscillator()
        const gain = audio.createGain()
        osc.frequency.value = freq
        osc.type = "square"
        gain.gain.value = 0.04
        osc.connect(gain)
        gain.connect(audio.destination)
        osc.start()
        osc.stop(audio.currentTime + 0.08)
      } catch {
        /* ignore */
      }
    }

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      state.mouse.x = event.clientX - rect.left
      state.mouse.y = event.clientY - rect.top
    }

    const shoot = () => {
      if (!state.playing) return
      if (state.reload > 0) return
      if (state.ammo <= 0) {
        state.reload = 0.85
        state.ammo = state.maxAmmo
        return
      }
      state.ammo -= 1
      const origin = { x: state.w * 0.5, y: state.h - 18 }
      const dx = state.mouse.x - origin.x
      const dy = state.mouse.y - origin.y
      const len = Math.hypot(dx, dy) || 1
      state.corks.push({
        x: origin.x,
        y: origin.y,
        vx: (dx / len) * 16,
        vy: (dy / len) * 16,
        life: 1,
      })
      beep(220)
      if (state.ammo === 0) state.reload = 0.85
    }

    const endRound = () => {
      state.playing = false
      const reward = applyScore(state.score)
      setResult({ score: state.score, reward })
      setRunning(false)
    }

    const tick = (now) => {
      if (!state.last) state.last = now
      const dt = Math.min(0.033, (now - state.last) / 1000)
      state.last = now
      const { w, h } = state

      ctx.fillStyle = "#07040c"
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      if (state.shake > 0) {
        ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake)
        state.shake *= 0.86
      }

      if (state.playing) {
        state.time -= dt
        if (state.reload > 0) state.reload -= dt
        if (state.reload <= 0 && state.ammo <= 0) state.ammo = state.maxAmmo
        state.spawn -= dt
        const boost = Math.max(0, (30 - state.time) / 18)
        if (state.spawn <= 0) {
          state.balloons.push(makeBalloon(w, h, boost))
          state.spawn = 0.55 - boost * 0.18
        }
        if (now - state.lastHit > 1400) state.combo = 1

        state.balloons.forEach((b) => {
          b.wobble += dt * 3
          b.x += b.vx + Math.sin(b.wobble) * 0.6
          b.y += b.vy
          if (b.x < b.r || b.x > w - b.r) b.vx *= -1
        })
        state.balloons = state.balloons.filter((b) => b.y + b.r > -10)

        state.corks.forEach((c) => {
          c.x += c.vx
          c.y += c.vy
          c.life -= 0.02
        })

        state.corks.forEach((c) => {
          state.balloons.forEach((b) => {
            if (Math.hypot(c.x - b.x, c.y - b.y) < b.r + 4) {
              b.hit = true
              c.life = 0
              const gain = b.type.pts * state.combo
              state.score += gain
              if (b.type.extra) state.time += b.type.extra
              state.combo = Math.min(5, state.combo + 1)
              state.lastHit = now
              state.shake = b.type.id === "gold" ? 10 : 4
              state.bursts.push({ x: b.x, y: b.y, life: 1, gold: b.type.id === "gold", color: b.type.color })
              beep(b.type.id === "gold" ? 880 : 520)
            }
          })
        })
        state.balloons = state.balloons.filter((b) => !b.hit)
        state.corks = state.corks.filter((c) => c.life > 0 && c.x > 0 && c.x < w && c.y > 0)
        if (state.time <= 0) endRound()
      }

      state.balloons.forEach((b) => {
        ctx.beginPath()
        ctx.fillStyle = b.type.color
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(255,255,255,0.35)"
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(b.x, b.y + b.r)
        ctx.lineTo(b.x, b.y + b.r + 18)
        ctx.strokeStyle = "rgba(255,255,255,0.25)"
        ctx.stroke()
        if (b.type.id !== "normal") {
          ctx.fillStyle = "#050308"
          ctx.font = "10px IBM Plex Mono"
          ctx.textAlign = "center"
          ctx.fillText(b.type.id === "bonus" ? "+5s" : `+${b.type.pts}`, b.x, b.y + 3)
        }
      })

      state.corks.forEach((c) => {
        ctx.fillStyle = "#e8c39a"
        ctx.beginPath()
        ctx.arc(c.x, c.y, 5, 0, Math.PI * 2)
        ctx.fill()
      })

      state.bursts = state.bursts.filter((burst) => burst.life > 0)
      state.bursts.forEach((burst) => {
        burst.life -= 0.04
        for (let i = 0; i < (burst.gold ? 16 : 8); i += 1) {
          const a = (i / 10) * Math.PI * 2
          ctx.fillStyle = burst.color
          ctx.beginPath()
          ctx.arc(burst.x + Math.cos(a) * (1 - burst.life) * 40, burst.y + Math.sin(a) * (1 - burst.life) * 40, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.strokeStyle = "rgba(42,240,255,0.85)"
      ctx.beginPath()
      ctx.arc(state.mouse.x, state.mouse.y, 14, 0, Math.PI * 2)
      ctx.moveTo(state.mouse.x - 20, state.mouse.y)
      ctx.lineTo(state.mouse.x + 20, state.mouse.y)
      ctx.moveTo(state.mouse.x, state.mouse.y - 20)
      ctx.lineTo(state.mouse.x, state.mouse.y + 20)
      ctx.stroke()

      ctx.fillStyle = "#ffb020"
      ctx.beginPath()
      ctx.moveTo(w / 2 - 18, h)
      ctx.lineTo(w / 2 + 18, h)
      ctx.lineTo(w / 2, h - 28)
      ctx.closePath()
      ctx.fill()

      ctx.restore()
      ctx.fillStyle = "rgba(42,240,255,0.08)"
      for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1)

      if (state.playing && now - hudTick.current > 120) {
        hudTick.current = now
        setHud({
          score: state.score,
          ammo: state.reload > 0 ? 0 : state.ammo,
          time: Math.max(0, state.time),
          combo: state.combo,
        })
      }

      frame = requestAnimationFrame(tick)
    }

    const onClick = () => shoot()
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerdown", onClick)
    wrapRef.current.__start = () => {
      state.playing = true
      state.score = 0
      state.ammo = 12
      state.time = 30
      state.combo = 1
      state.balloons = []
      state.corks = []
      state.last = 0
      setResult(null)
      setRunning(true)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerdown", onClick)
    }
  }, [applyScore, sound])

  return (
    <section id="arcade" className="arcade">
      <p className="kicker">PLAY THE MARKET. EARN YOUR DISCOUNT.</p>
      <h2 className="display">SHOOT THE BALLOONS.</h2>
      <p className="lede">Carnival cork gun. Thirty seconds. Gold balloons rewrite the night.</p>
      <div className="cabinet" ref={wrapRef}>
        <div className="cabinet__top">NM ARCADE · CORK POP</div>
        <div className="cabinet__screen">
          <canvas ref={canvasRef} data-cursor="reticle" />
          {!running && !result ? (
            <button
              className="cabinet__start"
              type="button"
              data-cursor="button"
              onClick={() => wrapRef.current.__start()}
            >
              INSERT NIGHT / START
            </button>
          ) : null}
          {result ? (
            <div className="cabinet__result">
              <p>YOU CRACKED THE MARKET.</p>
              <h3>{result.score}</h3>
              <p>BEST {highScore}</p>
              <p className="cabinet__reward">{result.reward.label}</p>
              {result.reward.code ? <code>{result.reward.code}</code> : null}
              <div className="cabinet__actions">
                {result.reward.code ? (
                  <button type="button" data-cursor="button" onClick={() => setPassportOpen(true)}>
                    CLAIM DISCOUNT
                  </button>
                ) : null}
                <button type="button" data-cursor="button" onClick={() => wrapRef.current.__start()}>
                  PLAY AGAIN
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="cabinet__hud">
          <span>SCORE {hud.score}</span>
          <span>TIME {hud.time.toFixed(1)}</span>
          <span>AMMO {hud.ammo}</span>
          <span>COMBO x{hud.combo}</span>
        </div>
      </div>
    </section>
  )
}
