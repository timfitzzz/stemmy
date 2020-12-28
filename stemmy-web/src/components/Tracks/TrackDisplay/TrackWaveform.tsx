import React, { useMemo } from 'react'
import { Layer, Line } from 'react-konva'
import { ToneAudioBuffer } from 'tone'
import { getCirclePoint, getSegmentXY } from '.'

interface ITrackWaveform {
  zeroRadius: number
  drawAreaHeight: number
  volume: number
  segments: { min: number; max: number }[]
  layerOffset: { x: number; y: number }
  color?: string
  opacity?: number
}

export function TrackWaveform({
  zeroRadius,
  drawAreaHeight,
  volume,
  segments,
  layerOffset,
  color = 'black',
  opacity = 0.6,
}: ITrackWaveform) {
  return (
    <>
      {segments &&
        segments.map((segment, i) => {
          let startXY = getSegmentXY(
            i,
            segment.min * volume,
            zeroRadius,
            drawAreaHeight,
            segments.length
          )
          let endXY = getSegmentXY(
            i,
            segment.max * volume,
            zeroRadius,
            drawAreaHeight,
            segments.length
          )

          return (
            <Line
              points={[startXY.x, startXY.y, endXY.x, endXY.y]}
              stroke={color}
              opacity={opacity}
              strokeWidth={1}
              open
              key={'trackwaveformsegment' + i}
            />
          )
        })}
    </>
  )
}
