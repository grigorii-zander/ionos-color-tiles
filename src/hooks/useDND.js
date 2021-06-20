import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { DNDContext } from 'contexts/DNDContext'
import { useLatest } from 'hooks/useLatest'

// why not? the latest clicked container will be always on top
let zIndexAdhoc = 1
export const useDND = (id, { onDrop, onDrag, coords, onDoubleClick }) => {
  const [node, setNode] = useState(null)
  const setRef = useCallback(node => setNode(node), [])
  const manager = useContext(DNDContext)
  // cheeky trick to prevent unnecessary rerender using function pointer as hook dependency
  // (instead of "real" function)
  const getDropCallback = useLatest(onDrop)
  const getDragCallback = useLatest(onDrag)
  const getDoubleClickCallback = useLatest(onDoubleClick)
  const getManager = useLatest(manager)

  const initialCoordsRef = useRef(coords)

  // hacking around with timeouts to achieve dblclick behavior
  // because we set pointer-events:none on a draggable container.
  // that's why native onDoubleClick won't work
  const dblClickTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(dblClickTimerRef.current), [])
  const clickStateRef = useRef(false)

  const dragging = manager.dragId === id
  const hovered = manager.dropCandidateId === id && manager.dragId !== null && manager.dragId !== id

  const onMouseDown = useCallback(
    e => {
      if (clickStateRef.current) {
        clearTimeout(dblClickTimerRef.current)
        clickStateRef.current = false
        const cb = getDoubleClickCallback()
        return cb(id)
      }

      clickStateRef.current = true
      dblClickTimerRef.current = setTimeout(() => {
        clickStateRef.current = false
      }, 200)

      const manager = getManager()
      manager.dragStart(id)
      initialCoordsRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
      if (node) {
        node.style.zIndex = ++zIndexAdhoc
      }
    },
    [getManager, id, node, getDoubleClickCallback],
  )

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
    node.addEventListener('mousedown', onMouseDown)
    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mouseleave', handleMouseLeave)
      node.removeEventListener('mousedown', onMouseDown)
    }
  }, [node, getManager, id, onMouseDown])

  const onDragEnd = useCallback(() => {
    const manager = getManager()
    if (manager.dragId === id && manager.dropCandidateId !== null) {
      const cb = getDropCallback()
      cb(manager.dropCandidateId)
    }
    manager.dragEnd(id)
  }, [getDropCallback, id, getManager])

  useEffect(() => {
    if (dragging) {
      const handleDrag = e => {
        const rect = node.getBoundingClientRect()
        const dx = e.clientX - initialCoordsRef.current.x
        const dy = e.clientY - initialCoordsRef.current.y
        getDragCallback()(id, {
          x: rect.x + dx,
          y: rect.y + dy,
        })
        initialCoordsRef.current = {
          x: e.clientX,
          y: e.clientY,
        }
      }
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', onDragEnd)
      return () => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', onDragEnd)
      }
    }
  }, [dragging, id, node, getDragCallback, onDragEnd])

  return {
    setRef,
    node,
    dragging,
    hovered,
  }
}
