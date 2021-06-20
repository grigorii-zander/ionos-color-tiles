import {
  clamp,
  hexifyColor,
  joinColorComponent,
  luma,
  randomFloat,
  randomInt,
  splitColorComponent,
  splitInt,
  uniqueId,
} from 'utils/utils'

class Node {
  constructor({ id = uniqueId(), x = 0, y = 0, r, g, b, size }) {
    this.id = id
    this.r = clamp(r, 0, 255)
    this.g = clamp(g, 0, 255)
    this.b = clamp(b, 0, 255)
    this.x = x
    this.y = y
    this.size = size
    this.bgColor = hexifyColor(this.r, this.g, this.b)
    this.fgColor = luma(this.r, this.g, this.b) > 165 ? '#000000' : '#ffffff'
  }
}

export class NodeController {
  constructor({ maxSize = 250, minSize = 10, viewportWidth = 0, viewportHeight = 0 } = {}) {
    this.maxSize = maxSize
    this.minSize = minSize
    this.viewportWidth = viewportWidth
    this.viewportHeight = viewportHeight
  }

  setViewportSize(w, h) {
    this.viewportWidth = w
    this.viewportHeight = h
  }

  randomRGBColor() {
    const r = randomInt(0, 255)
    const g = randomInt(0, 255)
    const b = randomInt(0, 255)
    return {
      r,
      g,
      b,
    }
  }

  produce(count) {
    const list = new Array(count).fill(null)
    return list.map(() => {
      const node = new Node({
        ...this.randomRGBColor(),
        size: randomInt(this.maxSize, this.minSize),
      })
      return this.shakeNode(node)
    })
  }

  split(node) {
    if (node.size < this.minSize * 2) {
      return [node]
    }

    const ds = this.minSize / node.size
    const ratio = randomFloat(ds, 1 - ds)
    const [r1, r2] = splitColorComponent(node.r, ratio)
    const [g1, g2] = splitColorComponent(node.g, ratio)
    const [b1, b2] = splitColorComponent(node.b, ratio)
    const [s1, s2] = splitInt(node.size ** 2, ratio)

    const size1 = Math.sqrt(Math.min(s1, s2))
    const size2 = Math.sqrt(Math.max(s1, s2))

    return [
      new Node({
        r: r1,
        g: g1,
        b: b1,
        size: size1,
        // spread nodes a little
        x: randomInt(node.x - node.size / 2, node.x + node.size / 2),
        y: randomInt(node.y - node.size / 2, node.y + node.size / 2),
      }),
      new Node({
        r: r2,
        g: g2,
        b: b2,
        size: size2,
        x: randomInt(node.x - node.size / 2, node.x + node.size / 2),
        y: randomInt(node.y - node.size / 2, node.y + node.size / 2),
      }),
    ]
  }

  merge(node1, node2) {
    const oldArea = node1.size ** 2
    const newArea = oldArea + node2.size ** 2
    const ratio = node1.size / (node1.size + node2.size)
    const r = joinColorComponent(node1.r, node2.r, ratio)
    const g = joinColorComponent(node1.g, node2.g, ratio)
    const b = joinColorComponent(node1.b, node2.b, ratio)
    const offset = (Math.sqrt(newArea) - Math.sqrt(oldArea)) / 2
    const size = Math.round(Math.sqrt(node1.size ** 2 + node2.size ** 2))

    return new Node({
      id: node1.id,
      x: node1.x - offset,
      y: node1.y - offset,
      r,
      g,
      b,
      size,
    })
  }

  shakeNode(node) {
    node.x = randomInt(0, this.viewportWidth - node.size)
    node.y = randomInt(0, this.viewportHeight - node.size)
    return node
  }

  dropNodeToTheFloor(node) {
    node.y = this.viewportHeight - node.size
    return node
  }
}
