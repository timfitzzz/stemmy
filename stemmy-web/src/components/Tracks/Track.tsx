import React, { MouseEvent, UIEvent, useEffect, useRef, useState } from 'react'
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

export const Track = ({ trackId, editing, perRow, asPlayer = false}: ITrackProps) => {
  
  // entityPlayer state -- will be loaded in useEffect below
  // let [entityPlayer, setEntityPlayer] = useState<Player | null>(null)
  let [loadedPlayer, setLoadedPlayer] = useState<boolean>(false)
  let [loadingPlayer, setLoadingPlayer] = useState<boolean>(false)
  let [playing, setPlaying] = useState<boolean>(false)
  let ref = useRef<HTMLDivElement>(null)
  let [currentVolume, setCurrentVolume] = useState(0);

  const dispatch = useDispatch()

  let [currentPlayhead, setCurrentPlayhead] = useState(0);

  let { track, entity, player } = useTrack({id: trackId, player: asPlayer})

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

  console.log(player)

  //  get sourceNode state from useSourceNode hook (mostly null on first render)
  const {
    entityPlayer,
    sourceBuffer,
    startPlaybackNow,
    stopPlaybackNow,
    getPlaybackLocation,
    getPlaybackTime,
    getVolume,
    getGain,
    toggleReverse,
    volumeUp,
    volumeDown,
  } = player

  useEffect(() => {
    if (entityPlayer) {
      setLoadedPlayer(true)
    }
  }, [entityPlayer])

  // // FIRST: if unavailable, get entityProps for the track's associated entity
  // useEffect(() => {
  //   if (entityId && !entityProps) {
  //     dispatch(getLoop({ id: entityId }))
  //   }
  // }, [])

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
  useEffect(() => {
      let timeCron = setTimeout(() => {
        if (getPlaybackLocation) {
          setCurrentPlayhead(getPlaybackLocation() || 0)
        }
      }, 16);
  
      return(() => {
        clearTimeout(timeCron);
      })
  
  }, [getPlaybackLocation])
  
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

  // HELPER FUNCTIONS
  // toggle playback
  function togglePlay() {
    if (entityPlayer) {
      if (!playing) {
        startPlaybackNow()
        setPlaying(true)
      } else {
        stopPlaybackNow()
        setPlaying(false)
        setCurrentPlayhead(0)
      }
    }
  }
  // handle mousewheel input as gain control
  function handleGainScroll(e: React.WheelEvent<HTMLDivElement>) {
    if (entityPlayer) {
      if (e.deltaY > 0) {
        volumeDown()
        setCurrentVolume(getVolume() || 0)
      } else if (e.deltaY < 0) {
        volumeUp()
        setCurrentVolume(getVolume() || 0)
      }
    }
  }

  return (
    <TrackWrapper perRow={3}>
      <TrackImageContainer ref={ref} onWheel={handleGainScroll}>
        { entityPlayer && entityPlayer.loaded && sourceBuffer &&
          <TrackImageKonva 
            audioBuffer={sourceBuffer}
            entityPlayer={entityPlayer}
            currentPlayhead={currentPlayhead}
            width={90}
            height={90}
            volume={getGain() || 0}
            outerMargin={2}
            innerMargin={15}
            toggleReverse={toggleReverse}
          />
        }
        {playing ? (
          <TrackPauseButton onClick={togglePlay} />
        ) : (
          <TrackPlayButton onClick={togglePlay} />
        )}
      </TrackImageContainer>
    </TrackWrapper>
  )
}
