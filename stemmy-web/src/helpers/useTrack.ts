import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTrack } from '../store/tracks/actions'
import { RootState } from '../store'
import { LoopProps, TrackProps } from '../types'
import { getLoop } from '../store/loops/actions'
import { useEntityPlayer } from './useEntityPlayer'
import { getLoopAudioUrlById } from '../rest'
import Tone from 'tone'

interface IuseTrackOptions {
  id: string  // id of the track 
  player: boolean // return player for track?
}

interface OuseTrack {
  track: TrackProps | null
  entity: LoopProps | null
  player: {
    entityPlayer: Tone.Player | null
    sourceBuffer: Tone.ToneAudioBuffer | null
    getPlaybackLocation: () => number | null
    getPlaybackTime: () => number | null
    setVolume: (volume: number) => void | null
    getVolume: () => number | null
    getGain: () => number | null
    volumeUp: () => void | null
    volumeDown: () => void | null
    toggleReverse: () => void | null
  }
}

const useTrack = ({id, player}: IuseTrackOptions): OuseTrack => {

  const [trackLoading, setTrackLoading] = useState<boolean>(false)
  const [entityLoading, setEntityLoading] = useState<boolean>(false)

  console.log('rendering useTrack')

  const dispatch = useDispatch();

  const track: TrackProps | null = useSelector<RootState, TrackProps | null>(state => {
    return state.tracks.byId[id]
  })


  // GET entityProps from Redux store (if available)
  const entity: LoopProps | null = useSelector<
    RootState,
    LoopProps | null
  >(state => {
    if (track && track.entityId && state.loops.byId[track.entityId]) {
      return state.loops.byId[track.entityId]
    } else {
      return null
    }
  })
  
  console.log(id)
  console.log(track)
  console.log(entity)

  const {
    entityPlayer,
    sourceBuffer,
    getPlaybackLocation,
    getPlaybackTime,
    setVolume,
    getVolume,
    getGain,
    toggleReverse,
    volumeUp,
    volumeDown,
  } = useEntityPlayer(
        entity && entity.id ? getLoopAudioUrlById(entity.id!) : '', 
        [player], 
        entity ? entity.id : undefined,
        true
  )

  console.log('entityPlayer: ', entityPlayer);

  useEffect(() => {
    console.log('running useTrack useEffect')
    if (!track && !trackLoading) {
      // if track isn't in state, load the track from the server
      dispatch(getTrack(id))
      setTrackLoading(true)
    } 
    else if (track && track.entityId && !entity && !entityLoading) {
      // if the entity (Loop, for now) isn't in state, load it from the server
      setTrackLoading(false)
      dispatch(getLoop(track.entityId))
      setEntityLoading(true)
    }
  }, [track])

  useEffect(() => {
    if (track && entity) {
      setEntityLoading(false)
    }
  }, [entity])

  return {
    track,
    entity,
    player: {
      entityPlayer: entityPlayer || null,
      sourceBuffer: sourceBuffer || null,
      getPlaybackLocation: getPlaybackLocation || null,
      getPlaybackTime: getPlaybackTime || null,
      setVolume: setVolume || null,
      getVolume: getVolume || null,
      getGain: getGain || null,
      volumeUp: volumeUp || null,
      volumeDown: volumeDown || null,
      toggleReverse: toggleReverse || null,
    }
  }

}

export default useTrack