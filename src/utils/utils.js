let id = 0
// ok for now 💩
export const uniqueId = () => ++id

export const hexifyColor = (r, g, b) => {
  const processComponent = c => {
    const hex = Math.round(c).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }

  return `#${[r, g, b].map(processComponent).join('')}`
}

export function randomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFloat(min, max) {
  return Math.random() * (max - min) + min
}

export function splitInt(value, ratio) {
  ratio = clamp(ratio, 0, 1)
  const pivot = Math.round(value * ratio)
  return [pivot, value - pivot]
}

export const clamp = (val, min, max) => (val > max ? max : val < min ? min : val)
export const mapRange = (value, fromLow, fromHigh, toLow, toHigh) => {
  value = clamp(value, fromLow, fromHigh)
  return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow
}

export const remove = (arr, item) => {
  const i = arr.findIndex(s => s === item)
  if (i !== -1) {
    arr.splice(i, 1)
  }
  return arr
}
// https://gamedev.stackexchange.com/a/38542
export const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
export const joinColorComponent = (c1, c2, ratio) => {
  return Math.sqrt((1 - ratio) * c1 ** 2 + ratio * c2 ** 2)
}

// Solving quadratic equation (reverse joinColor). Back to school
const reverseJoinColorComponent = (sourceColor, nextColor, ratio) => {
  const a = 1 - ratio
  const b = 0
  const c = nextColor ** 2 * ratio - sourceColor ** 2
  const d = b ** 2 - 4 * a * c
  return Math.abs(-b + Math.sqrt(d) / (2 * a))
}

export const splitColorComponent = (sourceColor, ratio) => {
  const [c1, c2] = splitInt(sourceColor, ratio)
  // biggest one (based on ratio) goes first
  return ratio > 0.5
    ? [c1, reverseJoinColorComponent(sourceColor, c1, ratio)]
    : [c2, reverseJoinColorComponent(sourceColor, c2, ratio)]
}
