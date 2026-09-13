import { useLenis } from "../hooks/useLenis"

export function SmoothScroll({ children }) {
  useLenis()
  return children
}
