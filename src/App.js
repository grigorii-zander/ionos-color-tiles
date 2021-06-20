import React from 'react'
import { Viewport } from 'components/Viewport/Viewport'
import { DNDProvider } from 'components/DNDProvider/DNDProvider'

export const App = () => {
  return (
    <DNDProvider>
      <Viewport />
    </DNDProvider>
  )
}
