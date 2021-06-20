import { useEffect, useRef } from 'react'

export const useEffectAfterMount = effect => {
  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) {
      return
    }
    mountedRef.current = true
    effect()
  }, [effect])
}
