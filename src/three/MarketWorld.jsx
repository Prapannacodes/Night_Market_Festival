import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { marketRuntime } from "../runtime/marketRuntime"

const lanternVert = `
varying vec3 vN;
varying vec3 vV;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`

const lanternFrag = `
precision highp float;
uniform float uTime;
uniform vec3 uA;
uniform vec3 uB;
varying vec3 vN;
varying vec3 vV;
void main() {
  float fres = pow(1.0 - max(dot(vN, vV), 0.0), 2.4);
  float pulse = 0.62 + 0.38 * sin(uTime * 2.1);
  vec3 col = mix(uA, uB, fres) * pulse + uB * fres * 1.4;
  gl_FragColor = vec4(col, 0.95);
}
`

function makeSign(text, color) {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 160
  const ctx = canvas.getContext("2d")
  ctx.fillStyle = "rgba(0,0,0,0.15)"
  ctx.fillRect(0, 0, 512, 160)
  ctx.strokeStyle = color
  ctx.lineWidth = 8
  ctx.strokeRect(18, 18, 476, 124)
  ctx.font = "700 64px Syne, sans-serif"
  ctx.fillStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 18
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(text, 256, 84)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function Dust({ count = 220 }) {
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 18,
        y: Math.random() * 10 - 1,
        z: (Math.random() - 0.5) * 16,
        s: Math.random() * 0.04 + 0.012,
        p: Math.random() * Math.PI * 2,
      })),
    [count],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const boost = 1 + marketRuntime.scroll * 4
    seeds.forEach((p, i) => {
      dummy.position.set(p.x + Math.sin(t * 0.3 + p.p) * 0.35, p.y + (t * 0.12 * boost + p.p) % 9 - 2, p.z - marketRuntime.scroll * 8)
      dummy.scale.setScalar(p.s * (marketRuntime.night ? 1.35 : 1))
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#7af6ff" transparent opacity={0.55} depthWrite={false} />
    </instancedMesh>
  )
}

function NeonSign({ text, color, position, rotation, speed = 1 }) {
  const texture = useMemo(() => makeSign(text, color), [text, color])
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed
    ref.current.position.y = position[1] + Math.sin(t) * 0.18
    ref.current.position.z = position[2] - marketRuntime.scroll * 10
  })
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[2.8, 0.88]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  )
}

function Stall({ position, color, width = 1.6 }) {
  const ref = useRef()
  useFrame(() => {
    ref.current.position.z = position[2] - marketRuntime.scroll * 11
  })
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[width, 0.1, 1.1]} />
        <meshStandardMaterial color="#120814" emissive={color} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[width + 0.2, 0.06, 1.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[-width / 2, 0.6, 0]}>
        <boxGeometry args={[0.06, 1.1, 1.1]} />
        <meshStandardMaterial color="#1a1018" />
      </mesh>
      <mesh position={[width / 2, 0.6, 0]}>
        <boxGeometry args={[0.06, 1.1, 1.1]} />
        <meshStandardMaterial color="#1a1018" />
      </mesh>
    </group>
  )
}

function Wire({ points, color }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points])
  return (
    <mesh>
      <tubeGeometry args={[curve, 40, 0.012, 5, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} />
    </mesh>
  )
}

export function Lantern() {
  const group = useRef()
  const mat = useRef()
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uA: { value: new THREE.Color("#ff2ec8") },
      uB: { value: new THREE.Color("#2af0ff") },
    }),
    [],
  )

  useFrame(({ clock, pointer }) => {
    uniforms.uTime.value = clock.elapsedTime
    const hover = marketRuntime.lanternHover ? 1.12 : 1
    const t = clock.elapsedTime
    group.current.rotation.y = t * 0.35
    group.current.position.y = 1.15 + Math.sin(t * 0.9) * 0.16
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, pointer.x * 0.35, 0.06)
    group.current.scale.setScalar(hover)
    if (mat.current) mat.current.opacity = 0.9 + Math.sin(t * 3) * 0.05
  })

  return (
    <group
      ref={group}
      position={[0, 1.1, 0]}
      onPointerOver={() => {
        marketRuntime.lanternHover = true
      }}
      onPointerOut={() => {
        marketRuntime.lanternHover = false
      }}
    >
      <mesh>
        <icosahedronGeometry args={[0.62, 2]} />
        <shaderMaterial
          ref={mat}
          vertexShader={lanternVert}
          fragmentShader={lanternFrag}
          uniforms={uniforms}
          transparent
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.92, 0.018, 8, 80]} />
        <meshBasicMaterial color="#2af0ff" />
      </mesh>
      <mesh rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[1.12, 0.01, 8, 80]} />
        <meshBasicMaterial color="#ff2ec8" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.1, 6]} />
        <meshBasicMaterial color="#ffb020" />
      </mesh>
      <pointLight color="#ff49d6" intensity={7} distance={10} />
      <pointLight color="#2af0ff" intensity={3.5} distance={8} position={[0.4, -0.2, 0.4]} />
    </group>
  )
}

export function MarketWorld({ mobile }) {
  const camGroup = useRef()
  const count = mobile ? 90 : 220

  useFrame(({ camera, pointer, clock }) => {
    const p = marketRuntime.scroll
    const reduced = marketRuntime.reduced
    const idle = reduced ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.12
    const mx = reduced ? 0 : pointer.x * 0.55
    const my = reduced ? 0 : pointer.y * 0.25
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.15 + my * 0.4 + idle, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7.2 - p * 9.5, 0.08)
    camera.lookAt(0, 1.05 + p * 0.4, -p * 6)
    if (camGroup.current) camGroup.current.rotation.y = pointer.x * 0.04
  })

  return (
    <group ref={camGroup}>
      <color attach="background" args={["#050308"]} />
      <fog attach="fog" args={[marketRuntime.night ? "#07040c" : "#09060f", 4, 16]} />
      <ambientLight intensity={0.22} />
      <spotLight position={[4, 8, 6]} angle={0.5} intensity={18} color="#b44cff" />
      <spotLight position={[-5, 6, 3]} angle={0.4} intensity={10} color="#2af0ff" />
      <Lantern />
      <Dust count={count} />
      <Stall position={[-3.4, -0.4, -1.4]} color="#ff2ec8" />
      <Stall position={[3.2, -0.4, -2.2]} color="#2af0ff" width={1.9} />
      <Stall position={[-1.6, -0.4, -4.6]} color="#ffb020" width={1.4} />
      <Stall position={[2.1, -0.4, -6.2]} color="#b44cff" />
      <NeonSign text="夜市" color="#ff2ec8" position={[-3.6, 2.4, -1.2]} rotation={[0, 0.4, 0]} />
      <NeonSign text="OPEN" color="#2af0ff" position={[3.4, 2.1, -2]} rotation={[0, -0.35, 0]} speed={1.3} />
      <NeonSign text="LIVE" color="#ffb020" position={[0.2, 2.8, -3.4]} rotation={[0, 0.1, 0]} speed={0.7} />
      <NeonSign text="RAMEN" color="#ff6a1a" position={[-2.4, 1.7, -5]} rotation={[0, 0.5, 0]} />
      <Wire
        color="#ff2ec8"
        points={[
          [-6, 4.2, 2],
          [-2, 3.4, -1],
          [1.4, 3.8, -3],
          [6, 3.1, -1],
        ]}
      />
      <Wire
        color="#2af0ff"
        points={[
          [-5, 3.6, 1],
          [0, 2.8, -2],
          [5.4, 3.7, -4],
        ]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, -2]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#07050a" />
      </mesh>
    </group>
  )
}
