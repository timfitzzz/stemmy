import React, { useMemo } from 'react'
import { Layer, Line } from 'react-konva'
import { ToneAudioBuffer } from 'tone'
import { getCirclePoint } from '.'

interface ITrackWaveform {
  zeroRadius: number
  drawAreaHeight: number
  volume: number
  segments: { min: number; max: number }[]
  layerOffset: { x: number; y: number }
}

export function TrackWaveform({
  zeroRadius,
  drawAreaHeight,
  volume,
  segments,
  layerOffset,
}: ITrackWaveform) {
  function getSegmentMinXY(
    segmentIndex: number,
    segmentMin: number
  ): { x: number; y: number } {
    let segmentInnerRadius = zeroRadius + segmentMin * drawAreaHeight
    return getCirclePoint(
      (360 / segments.length) * (segmentIndex + 1),
      segmentInnerRadius
    )
  }

  function getSegmentMaxXY(
    segmentIndex: number,
    segmentMax: number
  ): { x: number; y: number } {
    let segmentOuterRadius = zeroRadius + segmentMax * drawAreaHeight
    return getCirclePoint(
      (360 / segments.length) * (segmentIndex + 1),
      segmentOuterRadius
    )
  }

  return (
    <>
      {segments.map((segment, i) => {
        let startXY = getSegmentMinXY(i, segment.min * volume)
        let endXY = getSegmentMaxXY(i, segment.max * volume)

        return (
          <Line
            points={[startXY.x, startXY.y, endXY.x, endXY.y]}
            stroke={'black'}
            opacity={0.6}
            strokeWidth={1}
            open
            key={'trackwaveformsegment' + i}
          />
        )
      })}
    </>
  )
}
