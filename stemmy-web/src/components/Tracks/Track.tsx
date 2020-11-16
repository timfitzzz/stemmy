import React, { MouseEvent, UIEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import styled from 'styled-components'
import { LoopProps, TrackProps } from '../../types'

import { useSourceNode } from '../../helpers/useSourceNode'
import { getLoop } from '../../store/loops/actions'

import Axios, { AxiosResponse } from 'axios'
import TrackImageKonva from './TrackImageKonva'

export const REST_URI = process.env.GATSBY_REST_URI

export interface ITrackProps {
  trackId: string
  editing: boolean
  perRow: number
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

export const Track = ({ trackId, editing, perRow }: ITrackProps) => {
  
  // arrayBuffer state -- will be loaded in useEffect below
  let [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null)
  let [loadingAudio, setLoadingAudio] = useState<boolean>(false)
  let [playing, setPlaying] = useState<boolean>(false)
  let ref = useRef<HTMLDivElement>(null)
  let [currentGain, setCurrentGain] = useState(1);
  const dispatch = useDispatch()
  let [currentPlayhead, setCurrentPlayhead] = useState(0)

  // GET trackProps from Redux store
  const trackProps: TrackProps = useSelector<RootState, TrackProps>(state => {
    return state.tracks.byId[trackId]
  })
  let { entityType, entityId } = trackProps

  // GET entityProps from Redux store (if available)
  const entityProps: LoopProps | null = useSelector<
    RootState,
    LoopProps | null
  >(state => {
    if (entityId && state.loops.byId[entityId]) {
      return state.loops.byId[entityId]
    } else {
      return {}
    }
  })

  //  get sourceNode state from useSourceNode hook (mostly null on first render)
  const {
    sourceNode,
    gainNode,
    sourceBuffer,
    startPlayback,
    stopPlayback,
    getPlaybackTime,
    gainUp,
    gainDown,
  } = useSourceNode(arrayBuffer, [arrayBuffer, !loadingAudio], entityId)

  // FIRST: if unavailable, get entityProps for the track's associated entity
  useEffect(() => {
    if (entityId && !entityProps) {
      console.log('getting loop')
      dispatch(getLoop({ id: entityId }))
    }
  }, [])

  // 2nd (WHEN entityProps are loaded): get audio for the track's associated entity
  useEffect(() => {
    if (entityProps && !arrayBuffer && !loadingAudio) {
      console.log('loading audio')
      setLoadingAudio(true)
      Axios.get<ArrayBuffer>(`${REST_URI}/loops/audio/${entityId}`, {
        responseType: 'arraybuffer',
      }).then(res => {
        console.log(res)
        setArrayBuffer(res.data)
        console.log('setting array buffer: ', res.data)
        setLoadingAudio(false)
      })
    }

    return () => {}
  }, [entityProps])

  // 3rd (WHEN sourceNode is ready and getPlaybackTime is available): setTimeout to update playhead position at a regular interval
  useEffect(() => {
      let timeCron = setTimeout(() => {
        if (getPlaybackTime) {
          setCurrentPlayhead(getPlaybackTime() || 0)
        }
  
      }, 16);
  
      return(() => {
        clearTimeout(timeCron);
      })
  
  }, [getPlaybackTime])
  
  // WHEN TrackImageContainer Ref is available: allow mousewheel to operate on this element without scrolling page
  useEffect(() => {
    function preventWheelDefault(this: HTMLDivElement, e: WheelEvent) {
      e.preventDefault()
    }

    if (entityProps) {
      if (ref && ref.current) {
        ref!.current!.addEventListener('wheel', preventWheelDefault)
      }
    }

    return () => {
      if (entityProps && ref && ref.current) {
        ref!.current!.removeEventListener('wheel', preventWheelDefault)
      }
    }
  }, [ref])

  // HELPER FUNCTIONS
  // toggle playback
  function togglePlay() {
    if (sourceNode) {
      if (!playing) {
        startPlayback()
        setPlaying(true)
      } else {
        stopPlayback()
        setPlaying(false)
        setCurrentPlayhead(0)
      }
    }
  }
  // handle mousewheel input as gain control
  function handleGainScroll(e: React.WheelEvent<HTMLDivElement>) {
    if (gainNode) {
      console.log(e.deltaX, e.deltaY)
      if (e.deltaY > 0) {
        gainDown()
        setCurrentGain(gainNode.gain.value)
      } else if (e.deltaY < 0) {
        gainUp()
        setCurrentGain(gainNode.gain.value)
      }
    }
  }

  return (
    <TrackWrapper perRow={3}>
      <TrackImageContainer ref={ref} onWheel={handleGainScroll}>
        { sourceBuffer &&
          <TrackImageKonva 
            audioBuffer={sourceBuffer}
            sourceNode={sourceNode as AudioBufferSourceNode}
            currentPlayhead={currentPlayhead}
            width={90}
            height={90}
            gain={currentGain}
            outerMargin={5}
            innerMargin={15}
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
