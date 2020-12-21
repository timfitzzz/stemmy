import { RootState } from '../store'
import { createSelector } from 'reselect'
import { OAudioEngine } from './audioContext'

// selectors that depend only on state and should be singletons
export const tracksLoadingSelector = (state: RootState) =>
  state.tracks.loadingIds
export const entitiesLoadingSelector = (state: RootState) => state.loops.loading
export const sourceBuffersLoadingSelector = (state: OAudioEngine) =>
  state.buffersLoading
export const selectTracks = (state: RootState) => state.tracks

// Tracks
export const selectTracksById = createSelector(
  [selectTracks],
  tracks => tracks.byId
)
export const createDesiredTrackSelector = (trackId: string | null) =>
  createSelector([selectTracksById], byId => (trackId ? byId[trackId] : null))
export const createDesiredTracksSelector = (trackIds: string[] | null) =>
  createSelector([selectTracksById], byId =>
    trackIds ? trackIds.map(id => byId[id]).filter(e => e) : null
  )
export const createTrackLoadingSelector = (trackId: string | null) =>
  createSelector([tracksLoadingSelector], tracksLoading =>
    trackId ? !(tracksLoading.indexOf(trackId) === -1) : false
  )

// entity selector
export const selectEntities = (state: RootState) => state.loops
export const selectEntitiesById = createSelector(
  [selectEntities],
  entities => entities.byId
)
export const createDesiredEntitySelector = (entityId: string | null) =>
  createSelector([selectEntitiesById], byId =>
    entityId ? byId[entityId] : null
  )
export const createDesiredEntitiesSelector = (entityIds: string[] | null) =>
  createSelector([selectEntitiesById], byId =>
    entityIds ? entityIds.map(id => byId[id]).filter(e => e) : null
  )
export const createEntityLoadingSelector = (entityId: string | null) =>
  createSelector([entitiesLoadingSelector], entitiesLoading =>
    entityId ? !(entitiesLoading.indexOf(entityId) === -1) : false
  )

// sourcebuffers selector
export const selectSourceBuffers = (state: OAudioEngine) =>
  state.entitySourceBuffers
export const createDesiredSourceBufferSelector = (entityId: string | null) =>
  createSelector([selectSourceBuffers], sourceBuffers =>
    entityId ? sourceBuffers[entityId] : null
  )

export const createDesiredSourceBuffersSelector = (
  entityIds: string[] | null
) =>
  createSelector([selectSourceBuffers], sourceBuffers =>
    entityIds
      ? entityIds
          .map(id => ({ id, sourceBuffer: sourceBuffers[id] }))
          .filter(e => e.sourceBuffer)
      : null
  )
export const createSourceBufferLoadingSelector = (entityId: string | null) =>
  createSelector([sourceBuffersLoadingSelector], sbsLoading =>
    entityId ? !(sbsLoading.indexOf(entityId) === -1) : false
  )

// entityplayers selector
export const selectEntityPlayers = (state: OAudioEngine) => state.entityPlayers
export const createDesiredEntityPlayerSelector = (entityId: string | null) =>
  createSelector([selectEntityPlayers], entityPlayers =>
    entityId ? entityPlayers[entityId] : null
  )

export const createDesiredEntityPlayersSelector = (
  entityIds: string[] | null
) =>
  createSelector([selectEntityPlayers], entityPlayers =>
    entityIds
      ? entityIds
          .map(id => ({ id, entityPlayer: entityPlayers[id] }))
          .filter(e => e.entityPlayer)
      : null
  )

// audioContext selectors
export const selectLoadBufferFromId = (state: OAudioEngine) =>
  state.loadBufferFromId ? state.loadBufferFromId : null
export const selectMakePlayerFromBuffer = (state: OAudioEngine) =>
  state.makePlayerFromBuffer ? state.makePlayerFromBuffer : null
export const selectGetBufferSegments = (state: OAudioEngine) =>
  state.getBufferSegments ? state.getBufferSegments : null
export const selectGetLongestDuration = (state: OAudioEngine) =>
  state.getLongestDuration ? state.getLongestDuration : null
export const selectIsBufferLoading = (state: OAudioEngine) =>
  state.isBufferLoading ? state.isBufferLoading : null
export const selectIsPlayerLoading = (state: OAudioEngine) =>
  state.isPlayerLoading ? state.isPlayerLoading : null
export const selectQueuePlayback = (state: OAudioEngine) =>
  state.queuePlayback ? state.queuePlayback : null
// export const selectGetSourceBuffer = (state: OAudioEngine) =>
//   state.getSourceBuffer ? state.getSourceBuffer : null
// export const selectGetEntityPlayer = (state: OAudioEngine) =>
//   state.getEntityPlayer ? state.getEntityPlayer : null
export const selectDispatch = (state: OAudioEngine) =>
  state.dispatch ? state.dispatch : null
export const selectIsAudioReady = (state: OAudioEngine) =>
  state.isAudioReady ? state.isAudioReady : null
export const selectLoadBufferFromURL = (state: OAudioEngine) =>
  state.loadBufferFromURL ? state.loadBufferFromURL : null
