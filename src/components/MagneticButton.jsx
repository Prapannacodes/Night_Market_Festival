import { useMagneticHover } from "../hooks/useMagneticHover"

export default function MagneticButton({
  children,
  className = "btn",
  cursor = "button",
  type = "button",
  ...props
}) {
  const ref = useMagneticHover(0.2)
  return (
    <button ref={ref} type={type} className={className} data-cursor={cursor} {...props}>
      {children}
    </button>
  )
}
