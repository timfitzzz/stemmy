import React, {
  MouseEvent,
  UIEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import styled from 'styled-components'
import { LoopProps, TrackProps } from '../../types'

import { useEntityPlayer } from '../../helpers/useEntityPlayer'
import { getLoop } from '../../store/loops/actions'
import { getLoopAudioUrlById } from '../../rest'

import Axios, { AxiosResponse } from 'axios'
import TrackDisplay from './TrackDisplay'
import { Player } from 'tone'
import useTrack from '../../helpers/useTrack'

export const REST_URI = process.env.GATSBY_REST_URI

export interface ITrackProps {
  trackId: string
  editing: boolean
  perRow: number
  asPlayer?: boolean
}

export interface ITrackWrapper {
  perRow: number
}

export const TrackWrapper = styled.div<ITrackWrapper>`
  width: ${p => 100 / p.perRow}%;
  max-width: ${p => 100 / p.perRow}%;
  min-width: ${p => 100 / p.perRow}%;
  padding: 10px;
`

export const TrackImageContainer = styled.div`
  position: relative;
  display: flex;
`

export const TrackImage = styled.img`
  flex-shrink: 0;
  width: 100%;
  touch-action: none;
`
export const TrackPlayButton = styled.div`
  position: absolute;
  margin: auto;
  width: 0;
  height: 0;
  top: -50%;
  bottom: -50%;
  left: -44%;
  right: -50%;
  border-top: 8px solid transparent;
  border-left: 15px solid ${p => p.theme.palette.primary};
  border-bottom: 8px solid transparent;
`

export const TrackPauseButton = styled.div`
  position: absolute;
  margin: auto;
  width: 12px;
  height: 16px;
  top: -50%;
  bottom: -50%;
  left: -50%;
  right: -50%;
  border-right: 4px solid ${p => p.theme.palette.primary};
  border-left: 4px solid ${p => p.theme.palette.primary};
`

export const TrackVolumeDisplay = styled.div`
  position: absolute;
  margin: auto;
  padding-left: -5px;
  width: 50%;
  top: -50%;
  bottom: -50%;
  left: -2px;
  height: 98%;
  border-radius: 25%/50%;
  border: 2px solid red;
  border-right: 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
`

const defaultTrackState = {
  loadedPlayer: false,
  loadingPlayer: false,
  playing: false,
  currentVolume: 0,
  currentPlayhead: 0,
}

interface TrackState {
  loadedPlayer: boolean
  loadingPlayer: boolean
  playing: boolean
  currentVolume: number
  currentPlayhead: number
}

type TrackActions =
  | { type: 'loadedPlayer' }
  | { type: 'loadingPlayer' }
  | { type: 'setPlaying' }
  | { type: 'unsetPlaying' }
  | { type: 'setCurrentVolume'; volume: number }
  | { type: 'setCurrentPlayhead'; location: number }

function TrackReducer(state: TrackState, action: TrackActions) {
  switch (action.type) {
    case 'loadedPlayer':
      return {
        ...state,
        loadedPlayer: true,
        loadingPlayer: false,
      }
    case 'loadingPlayer':
      return {
        ...state,
        loadingPlayer: true,
        loadedPlayer: false,
      }
    case 'setPlaying':
      return {
        ...state,
        playing: true,
      }
    case 'unsetPlaying':
      return {
        ...state,
        playing: false,
      }
    case 'setCurrentVolume':
      return {
        ...state,
        currentVolume: action.volume,
      }
    case 'setCurrentPlayhead':
      return {
        ...state,
        currentPlayhead: action.location,
      }
  }
}

const Track = ({ trackId, editing, perRow, asPlayer = false }: ITrackProps) => {
  // component state
  const [
    { loadedPlayer, loadingPlayer, playing, currentVolume, currentPlayhead },
    localDispatch,
  ] = useReducer(TrackReducer, defaultTrackState)

  let ref = useRef<HTMLDivElement>(null)

  let {
    track,
    entity,
    player: {
      entityPlayer,
      sourceBuffer,
      getPlaybackLocation,
      getPlaybackTime,
      getVolume,
      getGain,
      toggleReverse,
      volumeUp,
      volumeDown,
    },
    setTrackCopy,
    setEntityCopy,
    commitCopies,
    getSegments,
  } = useTrack({ id: trackId, player: true, editor: editing })

  useEffect(() => {
    if (entityPlayer && !loadedPlayer) {
      localDispatch({ type: 'loadedPlayer' })
    }
  }, [entityPlayer])

  useEffect(() => {
    if (entity && !entityPlayer && !loadingPlayer) {
      localDispatch({ type: 'loadingPlayer' })
    } else if (entity && entityPlayer && loadingPlayer) {
      localDispatch({ type: 'loadedPlayer' })
    }
  }, [entityPlayer, loadedPlayer, loadingPlayer])

  // WHEN TrackImageContainer Ref is available: allow mousewheel to operate on this element without scrolling page
  useEffect(() => {
    function preventWheelDefault(this: HTMLDivElement, e: WheelEvent) {
      e.preventDefault()
    }

    if (entity) {
      if (ref && ref.current) {
        ref!.current!.addEventListener('wheel', preventWheelDefault)
      }
    }

    return () => {
      if (entity && ref && ref.current) {
        ref!.current!.removeEventListener('wheel', preventWheelDefault)
      }
    }
  }, [ref])

  // // HELPER FUNCTIONS
  //
  // handle mousewheel input as gain control
  function handleGainScroll(e: React.WheelEvent<HTMLDivElement>) {
    if (entityPlayer) {
      if (e.deltaY > 0) {
        volumeDown()
        localDispatch({ type: 'setCurrentVolume', volume: getVolume() || 0 })
      } else if (e.deltaY < 0) {
        volumeUp()
        localDispatch({ type: 'setCurrentVolume', volume: getVolume() || 0 })
      }
    }
  }

  /* need to implement the following properties:
    pan: number
    playing: boolean (interpret as 'muted')
    reverse: boolean
    scale: number
    synchronize: boolean
    volume: number
  */

  return (
    <TrackWrapper perRow={3}>
      <TrackImageContainer onWheel={handleGainScroll} ref={ref}>
        {entityPlayer && entityPlayer.loaded && sourceBuffer && (
          <TrackDisplay
            getSegments={getSegments || null}
            loaded={entityPlayer.loaded}
            duration={sourceBuffer.duration}
            reverse={entityPlayer.reverse}
            currentPlayhead={currentPlayhead}
            width={90}
            height={90}
            volume={getGain() || 0}
            outerMargin={2}
            innerMargin={15}
            toggleReverse={toggleReverse}
            key={'trackImage' + trackId}
          />
        )}
        {/* {playing ? (
          <TrackPauseButton onClick={togglePlay} />
        ) : (
          <TrackPlayButton onClick={togglePlay} />
        )} */}
      </TrackImageContainer>
    </TrackWrapper>
  )
}

Track.whyDidYouRender = true

export { Track }
