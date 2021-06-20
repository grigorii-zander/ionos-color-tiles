import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLatest } from 'hooks/useLatest'

const DNDContext = React.createContext()

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

export const useDND = (id, onDrop) => {
  const [node, setNode] = useState(null)
  const setRef = useCallback(node => setNode(node), [])
  const manager = useContext(DNDContext)
  const getDropCallback = useLatest(onDrop)
  const getManager = useLatest(manager)
  useEffect(() => {
    if (!node) {
      return
    }
    const manager = getManager()
    const handleMouseEnter = () => {
      manager.updateDropCandidate(id)
    }
    const handleMouseLeave = () => {
      manager.clearDropCandidate()
    }

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [node, getManager, onDrop, id])

  const onDragStart = useCallback(() => {
    getManager().dragStart(id)
  }, [id, getManager])

  const onDragEnd = useCallback(() => {
    const manager = getManager()
    if (manager.dragId === id && manager.dropCandidateId !== null) {
      getDropCallback()(manager.dropCandidateId)
    }
    manager.dragEnd(id)
  }, [getDropCallback, id, getManager])

  const dragging = manager.dragId === id
  const hovered = manager.dropCandidateId === id && manager.dragId !== null && manager.dragId !== id
  return {
    setRef,
    node,
    onDragStart,
    onDragEnd,
    dragging,
    hovered,
  }
}
