import React from 'react'
import { DNDProvider } from 'dndManager/dndManager'
import { Viewport } from 'components/Viewport/Viewport'

export const App = () => {
  return (
    <DNDProvider>
      <Viewport />
    </DNDProvider>
  )
}
