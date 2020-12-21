import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTrack, saveTrack, upsertTrack } from '../store/tracks/actions'
import { RootState } from '../store'
import { LoopProps, TrackProps } from '../types'
import { getLoop, updateLoop, upsertLoop } from '../store/loops/actions'
import { useEntityPlayer } from './useEntityPlayer'
import { getLoopAudioUrlById } from '../rest'
import Tone from 'tone'
import {
  createDesiredEntitySelector,
  createDesiredTrackSelector,
  createEntityLoadingSelector,
  createTrackLoadingSelector,
} from './selectors'

interface IuseTrackOptions {
  id: string // id of the track
  player: boolean // return player for track?
  editor: boolean // allow editing of track?
}

interface OuseTrack {
  track: TrackProps | null
  entity: LoopProps | null
  trackCopy: TrackProps | null
  entityCopy: LoopProps | null
  setTrackCopy: ((track: Partial<TrackProps>) => void) | null
  setEntityCopy: ((entity: Partial<LoopProps>) => void) | null
  commitCopies: (() => void) | null
  getSegments: (segmentCount: number) => { min: number; max: number }[] | null

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

interface useTrackState {
  trackLoading: boolean
  entityLoading: boolean
  trackLoaded: boolean
  entityLoaded: boolean
  trackCopy: Partial<TrackProps> | null
  entityCopy: Partial<LoopProps> | null
}

type ReducerActions =
  | { type: 'loadingTrack' }
  | { type: 'loadedTrack' }
  | { type: 'loadingEntity' }
  | { type: 'loadedEntity' }
  | { type: 'initTrackCopy'; track: Partial<TrackProps> }
  | { type: 'initEntityCopy'; entity: Partial<LoopProps> }
  | {
      type: 'initCopies'
      entity: Partial<LoopProps>
      track: Partial<TrackProps>
    }
  | { type: 'setTrackCopy'; track: Partial<TrackProps> }
  | { type: 'setEntityCopy'; entity: Partial<LoopProps> }

function useTrackReducer(state: useTrackState, action: ReducerActions) {
  switch (action.type) {
    case 'loadingTrack':
      return {
        ...state,
        trackLoading: true,
      }
    case 'loadedTrack':
      return {
        ...state,
        trackLoaded: true,
        trackLoading: false,
      }
    case 'loadingEntity':
      return {
        ...state,
        entityLoading: true,
      }
    case 'loadedEntity':
      return {
        ...state,
        entityLoaded: true,
        entityLoading: false,
      }
    case 'initTrackCopy':
      return {
        ...state,
        trackCopy: action.track,
      }
    case 'initEntityCopy':
      return {
        ...state,
        entityCopy: action.entity,
      }
    case 'initCopies':
      return {
        ...state,
        entityCopy: action.entity,
        trackCopy: action.track,
      }
    case 'setTrackCopy':
      return {
        ...state,
        trackCopy: {
          ...state.trackCopy,
          ...action.track,
        },
      }
    case 'setEntityCopy':
      return {
        ...state,
        entityCopy: {
          ...state.entityCopy,
          ...action.entity,
        },
      }
    default:
      return state
  }
}

const defaultUseTrackState = {
  trackLoaded: false,
  trackLoading: false,
  entityLoaded: false,
  entityLoading: false,
  trackCopy: null,
  entityCopy: null,
}

const useTrack = ({ id, player, editor }: IuseTrackOptions): OuseTrack => {
  const [
    { trackLoaded, entityLoaded, trackCopy, entityCopy },
    useTrackDispatch,
  ] = useReducer(useTrackReducer, defaultUseTrackState)

  const dispatch = useDispatch()

  // get track props from redux store
  const trackSelector = useMemo(() => createDesiredTrackSelector(id), [id])
  const trackLoadingSelector = useMemo(() => createTrackLoadingSelector(id), [
    id,
  ])
  const track: TrackProps | null = useSelector(trackSelector)
  const trackLoading: boolean = useSelector(trackLoadingSelector)

  // GET entityProps from Redux store (if available)
  const entitySelector = useMemo(
    () => createDesiredEntitySelector((track && track.entityId) || null),
    [track]
  )
  const entityLoadingSelector = useMemo(
    () => createEntityLoadingSelector((track && track.entityId) || null),
    [track]
  )

  const entity: LoopProps | null = useSelector(entitySelector)
  const entityLoading: boolean = useSelector(entityLoadingSelector)

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
    getSegments,
  } = useEntityPlayer(
    entity && entity.id ? getLoopAudioUrlById(entity.id!) : '',
    [player],
    entity ? entity.id : undefined,
    true
  )

  useEffect(() => {
    if (!track && !trackLoading) {
      // if track isn't in state, load the track from the server
      dispatch(getTrack(id))
    } else if (track && track.entityId && !entity && !entityLoading) {
      // if the entity (Loop, for now) isn't in state, load it from the server
      dispatch(getLoop(track.entityId))
    }
  }, [track])

  useEffect(() => {
    if (track && entity && entityCopy === null && trackCopy === null) {
      useTrackDispatch({ type: 'initCopies', entity, track })
    }
  }, [entity, track])

  const commitCopies = editor
    ? function() {
        if (trackCopy && entityCopy) {
          upsertTrack(trackCopy)
          upsertLoop(entityCopy)
          saveTrack(trackCopy)
          updateLoop(entityCopy)
        }
      }
    : null

  const setTrackCopy = editor
    ? function(track: Partial<TrackProps>) {
        useTrackDispatch({ type: 'setTrackCopy', track: track })
      }
    : null

  const setEntityCopy = editor
    ? function(entity: Partial<LoopProps>) {
        useTrackDispatch({ type: 'setEntityCopy', entity: entity })
      }
    : null

  return {
    track,
    entity,
    trackCopy,
    entityCopy,
    setTrackCopy,
    setEntityCopy,
    commitCopies,
    getSegments,
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
    },
  }
}

useTrack.whyDidYouRender = true
export default useTrack
