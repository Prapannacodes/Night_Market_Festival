import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { useIsTouchDevice } from "../hooks/useIsTouchDevice"
import { useReducedMotion } from "../hooks/useReducedMotion"
import { MarketWorld } from "./MarketWorld"

export default function HeroCanvas({ active }) {
  const mobile = useIsTouchDevice()
  const reduced = useReducedMotion()

  return (
    <Canvas
      className="hero-canvas"
      dpr={mobile ? [1, 1.2] : [1, 1.6]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 1.2, 7.2], fov: 42, near: 0.1, far: 40 }}
      frameloop={active && !reduced ? "always" : "demand"}
      onCreated={({ gl }) => {
        gl.setClearColor("#050308", 0)
      }}
    >
      <Suspense fallback={null}>
        <MarketWorld mobile={mobile} />
      </Suspense>
    </Canvas>
  )
}
