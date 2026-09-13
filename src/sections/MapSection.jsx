import { useRef, useState } from "react"
import SectionBackground from "../components/SectionBackground"
import { EVENT, MAP_NODES } from "../data/content"
import { useStampOnView } from "../hooks/useStampOnView"

const PATH = "M12 58 C 22 50, 28 42, 32 38 S 44 24, 52 22 S 66 30, 70 40 S 64 60, 58 68 S 46 76, 38 78 S 70 80, 86 72"

export default function MapSection() {
  const root = useRef(null)
  const [active, setActive] = useState(MAP_NODES[0])
  useStampOnView(root, "explorer", 800)

  return (
    <section className="map" ref={root}>
      <SectionBackground image="/images/map-bg.jpg" opacity={0.45} />
      <p className="kicker">FIND THE LIGHTS.</p>
      <h2 className="display">CITY AFTER MAPS.</h2>
      <div className="map__grid">
        <svg viewBox="0 0 100 100" className="map__svg" role="img" aria-label="Stylized night market map">
          <path d={PATH} fill="none" stroke="rgba(255,46,200,0.35)" strokeWidth="0.8" />
          <path d={PATH} className="map__pulse" fill="none" stroke="#2af0ff" strokeWidth="0.6" />
          {MAP_NODES.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={active.id === node.id ? 2.8 : 1.8}
                fill={active.id === node.id ? "#ffb020" : "#ff2ec8"}
                onMouseEnter={() => setActive(node)}
              />
              <text x={node.x + 3} y={node.y - 2} fontSize="3.2" fill="#f4eefc">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
        <aside>
          <p>{EVENT.place}</p>
          <h3>{active.label}</h3>
          <p>{active.copy}</p>
          <p className="map__meta">
            {EVENT.date}
            <br />
            {EVENT.hours}
          </p>
          <a className="btn btn--ghost" href="https://maps.google.com" target="_blank" rel="noreferrer" data-cursor="link">
            OPEN DIRECTIONS
          </a>
        </aside>
      </div>
    </section>
  )
}
