import { useCallback, useRef } from 'react'

export const useLatest = obj => {
  const ref = useRef()
  ref.current = obj

  return useCallback(() => {
    return ref.current
  }, [])
}
