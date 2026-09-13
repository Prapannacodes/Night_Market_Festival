export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const lerp = (start, end, amount) => start + (end - start) * amount

export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  const t = (value - inMin) / (inMax - inMin)
  return outMin + t * (outMax - outMin)
}
