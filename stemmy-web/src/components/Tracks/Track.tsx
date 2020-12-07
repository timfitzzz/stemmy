import React, { MouseEvent, UIEvent, useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import styled from 'styled-components'
import { LoopProps, TrackProps } from '../../types'

import { useEntityPlayer } from '../../helpers/useEntityPlayer'
import { getLoop } from '../../store/loops/actions'
import { getLoopAudioUrlById } from '../../rest';

import Axios, { AxiosResponse } from 'axios'
import TrackImageKonva from './TrackImageKonva'
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
  currentPlayhead: 0
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
  | { type: 'setCurrentVolume', volume: number }
  | { type: 'setCurrentPlayhead', location: number }

function TrackReducer(state: TrackState, action: TrackActions) {
  console.log('track reducer called, ', action)
  switch (action.type) {
    case 'loadedPlayer': 
      return {
        ...state,
        loadedPlayer: true,
        loadingPlayer: false
      }
    case 'loadingPlayer':
      return {
        ...state,
        loadingPlayer: true,
        loadedPlayer: false
      }
    case 'setPlaying':
      return {
        ...state,
        playing: true
      }
    case 'unsetPlaying':
      return {
        ...state,
        playing: false
      }
    case 'setCurrentVolume':
      return {
        ...state,
        currentVolume: action.volume
      }
    case 'setCurrentPlayhead':
      return {
        ...state,
        currentPlayhead: action.location
      }
  }
}

const Track = ({ trackId, editing, perRow, asPlayer = false}: ITrackProps) => {

  console.log('rendering Track')


  const [{ 
    loadedPlayer, 
    loadingPlayer, 
    playing, 
    currentVolume, 
    currentPlayhead
  }, localDispatch ] = useReducer(TrackReducer, defaultTrackState)

  // entityPlayer state -- will be loaded in useEffect below
  // let [entityPlayer, setEntityPlayer] = useState<Player | null>(null)
  let ref = useRef<HTMLDivElement>(null)

  // const dispatch = useDispatch()


  let { entity, player } = useTrack({id: trackId, player: true})

  // // GET entityProps from Redux store (if available)
  // const entityProps: LoopProps | null = useSelector<
  //   RootState,
  //   LoopProps | null
  // >(state => {
  //   if (entityId && state.loops.byId[entityId]) {
  //     return state.loops.byId[entityId]
  //   } else {
  //     return {}
  //   }
  // })

  //  get sourceNode state from useSourceNode hook (mostly null on first render)
  const {
    entityPlayer,
    sourceBuffer,
    getPlaybackLocation,
    getPlaybackTime,
    getVolume,
    getGain,
    toggleReverse,
    volumeUp,
    volumeDown,
  } = player

  useEffect(() => {
    if (entityPlayer && !loadedPlayer) {
      localDispatch({ type: 'loadedPlayer' })
    }
  }, [entityPlayer])

  // // FIRST: if unavailable, get entityProps for the track's associated entity
  // useEffect(() => {
  //   if (entityId && !entityProps) {
  //     dispatch(getLoop({ id: entityId }))
  //   }
  // }, [])

  console.log('loaded track player :', loadedPlayer)
  console.log('loading track player :', loadingPlayer)

  useEffect(() => {
    console.log('running track useeffect');
    if (entity && !entityPlayer && !loadingPlayer) {
      localDispatch({type: 'loadingPlayer'})
    } else if (entity && entityPlayer && loadingPlayer) {
      localDispatch({type: 'loadedPlayer'})
    }
  }, [entityPlayer, loadedPlayer, loadingPlayer])

  // // 2nd (WHEN entityProps are loaded): set entityPlayer properties to match
  // useEffect(() => {
  //   if (entityProps && !entityPlayer && !loadingPlayer) {
  //     // console.log('loading track player')
  //     // setLoadingPlayer(true)
  //     // Axios.get<ArrayBuffer>(`${REST_URI}/loops/audio/${entityId}`, {
  //     //   responseType: 'arraybuffer',
  //     // }).then(res => {
  //     //   console.log(res)
  //     //   setArrayBuffer(res.data)
  //     //   console.log('setting array buffer: ', res.data)
  //     //   setLoadingAudio(false)
  //     // })
  //   }

  //   return () => {}
  // }, [entityProps])

  // 3rd (WHEN sourceNode is ready and getPlaybackTime is available): setTimeout to update playhead position at a regular interval
  // useEffect(() => {
  //     // let timeCron = setTimeout(() => {
  //     //   if (getPlaybackLocation) {
  //     //     localDispatch({ type: 'setCurrentPlayhead', location: getPlaybackLocation() || 0 })
  //     //   }
  //     // }, 16);
  
  //     // return(() => {
  //     //   clearTimeout(timeCron);
  //     // })
  
  // }, [getPlaybackLocation])
  
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
  // // toggle playback
  // function togglePlay() {
  //   if (entityPlayer) {
  //     if (!playing) {
  //       startPlaybackNow()
  //       localDispatch({ type: 'setPlaying' })
  //     } else {
  //       stopPlaybackNow()
  //       localDispatch({ type: 'unsetPlaying' })
  //       localDispatch({ type: 'setCurrentPlayhead', location: 0})
  //     }
  //   }
  // }
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

  return (
    <TrackWrapper perRow={3}>
     <TrackImageContainer onWheel={handleGainScroll}> 
        { entityPlayer && entityPlayer.loaded && sourceBuffer &&
          <TrackImageKonva ref={ref} 
            audioBuffer={sourceBuffer}
            entityPlayer={entityPlayer}
            currentPlayhead={currentPlayhead}
            width={90}
            height={90}
            volume={getGain() || 0}
            outerMargin={2}
            innerMargin={15}
            toggleReverse={toggleReverse}
            key={'trackImage'+trackId}
          />
        }
        {/* {playing ? (
          <TrackPauseButton onClick={togglePlay} />
        ) : (
          <TrackPlayButton onClick={togglePlay} />
        )} */}
      </TrackImageContainer>
    </TrackWrapper>
  )
}

Track.whyDidYouRender = true;

export { Track }