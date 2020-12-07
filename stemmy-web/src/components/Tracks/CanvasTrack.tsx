import Axios from 'axios';
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { LoopProps } from '../../types'
import { TrackProps } from '../../types'
import styled from 'styled-components'
import { ITrackProps, TrackImage, TrackVolumeDisplay, TrackPauseButton, TrackPlayButton, TrackImageContainer, TrackWrapper } from './Track'
import { useSourceNode } from '../../helpers'
import { getLoop } from '../../store/loops/actions'

export const REST_URI = process.env.GATSBY_REST_URI

export const Track = ({ trackId, editing, perRow }: ITrackProps) => {
  let [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null)
  let [loadingAudio, setLoadingAudio] = useState<boolean>(false)
  let [readyToPlay, setReady] = useState<boolean>(false)
  let [playing, setPlaying] = useState<boolean>(false)
  let ref = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()

  const trackProps: TrackProps = useSelector<RootState, TrackProps>(state => {
    return state.tracks.byId[trackId]
  })

  let { entityType, entityId } = trackProps

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

  const {
    sourceNode,
    gainNode,
    startPlayback,
    stopPlayback,
    gainUp,
    gainDown,
  } = useSourceNode(arrayBuffer, [arrayBuffer, !loadingAudio], entityId)

  // get props for the track's associated entity
  useEffect(() => {
    if (entityId && !entityProps) {
      // console.log('getting loop')
      dispatch(getLoop(entityId))
    }
  })

  // get audio for the track's associated entity
  useEffect(() => {
    if (entityProps && !arrayBuffer && !loadingAudio) {
      // console.log('loading audio')
      setLoadingAudio(true)
      Axios.get<ArrayBuffer>(`${REST_URI}/loops/audio/${entityId}`, {
        responseType: 'arraybuffer',
      }).then(res => {
        // console.log(res)
        setArrayBuffer(res.data)
        // console.log('setting array buffer: ', res.data)
        setLoadingAudio(false)
      })
    }

    return () => {}
  })

  // allow mousewheel to operate on this element without scrolling page
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
  })

  function togglePlay() {
    if (sourceNode) {
      if (!playing) {
        startPlayback()
        setPlaying(true)
      } else {
        stopPlayback()
        setPlaying(false)
      }
    }
  }

  function handleGainScroll(e: React.WheelEvent<HTMLDivElement>) {
    // console.log(gainNode)
    if (gainNode) {
      // console.log(e.deltaX, e.deltaY)
      if (e.deltaY > 0) {
        gainDown()
      } else if (e.deltaY < 0) {
        gainUp()
      }
    }
  }

  return (
    <TrackWrapper perRow={3}>
      <TrackImageContainer ref={ref} onWheel={handleGainScroll}>
        <TrackImage
          src={`${process.env.GATSBY_PNGS_URI}/${entityType}/${entityId}/0`}
        />
        <TrackVolumeDisplay />
        {playing ? (
          <TrackPauseButton onClick={togglePlay} />
        ) : (
          <TrackPlayButton onClick={togglePlay} />
        )}
      </TrackImageContainer>
    </TrackWrapper>
  )
}


export const TrackCanvas = ({}) => {
  return (
    
  )
}