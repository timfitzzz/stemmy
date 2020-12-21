import React, { useMemo } from 'react'
import { Layer, Stage } from 'react-konva'
import { useContextSelector } from 'react-use-context-selector'
import { ToneAudioBuffer } from 'tone'
import { TrackWaveform } from './TrackWaveform'

interface ITracksWaveform {
  segments?: { min: number; max: number }[][] | null
  layerOffset: { x: number; y: number }
  zeroRadius: number
  drawAreaHeight: number
}

export function TracksWaveform({
  segments,
  layerOffset,
  zeroRadius,
  drawAreaHeight,
}: ITracksWaveform) {
  // TODO: fix this. need to get volume from track to accurately represent final result of playback
  let volume = 1

  // console.log('segments passed to trackswaveform: ', segments)

  return (
    <Layer offset={layerOffset}>
      {segments &&
        segments.map((segments, i) => (
          <TrackWaveform
            segments={segments}
            layerOffset={layerOffset}
            zeroRadius={zeroRadius}
            drawAreaHeight={drawAreaHeight}
            volume={volume}
            key={'TracksDisplaySegment' + i}
          />
        ))}
    </Layer>
  )
}
