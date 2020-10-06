import { TrackProps } from '../../types'

export enum TrackActions {
  UPSERT_TRACK = 'UPSERT_TRACK',
  SAVE_TRACK = 'SAVE_TRACK',
  SAVE_TRACK_SUCCESS = 'SAVE_TRACK_SUCCESS',
  SAVE_TRACK_FAIL = 'SAVE_TRACK_FAIL',
  CREATE_NEW_TRACK = 'CREATE_NEW_TRACK',
  CREATE_NEW_TRACK_SUCCESS = 'CREATE_NEW_TRACK_SUCCESS',
  CREATE_NEW_TRACK_FAIL = 'CREATE_NEW_TRACK_FAIL',
}

export interface ITrackStore {
  saving: TrackProps[]
  errors: Error[] | []
  byId: {
    [key: string]: TrackProps
  }
}

export interface UpsertTrackAction {
  type: TrackActions.UPSERT_TRACK
  payload: TrackProps
}

export interface SaveTrackAction {
  type: TrackActions.SAVE_TRACK
  payload: TrackProps
}

export interface SaveTrackSuccessPayload {
  beforeSave: TrackProps
  afterSave: TrackProps
}

export interface SaveTrackSuccessAction {
  type: TrackActions.SAVE_TRACK_SUCCESS
  payload: SaveTrackSuccessPayload
}

export interface SaveTrackFailAction {
  type: TrackActions.SAVE_TRACK_FAIL
  payload: [TrackProps, Error]
}

export interface CreateNewTrackAction {
  type: TrackActions.CREATE_NEW_TRACK
  payload: TrackProps
}

export interface CreateNewTrackSuccessPayload {
  beforeSave: TrackProps
  afterSave: TrackProps
}

export interface CreateNewTrackSuccessAction {
  type: TrackActions.CREATE_NEW_TRACK_SUCCESS
  payload: CreateNewTrackSuccessPayload
}

export interface CreateNewTrackFailAction {
  type: TrackActions.CREATE_NEW_TRACK_FAIL
  payload: [TrackProps, Error]
}

export type TrackActionTypes =
  | UpsertTrackAction
  | SaveTrackAction
  | SaveTrackSuccessAction
  | SaveTrackFailAction
  | CreateNewTrackAction
  | CreateNewTrackSuccessAction
  | CreateNewTrackFailAction
