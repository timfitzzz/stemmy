import { RootState } from '../store'
import { createSelector } from 'reselect'
import { OAudioEngine } from './audioContext'
import { IuseProjectsOptions } from './useProjects'
import { ProjectIOError } from '../store/projects/types'
import { ProjectProps } from '../types'

// selectors that depend only on state and should be singletons

export const tracksLoadingSelector = (state: RootState) =>
  state.tracks.loadingIds
export const tracksErrorSelector = (state: RootState) => state.tracks.errors
export const entitiesLoadingSelector = (state: RootState) => state.loops.loading
export const entitiesErrorSelector = (state: RootState) => state.loops.errors
export const sourceBuffersLoadingSelector = (state: OAudioEngine) =>
  state.buffersLoading
export const entityPlayersLoadingSelector = (state: OAudioEngine) =>
  state.playersLoading

export const selectTracks = (state: RootState) => state.tracks
export const selectProjects = (state: RootState) => state.projects
export const selectDraftProjectIds = (state: RootState) => state.projects.drafts
export const selectCreatingProjectId = (state: RootState) =>
  state.projects.creatingId

// Projects
export const selectProjectsById = createSelector(
  [selectProjects],
  projects => projects.byId
)

export const selectNothingById = createSelector(
  [selectProjectsById],
  byId => null
)

export const selectDraftProjects = createSelector(
  [selectProjectsById, selectDraftProjectIds],
  (byId, drafts) => drafts.map(id => byId[id])
)

export const projectsLoadingSelector = createSelector(
  [selectProjects],
  projects => projects.loading
)

export const projectsErrorsSelector = createSelector(
  [selectProjects],
  projects => projects.errors
)

export const projectsSavingSelector = createSelector(
  [selectProjects],
  projects => projects.saving
)

export const projectsPlayerChangesSelector = createSelector(
  [selectProjects],
  projects => projects.playerChanges
)

export const projectsEditorChangesSelector = createSelector(
  [selectProjects],
  projects => projects.unsavedEditorChanges
)

export const createDesiredProjectWithPlayerChangesSelector = (
  projectId: string | null
) =>
  createSelector(
    [selectProjectsById, projectsPlayerChangesSelector],
    (byId, playerChanges) =>
      projectId ? { ...byId[projectId], ...playerChanges[projectId] } : null
  )

export const createDesiredProjectWithEditorChangesSelector = (
  projectId: string | null
) =>
  createSelector(
    [selectProjectsById, projectsEditorChangesSelector],
    (byId, unsavedEditorChanges) =>
      projectId
        ? { ...byId[projectId], ...unsavedEditorChanges[projectId] }
        : null
  )

export const createProjectSavingSelector = (project: ProjectProps | null) =>
  createSelector([projectsSavingSelector], saving =>
    project
      ? saving.length > 0 &&
        saving.findIndex((p: ProjectProps) => p === project) > -1
        ? true
        : false
      : false
  )

export const createDesiredProjectsSelector = (
  projectIds: string[] | null,
  type: IuseProjectsOptions['type']
) => {
  if (type) {
    switch (type) {
      case 'drafts':
        return selectDraftProjects
      default:
        return selectNothingById
    }
  } else if (projectIds) {
    return createSelector([selectProjectsById], byId =>
      projectIds ? projectIds.map(id => byId[id]).filter(p => p) : null
    )
  } else {
    return selectNothingById
  }
}

export const createDesiredProjectSelector = (projectId: string | null) =>
  createSelector([selectProjectsById], byId =>
    projectId ? byId[projectId] : null
  )

export const createProjectLoadingSelector = (projectId: string | null) =>
  createSelector([projectsLoadingSelector], loading =>
    projectId ? (loading.indexOf(projectId) > -1 ? true : false) : false
  )

export const createProjectErrorSelector = (projectId: string | null) =>
  createSelector([projectsErrorsSelector], errors => {
    let projectErrors = errors
      .map(e => (e.id && e.id === projectId ? e : null))
      .filter(e => e) as ProjectIOError[]
    if (projectErrors.length > 0) {
      return projectErrors
    } else {
      return null
    }
  })

// export const createProjectErrorSelector = (projectId: string | null) =>
//   createSelector([projectsErrorSelector], errors =>
//     errors.map(e => e))
// export const createDesiredProjectsSelector = (projectIds: string[] | null) =>
//   createSelector([selectProjectsById], byId =>
//     projectIds ? projectIds.map(id => byId[id]).filter(p => p) : null
//   )

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

export const tracksPlayerChangesSelector = createSelector(
  [selectTracks],
  tracks => tracks.playerChanges
)

export const tracksEditorChangesSelector = createSelector(
  [selectTracks],
  tracks => tracks.unsavedEditorChanges
)

export const createDesiredTrackWithPlayerChangesSelector = (
  trackId: string | null
) =>
  createSelector(
    [selectTracksById, tracksPlayerChangesSelector],
    (byId, playerChanges) =>
      trackId ? { ...byId[trackId], ...playerChanges[trackId] } : null
  )

export const createDesiredTrackWithEditorChangesSelector = (
  trackId: string | null
) =>
  createSelector(
    [selectTracksById, tracksEditorChangesSelector],
    (byId, unsavedEditorChanges) =>
      trackId ? { ...byId[trackId], ...unsavedEditorChanges[trackId] } : null
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
