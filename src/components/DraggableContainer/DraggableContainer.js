import styles from './DraggableContainer.module.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDND } from 'dndManager/dndManager'
import { useAnimationEnd } from 'hooks/useAnimationEnd'

// why not? the latest clicked container will be always on top
let zIndexAdhoc = 1
export const DraggableContainer = ({ id, x = 0, y = 0, children, onDrop, onDrag, onDoubleClick }) => {
  const [appeared, setAppeared] = useState(false)
  const initialCoordsRef = useRef({ x, y })
  const [zIndex, setZIndex] = useState(0)

  // hacking around with timeouts to achieve dblclick behavior
  // because we set pointer-events:none on a draggable container.
  // that's why native onDoubleClick won't work
  const dblClickTimerRef = useRef(null)
  useEffect(() => () => clearTimeout(dblClickTimerRef.current), [])
  const clickStateRef = useRef(false)

  const { setRef, node, onDragStart, onDragEnd, dragging, hovered } = useDND(id, destination => {
    onDrop(id, destination)
  })

  useAnimationEnd(node, styles.appear, () => {
    setAppeared(true)
  })

  const onMouseDown = useCallback(
    e => {
      if (clickStateRef.current) {
        clearTimeout(dblClickTimerRef.current)
        clickStateRef.current = false
        return onDoubleClick(id)
      }

      clickStateRef.current = true
      dblClickTimerRef.current = setTimeout(() => {
        clickStateRef.current = false
      }, 200)

      onDragStart()
      initialCoordsRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
      setZIndex(++zIndexAdhoc)
    },
    [id, onDoubleClick, onDragStart],
  )

  const handleDragEnd = useCallback(() => {
    onDragEnd()
  }, [onDragEnd])

  useEffect(() => {
    if (dragging) {
      const handleDrag = e => {
        const rect = node.getBoundingClientRect()
        const dx = e.clientX - initialCoordsRef.current.x
        const dy = e.clientY - initialCoordsRef.current.y
        onDrag(id, {
          x: rect.x + dx,
          y: rect.y + dy,
        })
        initialCoordsRef.current = {
          x: e.clientX,
          y: e.clientY,
        }
      }
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', handleDragEnd)
      return () => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [dragging, handleDragEnd, id, node, onDrag, onDragEnd])

  return (
    <div
      data-dragging={dragging}
      data-hovered={hovered}
      data-appearing={!appeared}
      style={{ left: `${x}px`, top: `${y}px`, zIndex }}
      onMouseDown={onMouseDown}
      ref={setRef}
      className={styles.root}
    >
      {children}
    </div>
  )
}
