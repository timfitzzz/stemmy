import {
  TrackProps,
  LoopProps,
  audioEntityTypes,
  AudioEntitySources,
} from '../types'
import { ITrackStore, TrackActions, TrackActionTypes } from './tracks'
import { ILoopStore, LoopActions, LoopActionTypes } from './loops'
import { RootState } from './root-reducer'
import * as API from '../rest'
import { ThunkAction } from 'redux-thunk'
import {
  getNewLoop,
  saveLoopData,
  saveLoopDataFail,
  saveLoopDataSuccess,
} from './loops/actions'
import {
  createNewTrack,
  createNewTrackFail,
  createNewTrackSuccess,
} from './tracks/actions'
import {
  getProject,
  getProjectFail,
  getProjectSuccess,
} from './projects/actions'

export const addTrackAndEntityFromAudioFile = (
  fileData: API.AudioFileData,
  projectId: string,
  audioEntityType: audioEntityTypes,
  source: AudioEntitySources,
  loopData: LoopProps = {},
  trackData: TrackProps = {}
): ThunkAction<void, RootState, unknown, any> => async dispatch => {
  let failed = false
  let newLoop: LoopProps = {}
  let trackProps: TrackProps = {}
  let loopProps: LoopProps = {
    ...loopData,
    source,
    originalProjectId: projectId,
  }

  dispatch(saveLoopData(loopProps))

  try {
    newLoop = (await API.getNewLoopFromAudioFile(loopProps, fileData)).data[0]
    // console.log(newLoop)
    dispatch(saveLoopDataSuccess(loopProps, newLoop))
  } catch (err) {
    dispatch(saveLoopDataFail(loopProps, err))
    failed = true
  }

  if (!failed) {
    trackProps = {
      ...trackData,
      projectId,
      entityType: audioEntityType,
      entityId: newLoop.id,
    }

    dispatch(createNewTrack(trackProps))

    try {
      const newTrack = await API.getNewTrack(trackProps)
      dispatch(createNewTrackSuccess(trackProps, newTrack.data))
    } catch (err) {
      dispatch(createNewTrackFail(trackProps, err))
      failed = true
    }
  }

  if (!failed) {
    dispatch(getProject(projectId))
    try {
      const updatedProject = await API.getProjectById(projectId)
      dispatch(getProjectSuccess(updatedProject.data))
    } catch (err) {
      dispatch(getProjectFail({ id: projectId }, err))
    }
  }
}
