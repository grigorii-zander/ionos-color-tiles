import React, { useCallback, useState } from 'react'
import { DNDContext } from 'contexts/DNDContext'

export const DNDProvider = ({ children }) => {
  const instance = {}
  const [dropCandidateId, setDropCandidate] = useState(null)
  const [dragId, setDragId] = useState(null)

  const updateDropCandidate = useCallback(id => setDropCandidate(id), [])
  const clearDropCandidate = useCallback(() => setDropCandidate(null), [])
  const dragStart = useCallback(id => setDragId(id), [])
  const dragEnd = useCallback(() => setDragId(null), [])

  Object.assign(instance, {
    updateDropCandidate,
    clearDropCandidate,
    dragStart,
    dragEnd,
    dropCandidateId,
    dragId,
  })
  return <DNDContext.Provider value={instance}>{children}</DNDContext.Provider>
}
