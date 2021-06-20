import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { NodeController } from 'NodeController/NodeController'
import styles from './Viewport.module.css'
import { Node } from 'components/Node/Node'

export const Viewport = () => {
  const viewportRef = useRef(null)
  const nodeController = useMemo(() => new NodeController(), [])

  useEffect(() => {
    const resizeHandler = () => {
      const rect = viewportRef.current.getBoundingClientRect()
      nodeController.setViewportSize(rect.width, rect.height)
    }
    window.addEventListener('resize', resizeHandler)
    resizeHandler()
    return () => window.removeEventListener('resize', resizeHandler)
  }, [nodeController])

  const initialState = useMemo(() => {
    return {
      nodes: [],
    }
  }, [])

  const reducer = useCallback(
    (state, action) => {
      if (!action.type) {
        throw new Error('Unknown action')
      }
      switch (action.type) {
        case 'init': {
          return state
        }
        case 'populate': {
          return {
            ...state,
            nodes: [...state.nodes, ...nodeController.produce(action.payload.count)],
          }
        }
        case 'node:drag': {
          const node = state.nodes.find(node => node.id === action.payload.id)
          if (node) {
            node.x = action.payload.x
            node.y = action.payload.y
          }
          return {
            ...state,
          }
        }
        case 'node:merge': {
          const { targetId, destinationId } = action.payload
          const target = state.nodes.find(node => node.id === targetId)
          const destination = state.nodes.find(node => node.id === destinationId)
          if (!target || !destination) {
            return state
          }

          const node = nodeController.merge(destination, target)

          return {
            ...state,
            nodes: [...state.nodes.filter(node => node.id !== targetId && node.id !== destinationId), node],
          }
        }
        case 'node:split': {
          const node = state.nodes.find(node => node.id === action.payload.id)
          if (!node) {
            return state
          }

          const newNodes = nodeController.split(node)

          return {
            ...state,
            nodes: [...state.nodes.filter(node => node.id !== action.payload.id), ...newNodes],
          }
        }
        // 🍑🍑🍑🍑
        case 'node:shake': {
          return {
            ...state,
            nodes: state.nodes.map(node => nodeController.shakeNode(node)),
          }
        }
        case 'node:drop': {
          return {
            ...state,
            nodes: state.nodes.map(node => nodeController.dropNodeToTheFloor(node)),
          }
        }
        default:
          throw new Error(`Unknown action ${action.type}`)
      }
    },
    [nodeController],
  )

  const [state, dispatch] = useReducer(reducer, null, () => reducer(initialState, { type: 'init' }))

  const handleNodeMerge = useCallback(
    (targetId, destinationId) => {
      dispatch({ type: 'node:merge', payload: { targetId, destinationId } })
    },
    [dispatch],
  )
  const handleNodeDrag = useCallback(
    (id, coords) => {
      dispatch({ type: 'node:drag', payload: { id, ...coords } })
    },
    [dispatch],
  )

  const handleNodeSplit = useCallback(
    id => {
      dispatch({ type: 'node:split', payload: { id } })
    },
    [dispatch],
  )

  const populate = () => dispatch({ type: 'populate', payload: { count: 20 } })
  const shake = () => dispatch({ type: 'node:shake' })
  const dropNodes = () => dispatch({ type: 'node:drop' })

  return (
    <div className={styles.root} ref={viewportRef}>
      <div className={styles.menuWrapper}>
        <button onClick={populate}>Populate</button>
        <button onClick={shake}>Shake</button>
        <button onClick={dropNodes}>Drop Nodes</button>
      </div>
      {state.nodes.map(node => (
        <Node
          key={node.id}
          id={node.id}
          width={node.size}
          height={node.size}
          bgColor={node.bgColor}
          fgColor={node.fgColor}
          x={node.x}
          y={node.y}
          onDrop={handleNodeMerge}
          onDrag={handleNodeDrag}
          onSplit={handleNodeSplit}
        />
      ))}
    </div>
  )
}
