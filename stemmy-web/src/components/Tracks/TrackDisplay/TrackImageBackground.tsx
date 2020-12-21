import React from 'react'
import { Layer, Circle } from 'react-konva'

interface ITrackImageBackground {
  height: number
  layerOffset: { x: number; y: number }
}

export function TrackImageBackground({
  height,
  layerOffset,
}: ITrackImageBackground) {
  return (
    <Layer offset={layerOffset}>
      <Circle
        x={0}
        y={0}
        radius={height / 2}
        fillEnabled
        fill={'white'}
        // strokeWidth={1}
        // opacity={1}
        // stroke={mainTheme.palette.midPrimary}
      />
    </Layer>
  )
}
