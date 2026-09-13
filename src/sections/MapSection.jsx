import { useRef, useState } from "react"
import SectionBackground from "../components/SectionBackground"
import { EVENT, MAP_NODES } from "../data/content"
import { useStampOnView } from "../hooks/useStampOnView"

const PATH = "M 14 52 C 18 36, 24 28, 32 28 C 40 28, 44 18, 52 18 C 62 18, 68 22, 74 30 C 82 40, 76 52, 62 58 C 50 64, 44 68, 38 72 C 32 76, 68 84, 84 76"

export default function MapSection() {
  const root = useRef(null)
  const [active, setActive] = useState(MAP_NODES[0])
  useStampOnView(root, "explorer", 800)

  return (
    <section id="map" className="map" ref={root}>
      <SectionBackground image="/images/map-bg.jpg" opacity={0.48} />
      <p className="kicker">FIND THE LIGHTS.</p>
      <h2 className="display">CITY AFTER MAPS.</h2>
      <div className="map__grid">
        <svg viewBox="0 0 100 100" className="map__svg" role="img" aria-label="Stylized night market map">
          {/* Blueprint District Boundary & Grid */}
          <polygon
            points="8,22 22,8 78,8 92,22 92,78 78,92 22,92 8,78"
            fill="none"
            stroke="rgba(42,240,255,0.14)"
            strokeWidth="0.4"
            strokeDasharray="2 3"
          />
          <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" strokeDasharray="1 3" />
          <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" strokeDasharray="1 3" />

          {/* Main Stage Courtyard Rings */}
          <circle cx="62" cy="58" r="7" fill="none" stroke="rgba(255,46,200,0.14)" strokeWidth="0.35" />
          <circle cx="62" cy="58" r="14" fill="none" stroke="rgba(42,240,255,0.08)" strokeWidth="0.35" strokeDasharray="1.5 2.5" />

          {/* Secondary Crosswalks */}
          <path d="M 14 52 C 22 62, 28 68, 38 72" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.4" strokeDasharray="2 2" />
          <path d="M 38 72 C 48 68, 54 62, 62 58" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.4" strokeDasharray="2 2" />
          <path d="M 62 58 C 72 64, 78 70, 84 76" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.4" strokeDasharray="2 2" />

          {/* Primary Route and Animated Pulse */}
          <path d={PATH} fill="none" stroke="rgba(255,46,200,0.35)" strokeWidth="0.9" />
          <path d={PATH} className="map__pulse" fill="none" stroke="#2af0ff" strokeWidth="0.8" />

          {/* Map Blueprint Labels */}
          <text x="12" y="14" fontSize="2.2" fill="rgba(42,240,255,0.45)" fontFamily="var(--font-mono)">
            MELA GROUNDS // CIRCUIT
          </text>
          <text x="88" y="88" fontSize="2" fill="rgba(255,255,255,0.3)" fontFamily="var(--font-mono)" textAnchor="end">
            SYS/ROUTE-ACTIVE
          </text>

          {/* Interactive Market Nodes */}
          {MAP_NODES.map((node) => {
            const isCurrent = active.id === node.id
            return (
              <g key={node.id} data-cursor="button" style={{ cursor: "pointer" }}>
                {isCurrent && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4.2"
                    fill="none"
                    stroke="#ffb020"
                    strokeWidth="0.4"
                    opacity="0.65"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCurrent ? 2.6 : 1.8}
                  fill={isCurrent ? "#ffb020" : "#ff2ec8"}
                  onMouseEnter={() => setActive(node)}
                  onClick={() => setActive(node)}
                />
                <text
                  x={node.x + (node.x > 70 ? -3 : 3)}
                  y={node.y - (node.y > 60 ? -4 : 2)}
                  fontSize="3"
                  fill="#f4eefc"
                  fontWeight={isCurrent ? "700" : "400"}
                  textAnchor={node.x > 70 ? "end" : "start"}
                  onMouseEnter={() => setActive(node)}
                  onClick={() => setActive(node)}
                >
                  {node.label}
                </text>
              </g>
            )
          })}
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
