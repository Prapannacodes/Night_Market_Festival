import { useReducedMotion } from "../hooks/useReducedMotion"

export default function SectionBackground({
  image,
  opacity = 0.52,
  overlay = true,
  className = "",
  style = {},
}) {
  const reduced = useReducedMotion()

  return (
    <div className={`section-bg ${className}`} aria-hidden="true" style={style}>
      <div
        className={`section-bg__media ${reduced ? "is-static" : ""}`}
        style={{
          backgroundImage: `url(${image})`,
          opacity,
        }}
      />
      {overlay ? <div className="section-bg__overlay" /> : null}
    </div>
  )
}
