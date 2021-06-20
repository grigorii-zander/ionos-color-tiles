import styles from './DraggableContainer.module.css'
import { useState } from 'react'
import { useAnimationEnd } from 'hooks/useAnimationEnd'
import { useDND } from 'hooks/useDND'

export const DraggableContainer = ({ id, x = 0, y = 0, children, onDrop, onDrag, onDoubleClick }) => {
  const [appeared, setAppeared] = useState(false)
  const { setRef, node, dragging, hovered } = useDND(id, {
    coords: { x, y },
    onDrop: destination => {
      onDrop(id, destination)
    },
    onDrag,
    onDoubleClick,
  })

  useAnimationEnd(node, styles.appear, () => {
    setAppeared(true)
  })

  return (
    <div
      data-dragging={dragging}
      data-hovered={hovered}
      data-appearing={!appeared}
      style={{ left: `${x}px`, top: `${y}px` }}
      ref={setRef}
      className={styles.root}
    >
      {children}
    </div>
  )
}
