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
import { TracksWaveform } from './TracksWaveform'
import { RootState } from '../../../store'
import { createSelector } from 'reselect'
import { useSelector } from 'react-redux'
const happycat = require('../../../images/happycat.jpg') as string
import useImage from 'use-image'
import { TracksDisplayPlayButton } from './TracksDisplayPlayButton'
import useTracks, { IuseTracksModes } from '../../../helpers/useTracks'

interface ITracksDisplay {
  trackIds: string[]
  width: number
  height: number
  outerMargin: number
  innerMargin: number
  ref?: any
  setPlayback: boolean
  playToggle: () => void
  isPlaying: () => boolean
}

const TracksDisplay = ({
  trackIds,
  width,
  height,
  outerMargin,
  innerMargin,
  setPlayback,
  playToggle,
  isPlaying,
}: ITracksDisplay) => {
  // center of circle is defined by width and height
  let center = useMemo(() => {
    return {
      x: width / 2,
      y: height / 2,
    }
  }, [width, height])

  // layer offset defined by center (make 0:0 the center)
  let layerOffset: { x: number; y: number } = {
    x: -Math.abs(center.x),
    y: -Math.abs(center.y),
  }

  // temporary image, later to be populated from project settings
  const [cat, catStatus] = useImage(happycat)
  let [segments, setSegments] = useState<
    { min: number; max: number }[][] | null
  >(null)

  // outer radius (outer bound of draw area)
  let outerRadius = useMemo(() => height / 2 - (outerMargin as number), [
    height,
  ])
  // inner radius (inner bound of draw area)
  let innerRadius = useMemo(() => innerMargin as number, [height])
  // height of draw area (difference between inner and outer radii)
  let drawAreaHeight = outerRadius - innerRadius
  // zero radius (center of draw area)
  let zeroRadius = innerRadius + drawAreaHeight / 2

  // number of pixels around the zero radius
  let circumferencePixels = useMemo(() => {
    return 2 * Math.PI * zeroRadius
  }, [layerOffset, zeroRadius])

  const { tracks, getSegments, getLongest, fullyLoaded } = useTracks({
    ids: trackIds,
    modules: [IuseTracksModes.player],
    setPlayback,
  })

  let longest = getLongest()
  console.log('tracks fully loaded? ', fullyLoaded ? 'yes' : 'no')
  console.log('longest track: ', longest, tracks)

  useEffect(() => {
    console.log('tracksdisplay useeffect', fullyLoaded)
    if (fullyLoaded && getSegments) {
      let segments = getSegments(circumferencePixels)
      console.log('segments: ', segments)
      setSegments(segments)
    }
  }, [fullyLoaded])

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
          <TrackImageBackground height={height} layerOffset={layerOffset} />
          <Layer offset={layerOffset}>
            <Circle
              fillPatternImage={cat}
              fillPatternX={-innerRadius}
              fillPatternY={-innerRadius}
              fillPatternScale={{
                x: 0.2,
                y: 0.2,
              }}
              x={0}
              y={0}
              width={innerRadius * 2}
              height={innerRadius * 2}
              radius={innerRadius}
            />
          </Layer>

          {segments && (
            <>
              <TracksWaveform
                zeroRadius={zeroRadius}
                drawAreaHeight={drawAreaHeight}
                segments={segments}
                layerOffset={layerOffset}
              />
              <TracksDisplayPlayButton
                playToggle={playToggle}
                isPlaying={isPlaying}
                layerOffset={layerOffset}
                height={innerRadius * 2}
                width={innerRadius * 2}
              />
              <AudioEngineProvider value={value}>
                <TrackKonvaPlayhead
                  trackLength={longest}
                  center={center}
                  getPlayheadCoords={getPlayheadCoords}
                />
              </AudioEngineProvider>
            </>
          )}
        </Stage>
      )}
    </AudioEngineConsumer>
  )
}

TracksDisplay.whyDidYouRender = true
export default TracksDisplay