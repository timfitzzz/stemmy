import React, { useEffect, useMemo, useState, Context } from 'react'
import {
  Stage,
  Layer,
  Line,
  Text,
  Circle,
  Arrow,
  Rect,
  Image,
} from 'react-konva'
import mainTheme from '../../../styles/theme'
import { Player, ToneAudioBuffer } from 'tone'
import TrackKonvaPlayhead from '../TrackKonvaPlayhead'
import ContextForAudio, {
  AudioEngineConsumer,
  AudioEngineProvider,
  OAudioEngine,
} from '../../../helpers/audioContext'
import { useContextSelector } from 'react-use-context-selector'
import { TrackControls } from './TrackControls'
import { TrackWaveform } from './TrackWaveform'
import { TrackImageBackground } from './TrackImageBackground'
import { getCirclePoint } from '.'

interface ITrackDisplay {
  getSegments: (segmentCount: number) => { min: number; max: number }[] | null
  loaded: boolean
  duration: number
  reverse: boolean
  currentPlayhead: number
  toggleReverse: () => void
  width: number
  height: number
  volume: number
  outerMargin: number
  innerMargin: number
  ref?: any
}

const TrackDisplay = ({
  getSegments,
  loaded,
  duration,
  reverse,
  toggleReverse,
  width,
  height,
  volume,
  outerMargin,
  innerMargin,
}: ITrackDisplay) => {
  let center = useMemo(() => {
    return {
      x: width / 2,
      y: height / 2,
    }
  }, [width, height])

  let layerOffset: { x: number; y: number } = {
    x: -Math.abs(center.x),
    y: -Math.abs(center.y),
  }

  let outerRadius = useMemo(() => height / 2 - (outerMargin as number), [
    height,
  ])
  let innerRadius = useMemo(() => innerMargin as number, [height])
  let drawAreaHeight = outerRadius - innerRadius
  let zeroRadius = innerRadius + drawAreaHeight / 2

  let circumferencePixels = useMemo(() => {
    return 2 * Math.PI * zeroRadius
  }, [layerOffset, zeroRadius])

  const segments = loaded ? getSegments(circumferencePixels) : null
  // const transport = useContextSelector(
  //   ContextForAudio as Context<OAudioEngine>,
  //   value => (value.transport ? value.transport : null)
  // )
  // const transportSecs = useContextSelector(
  //   ContextForAudio as Context<OAudioEngine>,
  //   value => (value.transport ? value.transport.seconds : null)
  // )
  // console.log('trackdisplay segments: ', segments)

  function getPlayheadShadowOffset(
    playheadZeroX: number,
    playheadZeroY: number,
    playheadDegrees: number,
    zeroRadius: number
  ): { x: number; y: number } {
    let justBehindPlayhead = getCirclePoint(playheadDegrees + 2, zeroRadius)
    let result = {
      x: playheadZeroX - justBehindPlayhead.x,
      y: playheadZeroY - justBehindPlayhead.y,
    }
    return result
  }

  function getPlayheadCoords(currentPlayhead: number) {
    return () => {
      let playheadDegrees = currentPlayhead * 360
      let { x: playheadTopX, y: playheadTopY } = getCirclePoint(
        playheadDegrees,
        outerRadius + 4
      )
      let { x: playheadZeroX, y: playheadZeroY } = getCirclePoint(
        playheadDegrees,
        zeroRadius
      )
      let { x: playheadBottomX, y: playheadBottomY } = getCirclePoint(
        playheadDegrees,
        innerRadius
      )
      let {
        x: playheadShadowOffsetX,
        y: playheadShadowOffsetY,
      } = getPlayheadShadowOffset(
        playheadZeroX,
        playheadZeroY,
        playheadDegrees,
        zeroRadius
      )
      return {
        playheadTopX,
        playheadTopY,
        playheadZeroX,
        playheadZeroY,
        playheadBottomX,
        playheadBottomY,
        playheadShadowOffsetX,
        playheadShadowOffsetY,
      }
    }
  }

  return (
    <AudioEngineConsumer>
      {value => (
        <Stage width={width} height={height}>
          <TrackControls
            height={height}
            width={width}
            toggleReverse={toggleReverse}
            reverse={reverse}
          />
          <TrackImageBackground height={height} layerOffset={layerOffset} />
          <Layer offset={layerOffset}>
            {segments && (
              <TrackWaveform
                zeroRadius={zeroRadius}
                drawAreaHeight={drawAreaHeight}
                volume={volume}
                segments={segments}
                layerOffset={layerOffset}
              />
            )}
          </Layer>
          <AudioEngineProvider value={value}>
            <TrackKonvaPlayhead
              trackLength={duration}
              center={center}
              getPlayheadCoords={getPlayheadCoords}
            />
          </AudioEngineProvider>
        </Stage>
      )}
    </AudioEngineConsumer>
  )
}

export default TrackDisplay