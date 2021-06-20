import { useLatest } from 'hooks/useLatest'
import { useEffect } from 'react'

export const useAnimationEnd = (node, name, callback) => {
  const getCallback = useLatest(callback)
  useEffect(() => {
    if (!node) {
      return
    }
    const cb = getCallback()

    node.addEventListener('animationend', ({ animationName }) => {
      if (name === animationName) {
        cb()
      }
    })
  }, [getCallback, node, name])
}
