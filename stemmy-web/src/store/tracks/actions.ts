import { TrackProps } from '../../types'
import { ITrackStore, TrackActions, TrackActionTypes } from '.'
import { RootState } from '../root-reducer'
import { ThunkAction } from 'redux-thunk'
import * as API from '../../rest'

export function upsertTrack(newTrack: TrackProps): TrackActionTypes {
  return {
    type: TrackActions.UPSERT_TRACK,
    payload: newTrack,
  }
}

export const getTrack = (
  trackId: string
): ThunkAction<
  void,
  RootState,
  unknown,
  TrackActionTypes
> => async dispatch => {
  dispatch({
    type: TrackActions.GET_TRACK,
    payload: trackId
  })
  try {
    const { data: trackBundleResult }: API.AxiosTrackBundleResponse = await API.getTrackBundleFromDb(
      trackId
    )
    dispatch(upsertTrack(trackBundleResult.track))
    dispatch(getTrackSuccess(trackBundleResult.track))
  } catch (err) {
    dispatch(getTrackFail(trackId, err))
  }
}

export function getTrackSuccess(track: TrackProps): TrackActionTypes {
  return {
    type: TrackActions.GET_TRACK_SUCCESS,
    payload: track
  }
}

export function getTrackFail(trackId: string, err: Error): TrackActionTypes {
  return {
    type: TrackActions.GET_TRACK_FAIL,
    payload: {
      trackId,
      err
    }
  }
}

export const setTrackSaving = (track: TrackProps): TrackActionTypes => {
  return {
    type: TrackActions.SAVE_TRACK,
    payload: track,
  }
}

export const createNewTrack = (track: TrackProps): TrackActionTypes => {
  return {
    type: TrackActions.CREATE_NEW_TRACK,
    payload: track,
  }
}

export const createNewTrackSuccess = (
  beforeSave: TrackProps,
  afterSave: TrackProps
) => {
  return {
    type: TrackActions.CREATE_NEW_TRACK_SUCCESS,
    payload: { beforeSave, afterSave },
  }
}

export const createNewTrackFail = (track: TrackProps, err: Error) => {
  return {
    type: TrackActions.CREATE_NEW_TRACK_FAIL,
    payload: [track, err],
  }
}

export const saveTrackSuccess = (
  beforeSave: TrackProps,
  afterSave: TrackProps
): TrackActionTypes => {
  return {
    type: TrackActions.SAVE_TRACK_SUCCESS,
    payload: {
      beforeSave,
      afterSave,
    },
  }
}

export const saveTrackFail = (
  track: TrackProps,
  err: Error
): TrackActionTypes => {
  return {
    type: TrackActions.SAVE_TRACK_FAIL,
    payload: [track, err],
  }
}

export const saveTrack = (
  track: TrackProps
): ThunkAction<
  void,
  RootState,
  unknown,
  TrackActionTypes
> => async dispatch => {
  dispatch(setTrackSaving(track))
  try {
    const { data: trackSaveResult }: API.AxiosTrackResponse = await API.saveTrackToDb(
      track
    )
    dispatch(upsertTrack(trackSaveResult))
    dispatch(saveTrackSuccess(track, trackSaveResult))
  } catch (err) {
    dispatch(saveTrackFail(track, err))
  }
}
