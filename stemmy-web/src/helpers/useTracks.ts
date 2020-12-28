// import {
//   useContext,
//   useEffect,
//   useReducer,
//   useState,
//   Context,
//   useMemo,
// } from 'react'
// import { shallowEqual, useDispatch, useSelector } from 'react-redux'
// import { useContextSelector } from 'react-use-context-selector'
// import { createSelector, createStructuredSelector } from 'reselect'
// import { getLoop } from '../store/loops/actions'
// import { getTrack } from '../store/tracks/actions'
// import { Player, ToneAudioBuffer } from 'tone'
// import { RootState } from '../store'
// import { LoopProps, TrackProps } from '../types'
// import ContextForAudio, { OAudioEngine } from './audioContext'
// import { useProject } from './useProject'
// import {
//   tracksLoadingSelector,
//   entitiesLoadingSelector,
//   createDesiredEntitiesSelector,
//   createDesiredTracksSelector,
//   createDesiredSourceBuffersSelector,
//   createDesiredEntityPlayersSelector,
//   selectLoadBufferFromId,
//   selectMakePlayerFromBuffer,
//   selectGetBufferSegments,
//   selectGetLongestDuration,
//   selectIsBufferLoading,
//   selectIsPlayerLoading,
//   selectQueuePlayback,
// } from './selectors'
// import { useLoopEntities, useLoopIds, useSourceBuffers } from '../hooks'

// export enum IuseTracksModes {
//   buffer = 'buffer',
//   player = 'player',
//   display = 'display',
//   setPlayback = 'setPlayback',
// }

// interface IuseTracks {
//   ids?: string[]
//   projectId?: string
//   modules?: IuseTracksModes[]
//   debug?: boolean
//   setPlayback?: boolean
// }

// interface OuseTracks {
//   tracks: TrackProps[] | undefined
//   entities: LoopProps[] | undefined
//   fullyLoaded: boolean
//   getSegments: (segmentCount: number) => { max: number; min: number }[][] | null
//   getLongest: () => number
// }

// interface useTracksState {
//   callbacks: {
//     [key: string]: () => void
//   }
//   // sourceBuffers: {
//   //   [key: string]: () => void
//   // },
//   // entityPlayers: {
//   //   [key: string]: () => void
//   // },
//   // loadingBuffers: string[]
// }

// const defaultUseTracksState = {
//   // trackIds: [],
//   // entityIds: [],
//   callbacks: {},
//   // sourceBuffers: {},
//   // entityPlayers: {}
// }

// type ReducerActions =
//   // | { type: 'loadingSourceBuffer', entityId: string }
//   // | { type: 'loadedSourceBuffer', entityId: string }
//   // | { type: 'loadedEntity', entityId: string, entity: LoopProps }
//   | { type: 'storeCallback'; entityId: string; callback: () => void }
//   | { type: 'clearCallback'; entityId: string }

// function useTracksReducer(state: useTracksState, action: ReducerActions) {
//   switch (action.type) {
//     case 'storeCallback':
//       return {
//         ...state,
//         callbacks: {
//           ...state.callbacks,
//           [action.entityId]: action.callback,
//         },
//       }
//     case 'clearCallback':
//       let { [action.entityId]: omit, ...otherCbs } = state.callbacks
//       return {
//         ...state,
//         callbacks: {
//           ...otherCbs,
//         },
//       }
//     default:
//       return state
//   }
// }

// // useTracks provides read-only access to individual track records
// // and associated entity records, buffer, and player.

// const useTracks = ({
//   ids = [],
//   projectId,
//   modules = [IuseTracksModes.buffer],
//   debug = false,
//   setPlayback = false,
// }: IuseTracks) => {
//   debug && ids && console.log('useTracks received these ids: ', ids)
//   const [fullyLoaded, setFullyLoaded] = useState(false)
//   const [{ callbacks }, localDispatch] = useReducer(
//     useTracksReducer,
//     defaultUseTracksState
//   )

//   const dispatch = useDispatch()

//   // get project -- if projectId is null, will return null
//   const { project } = useProject({ id: projectId })

//   // prettier-ignore
//   /*----------DEBUG----------*/ debug &&
//   /*----------DEBUG----------*/ projectId &&
//   /*----------DEBUG----------*/ console.log('useTracks got project', project)

//   // establish trackIds
//   // (if ids were passed in as props, set them from jump)
//   const [trackIds, setTrackIds] = useState<string[] | null>(ids)
//   if (!trackIds) {
//     //< if they're not set,
//     if (
//       project && ///< if project is loaded,
//       project.tracks && /// and project has tracks (it should)
//       ids.length == 0
//     ) {
//       /// and ids weren't provided
//       setTrackIds(project.tracks) ///> set ids to project.tracks
//     } else if (!project && !ids) {
//       ///< if there's no project, and ids weren't passed in
//       setTrackIds([]) ///> set ids to an empty array
//     }
//   }

//   // get tracks
//   const tracksSelector = useMemo(() => createDesiredTracksSelector(trackIds), [
//     trackIds,
//   ])
//   const tracks: TrackProps[] | null = useSelector(tracksSelector)
//   const tracksLoading: string[] = useSelector(tracksLoadingSelector)

//   // prettier-ignore
//   /*----------DEBUG----------*/ debug &&
//   /*----------DEBUG----------*/ console.log('useTracks got tracks', tracks,
//   /*----------DEBUG----------*/ ' and found loading tracks: ', tracksLoading)

//   // set loop ids:
//   // useLoopIds handles memoized loop ids, making sure nothing is
//   // returned until we know how many loops we should have ids for
//   const loopIds: string[] | null = useLoopIds({
//     tracks,
//     count: trackIds ? trackIds.length : null,
//   })

//   // get loops aka entities (TODO: fix inconsistent modeling)
//   // const loopSelector = useMemo(() => createDesiredEntitiesSelector(loopIds), [
//   //   loopIds,
//   // ])
//   // const entities: LoopProps[] | null = useSelector(loopSelector)
//   // let entitiesLoading: string[] = useSelector(entitiesLoadingSelector)

//   const { entities, errors: entityErrors } = useLoopEntities({
//     loopIds,
//     count: trackIds ? trackIds.length : null,
//   })

//   // prettier-ignore
//   /*----------DEBUG----------*/ debug &&
//   /*----------DEBUG----------*/ console.log('useTracks got these entities', entities,
//   /*----------DEBUG----------*/ 'and encountered problems with these: ', entityErrors )

//   // get sourcebuffers to confirm they're loaded
//   // const sourceBuffersSelector = useMemo(
//   //   () => createDesiredSourceBuffersSelector(loopIds),
//   //   [loopIds]
//   // )
//   // const selectedSourceBuffers:
//   //   | { id: string; sourceBuffer: ToneAudioBuffer }[]
//   //   | null = useContextSelector(
//   //   ContextForAudio as Context<OAudioEngine>,
//   //   sourceBuffersSelector
//   // )

//   // const sourceBuffers = useMemo(() => {
//   //   return selectedSourceBuffers
//   //     ? Object.assign(
//   //         {},
//   //         ...selectedSourceBuffers.map(sb => ({ [sb.id]: sb.sourceBuffer }))
//   //       )
//   //     : []
//   // }, [selectedSourceBuffers])

//   const sourceBuffers = useSourceBuffers({
//     loops: entities,
//     count: loopIds ? loopIds.length : null,
//   })

//   // prettier-ignore
//   /*----------DEBUG----------*/ debug &&
//   /*----------DEBUG----------*/ console.log(
//   /*----------DEBUG----------*/ 'useTracks found these sourceBuffers',
//   /*----------DEBUG----------*/ sourceBuffers)

//   // get entityplayers to confirm they're loaded
//   const entityPlayersSelector = useMemo(
//     () => createDesiredEntityPlayersSelector(loopIds),
//     [loopIds]
//   )
//   const selectedEntityPlayers:
//     | { id: string; entityPlayer: Player }[]
//     | null = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     entityPlayersSelector
//   )

//   const entityPlayers: { [key: string]: Player } = useMemo(() => {
//     return selectedEntityPlayers
//       ? Object.assign(
//           {},
//           ...selectedEntityPlayers.map(ep => ({ [ep.id]: ep.entityPlayer }))
//         )
//       : []
//   }, [selectedEntityPlayers])

//   const shouldGetPlayers = !!(modules.indexOf(IuseTracksModes.player) > -1)

//   debug &&
//     console.log(
//       `noting it ${
//         shouldGetPlayers ? 'was' : 'was not'
//       } asked to load players, it found these: `,
//       entityPlayers
//     )

//   // loading functions -- we'll call these conditionally during useEffect
//   // along with our two dispatch calls to retrieve the track and loop
//   // database records from the server.
//   let loadBufferFromId = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectLoadBufferFromId
//   )

//   let makePlayerFromBuffer = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectMakePlayerFromBuffer
//   )

//   // utility functions
//   let getBufferSegments = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectGetBufferSegments
//   )

//   // let getSourceBuffer = useContextSelector(
//   //   ContextForAudio as Context<OAudioEngine>,
//   //   selectGetSourceBuffer
//   // )

//   // let getEntityPlayer = useContextSelector(
//   //   ContextForAudio as Context<OAudioEngine>,
//   //   selectGetEntityPlayer
//   // )

//   let getLongestDuration = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectGetLongestDuration
//   )

//   let isBufferLoading = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectIsBufferLoading
//   )

//   let isPlayerLoading = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectIsPlayerLoading
//   )

//   let queuePlayback = useContextSelector(
//     ContextForAudio as Context<OAudioEngine>,
//     selectQueuePlayback
//   )

//   const getAvailableEntityIds = () =>
//     entities ? entities.filter(ent => ent && ent.id).map(ent => ent.id!) : null

//   const getLongest = () =>
//     getLongestDuration
//       ? getLongestDuration(getAvailableEntityIds() || [])
//       : null

//   const isTrackLoading = (id: string) => {
//     return !(tracksLoading.indexOf(id) === -1)
//   }

//   // const isEntityLoading = (id: string) => {
//   //   return !(entitiesLoading.indexOf(id) === -1)
//   // }

//   const getSegments = (
//     segmentCount: number
//   ): { max: number; min: number }[][] | null => {
//     if (entities && entities.length > 0) {
//       let longestDuration = getLongest()
//       return entities
//         .filter(ent => ent && ent.id)
//         .map(ent =>
//           getBufferSegments
//             ? getBufferSegments(
//                 ent.id!,
//                 segmentCount,
//                 longestDuration ? longestDuration : 0
//               )
//             : []
//         )
//     } else {
//       return null
//     }
//   }
//   //

//   // load tracks if needed - project version
//   useEffect(() => {
//     if (project && project.tracks) {
//       debug && console.log('checking for tracks', project.tracks)
//       project.tracks.forEach(trackId => {
//         // if there's no tracks, there's no track with this id, and this track isn't loading
//         if (
//           (!tracks || tracks!.filter(t => t.id === trackId).length === 0) &&
//           !isTrackLoading(trackId)
//         ) {
//           debug &&
//             console.log(
//               'could not find track ',
//               trackId,
//               ', dispatching getTrack'
//             )
//           dispatch(getTrack(trackId))
//         }
//       })
//     }
//     return () => {} // there's no cleanup needed here, we'll keep the stuff in context
//   }, [project]) // run when project changes (which is after useProject hook re-renders page)

//   useEffect(() => {
//     if (trackIds) {
//       debug && console.log('checking for tracks', trackIds)
//       trackIds.forEach(id => {
//         if (
//           (!tracks || tracks!.filter(t => t.id === id).length === 0) &&
//           !isTrackLoading(id)
//         ) {
//           debug &&
//             console.log('could not find track ', id, ', dispatching getTrack')
//           dispatch(getTrack(id))
//         } else {
//           debug &&
//             console.log(
//               'found track ',
//               id,
//               tracks!.filter(t => t.id === id)
//             )
//         }
//       })
//     }
//   }, [trackIds])

//   // // load audioentity (loop) records if needed
//   // useEffect(() => {
//   //   if (tracks && tracks.length > 0) {
//   //     debug && console.log('checking for audioentities', trackIds)
//   //     tracks.forEach(track => {
//   //       if (track && track.entityId) {
//   //         // if there's no entities, there's no entity with the desired id, and the entity is not already loading
//   //         if (
//   //           !entities ||
//   //           (entities &&
//   //             entities.filter(e => e.id === track.entityId).length === 0 &&
//   //             !isEntityLoading(track.entityId))
//   //         ) {
//   //           debug &&
//   //             console.log(
//   //               'could not find entity ',
//   //               track.entityId,
//   //               'dispatching getLoop'
//   //             )
//   //           dispatch(getLoop(track.entityId))
//   //         } else {
//   //           debug &&
//   //             console.log(
//   //               'found entity ',
//   //               track.entityId,
//   //               entities.filter(e => e.id === track.entityId)
//   //             )
//   //         }
//   //       }
//   //     })
//   //   }
//   // }, [tracks]) // run when tracks change

//   // // if loops exist, check for sourcebuffers
//   // useEffect(() => {
//   //   if (entities && entities.length > 0) {
//   //     debug && console.log('checking for sourcebuffers')
//   //     entities.forEach((entity, i) => {
//   //       // if there's no sourcebuffer with the id and the entity is not already loading
//   //       if (
//   //         entity &&
//   //         entity.id &&
//   //         (!sourceBuffers || !sourceBuffers[entity.id]) &&
//   //         isBufferLoading &&
//   //         !isBufferLoading(entity.id) &&
//   //         loadBufferFromId
//   //       ) {
//   //         debug &&
//   //           console.log(
//   //             'could not find sourcebuffer for ',
//   //             entity.id,
//   //             'using loadBufferFromId'
//   //           )
//   //         loadBufferFromId(entity.id)
//   //       } else {
//   //         debug &&
//   //           console.log(
//   //             'found buffer for entity id ',
//   //             entity.id,
//   //             entity.id && [sourceBuffers[entity.id]]
//   //           )
//   //       }
//   //     })
//   //   }
//   // }, [entities]) // run when entities change

//   // if sourcebuffers exist, check for entityplayers
//   useEffect(() => {
//     if (shouldGetPlayers) {
//       if (entities && sourceBuffers) {
//         debug && console.log('checking for entityplayers')
//         entities.forEach((entity, i) => {
//           if (
//             entity &&
//             entity.id &&
//             (!entityPlayers || !entityPlayers[entity.id]) &&
//             isPlayerLoading &&
//             !isPlayerLoading(entity.id) &&
//             makePlayerFromBuffer
//           ) {
//             debug &&
//               console.log(
//                 'couldnt find player for ',
//                 entity.id,
//                 ', calling makePlayerFromBuffer'
//               )
//             makePlayerFromBuffer(entity.id)
//           }
//         })
//       }
//     } else {
//       setFullyLoaded(true)
//     }
//   }, [sourceBuffers, shouldGetPlayers])

//   // if players exist, enqueue playback if requested and mark fully loaded
//   useEffect(() => {
//     let playerCount: number = 0
//     if (entities && selectedEntityPlayers && selectedEntityPlayers.length > 0) {
//       debug && console.log('checking for loaded players')
//       console.log('entityplayers is ', entityPlayers)
//       entities.forEach((entity, i) => {
//         if (entity && entity.id && entityPlayers![entity.id]) {
//           debug && console.log('found player ', entity.id)
//           // if enqueuing playback is requested
//           if (setPlayback && !callbacks[entity.id] && queuePlayback) {
//             debug && console.log('enqueuing playback for player ', entity.id)
//             localDispatch({
//               type: 'storeCallback',
//               entityId: entity.id,
//               callback: queuePlayback(entity.id),
//             })
//           }
//           playerCount++
//         } else {
//           debug && console.log('did not find player ', entity.id)
//         }
//       })
//     }
//     if (
//       // how do we know if tracks are done with initial loading?
//       (ids && ids.length === playerCount) || // if ids were provided, playercount matches quantity
//       (projectId &&
//       project &&
//       project.tracks && // if projectId was provided, project has loaded
//         playerCount === project.tracks.length)
//     ) {
//       // and playercount matches project track length
//       debug &&
//         console.log('all players loaded and, if asked, enqueued for playback')
//       setFullyLoaded(true)
//     }
//   }, [entityPlayers, setPlayback])

//   // if ids change, we need to reset the hook
//   useEffect(() => {
//     if (ids && ids != trackIds) {
//       setTrackIds(ids)
//       setFullyLoaded(false)
//     }
//   }, [ids])

//   useEffect(() => {
//     if (project && project.tracks && project.tracks != trackIds) {
//       setTrackIds(project.tracks)
//       setFullyLoaded(false)
//     }
//   }, [project])

//   return <OuseTracks>{
//     tracks: tracks,
//     entities: entities,
//     entityPlayers,
//     fullyLoaded,
//     getSegments,
//     getLongest,
//   }
// }

// export default useTracks
