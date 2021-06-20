import { memo } from 'react'
import styles from './Node.module.css'
import { DraggableContainer } from 'components/DraggableContainer/DraggableContainer'

export const Node = memo(({ bgColor, fgColor, width, height, x, y, onDrag, id, onDrop, onSplit }) => {
  const area = width * height
  return (
    <DraggableContainer x={x} y={y} onDrag={onDrag} id={id} onDrop={onDrop} onDoubleClick={onSplit}>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: bgColor,
          color: fgColor,
        }}
        className={styles.root}
      >
        <div className={styles.areaText}>
          {area.toFixed(0)}px<sup>2</sup>
        </div>
      </div>
    </DraggableContainer>
  )
})
