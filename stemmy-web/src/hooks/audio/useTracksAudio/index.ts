export * from './reducer'
export * from './types'
import { useEffect, useReducer, useState, Context, useMemo } from 'react'
import { useContextSelector } from 'react-use-context-selector'
import { Player } from 'tone'
import ContextForAudio, { OAudioEngine } from '../../../helpers/audioContext'
import { useProject } from '../../../helpers/useProject'
import {
  createDesiredEntityPlayersSelector,
  selectMakePlayerFromBuffer,
  selectGetBufferSegments,
  selectGetLongestDuration,
  selectIsPlayerLoading,
  selectQueuePlayback,
} from '../../../helpers/selectors'
import { useLoopEntities, useLoopIds, useSourceBuffers, useTracks } from '../..'
import { IuseTracksAudioModes } from './types'
import { IuseTracksAudio, OuseTracksAudio } from './types'
import { defaultUseTracksState, useTracksAudioReducer } from './reducer'
import { useEntityPlayers } from '../useEntityPlayers'

// useTracksAudio provides read-only access to individual track records
// and associated entity records, buffer, and player.

export const useTracksAudio = ({
  ids = [],
  // projectId,
  modules = [IuseTracksAudioModes.buffer],
  debug = false,
  setPlayback = false,
}: IuseTracksAudio): OuseTracksAudio => {
  // prettier-ignore
  /*----------DEBUG----------*/ debug && 
  /*----------DEBUG----------*/ ids && 
  /*----------DEBUG----------*/ console.log('useTracksAudio received these ids: ', ids)

  const [{ callbacks }, localDispatch] = useReducer(
    useTracksAudioReducer,
    defaultUseTracksState
  )

  // get project -- if projectId is null, will return null
  // const { project } = useProject({ id: projectId })

  // // prettier-ignore
  // /*----------DEBUG----------*/ debug &&
  //                                                               /*----------DEBUG----------*/ projectId &&
  //                                                               /*----------DEBUG----------*/ console.log('useTracksAudio got project', project)

  // establish trackIds
  // (if ids were passed in as props, set them from jump)
  // const [trackIds, setTrackIds] = useState<string[] | null>(ids)
  // if (!trackIds) {
  //   //< if they're not set,
  //   if (
  //     project && ///< if project is loaded,
  //     project.tracks && /// and project has tracks (it should)
  //     ids.length == 0
  //   ) {
  //     /// and ids weren't provided
  //     setTrackIds(project.tracks) ///> set ids to project.tracks
  //   } else if (!project && !ids) {
  //     ///< if there's no project, and ids weren't passed in
  //     setTrackIds([]) ///> set ids to an empty array
  //   }
  // }

  const trackIds = ids

  // get tracks
  const { tracks, errors: tracksErrors } = useTracks({
    trackIds,
    count: trackIds ? trackIds.length : null,
  })

  // prettier-ignore
  /*----------DEBUG----------*/ debug &&
                                                                /*----------DEBUG----------*/ console.log('useTracksAudio got tracks', tracks,
                                                                /*----------DEBUG----------*/ ' and encountered these problems: ', tracksErrors)

  // set loop ids:
  // useLoopIds handles memoized loop ids, making sure nothing is
  // returned until we know how many loops we should have ids for
  const loopIds: string[] | null = useLoopIds({
    tracks,
    count: trackIds ? trackIds.length : null,
  })

  // get loops aka entities (TODO: fix inconsistent modeling)
  const { entities, errors: entityErrors } = useLoopEntities({
    loopIds,
    count: trackIds ? trackIds.length : null,
  })

  // prettier-ignore
  /*----------DEBUG----------*/ debug &&
                                                                /*----------DEBUG----------*/ console.log('useTracksAudio got these entities', entities,
                                                                /*----------DEBUG----------*/ 'and encountered problems with these: ', entityErrors )

  // get sourcebuffers to confirm they're loaded
  const { sourceBuffers, errors: sourceBufferErrors } = useSourceBuffers({
    loops: entities,
    count: loopIds ? loopIds.length : null,
  })

  // prettier-ignore
  /*----------DEBUG----------*/ debug && 
                                                                /*----------DEBUG----------*/ console.log(
                                                                /*----------DEBUG----------*/ 'useTracksAudio found these sourceBuffers', sourceBuffers)

  // get entityplayers to confirm they're loaded
  const shouldGetPlayers = !!(modules.indexOf(IuseTracksAudioModes.player) > -1)

  const {
    entityPlayers,
    getVolume,
    volumeUp,
    volumeDown,
    getGain,
    ready,
  } = useEntityPlayers({
    entities,
    count: loopIds ? loopIds.length : null,
    dependencies: [shouldGetPlayers],
    setPlayback,
  })

  // prettier-ignore
  /*----------DEBUG----------*/ debug &&
  /*----------DEBUG----------*/ console.log(
  /*----------DEBUG----------*/ `noting it ${
  /*----------DEBUG----------*/ shouldGetPlayers ? 'was' : 'was not'
  /*----------DEBUG----------*/ } asked to load players, it found these: `,
  /*----------DEBUG----------*/ entityPlayers)

  // loading functions -- we'll call these conditionally during useEffect
  // along with our two dispatch calls to retrieve the track and loop
  // database records from the server.

  // utility functions
  let getBufferSegments = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectGetBufferSegments
  )

  let getLongestDuration = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectGetLongestDuration
  )

  const getAvailableEntityIds = () =>
    entities ? entities.filter(ent => ent && ent.id).map(ent => ent.id!) : null

  const getLongest = () =>
    getLongestDuration
      ? getLongestDuration(getAvailableEntityIds() || [])
      : null

  const getSegments = (
    segmentCount: number
  ): { max: number; min: number }[][] | null => {
    if (entities && entities.length > 0) {
      let longestDuration = getLongest()
      return entities
        .filter(ent => ent && ent.id)
        .map(ent =>
          getBufferSegments
            ? getBufferSegments(
                ent.id!,
                segmentCount,
                longestDuration ? longestDuration : 0
              )
            : []
        )
    } else {
      return null
    }
  }

  // if entityPlayers are fully loaded,

  // // if sourcebuffers exist, check for entityplayers
  // useEffect(() => {
  //   if (shouldGetPlayers) {
  //     if (entities && sourceBuffers) {
  //       debug && console.log('checking for entityplayers')
  //       entities.forEach((entity, i) => {
  //         if (
  //           entity &&
  //           entity.id &&
  //           (!entityPlayers || !entityPlayers[entity.id]) &&
  //           isPlayerLoading &&
  //           !isPlayerLoading(entity.id) &&
  //           makePlayerFromBuffer
  //         ) {
  //           debug &&
  //             console.log(
  //               'couldnt find player for ',
  //               entity.id,
  //               ', calling makePlayerFromBuffer'
  //             )
  //           makePlayerFromBuffer(entity.id)
  //         }
  //       })
  //     }
  //   } else {
  //     setFullyLoaded(true)
  //   }
  // }, [sourceBuffers, shouldGetPlayers])

  // // if players exist, enqueue playback if requested and mark fully loaded
  // useEffect(() => {
  //   let playerCount: number = 0
  //   if (entities && selectedEntityPlayers && selectedEntityPlayers.length > 0) {
  //     debug && console.log('checking for loaded players')
  //     console.log('entityplayers is ', entityPlayers)
  //     entities.forEach((entity, i) => {
  //       if (entity && entity.id && entityPlayers![entity.id]) {
  //         debug && console.log('found player ', entity.id)
  //         // if enqueuing playback is requested
  //         if (setPlayback && !callbacks[entity.id] && queuePlayback) {
  //           debug && console.log('enqueuing playback for player ', entity.id)
  //           localDispatch({
  //             type: 'storeCallback',
  //             entityId: entity.id,
  //             callback: queuePlayback(entity.id),
  //           })
  //         }
  //         playerCount++
  //       } else {
  //         debug && console.log('did not find player ', entity.id)
  //       }
  //     })
  //   }
  //   if (
  //     // how do we know if tracks are done with initial loading?
  //     (ids && ids.length === playerCount) || // if ids were provided, playercount matches quantity
  //     (projectId &&
  //     project &&
  //     project.tracks && // if projectId was provided, project has loaded
  //       playerCount === project.tracks.length)
  //   ) {
  //     // and playercount matches project track length
  //     debug &&
  //       console.log('all players loaded and, if asked, enqueued for playback')
  //     setFullyLoaded(true)
  //   }
  // }, [entityPlayers, setPlayback])

  // if ids change, we need to reset the hook
  // useEffect(() => {
  //   if (ids && ids != trackIds) {
  //     setTrackIds(ids)
  //   }
  // }, [ids])

  // useEffect(() => {
  //   if (project && project.tracks && project.tracks != trackIds) {
  //     setTrackIds(project.tracks)
  //   }
  // }, [project])

  return <OuseTracksAudio>{
    tracks: tracks,
    entities: entities,
    sourceBuffers,
    entityPlayers,
    fullyLoaded: ready,
    getSegments,
    getLongest,
    getVolume,
    volumeUp,
    volumeDown,
    getGain,
  }
}
