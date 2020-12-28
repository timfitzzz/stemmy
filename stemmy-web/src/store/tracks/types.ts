import { TrackProps } from '../../types'

export enum TrackActions {
  UPSERT_TRACK = 'UPSERT_TRACK',
  SAVE_TRACK = 'SAVE_TRACK',
  SAVE_TRACK_SUCCESS = 'SAVE_TRACK_SUCCESS',
  SAVE_TRACK_FAIL = 'SAVE_TRACK_FAIL',
  CREATE_NEW_TRACK = 'CREATE_NEW_TRACK',
  CREATE_NEW_TRACK_SUCCESS = 'CREATE_NEW_TRACK_SUCCESS',
  CREATE_NEW_TRACK_FAIL = 'CREATE_NEW_TRACK_FAIL',
  GET_TRACK = 'GET_TRACK',
  GET_TRACK_SUCCESS = 'GET_TRACK_SUCCESS',
  GET_TRACK_FAIL = 'GET_TRACK_FAIL',
  MODIFY_TRACK_PLAYER = 'MODIFY_TRACK_PLAYER',
  MODIFY_TRACK_EDITOR = 'MODIFY_TRACK_EDITOR',
  RESET_TRACK_PLAYER = 'RESET_TRACK_PLAYER',
}

export type TrackIOError = {
  id?: string
  message: string
  timestamp: Date
}

export interface ITrackStore {
  saving: TrackProps[]
  errors: TrackIOError[] | []
  byId: {
    [key: string]: TrackProps
  }
  loadingIds: string[]
  playerChanges: {
    [key: string]: Partial<TrackProps>
  }
  unsavedEditorChanges: {
    [key: string]: Partial<TrackProps>
  }
}

export interface ModifyTrackPlayerAction {
  type: TrackActions.MODIFY_TRACK_PLAYER
  payload: {
    id: string
    changes: Partial<TrackProps>
  }
}

export interface ResetTrackPlayerAction {
  type: TrackActions.RESET_TRACK_PLAYER
  payload: { id: string }
}

export interface ModifyTrackEditorAction {
  type: TrackActions.MODIFY_TRACK_EDITOR
  payload: {
    id: string
    changes: Partial<TrackProps>
  }
}

export interface UpsertTrackAction {
  type: TrackActions.UPSERT_TRACK
  payload: TrackProps
}

export interface GetTrackAction {
  type: TrackActions.GET_TRACK
  payload: string
}

export interface GetTrackSuccessAction {
  type: TrackActions.GET_TRACK_SUCCESS
  payload: TrackProps
}

export interface GetTrackFailAction {
  type: TrackActions.GET_TRACK_FAIL
  payload: {
    trackId: string
    err: Error
  }
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
  | GetTrackAction
  | GetTrackSuccessAction
  | GetTrackFailAction
  | ModifyTrackEditorAction
  | ModifyTrackPlayerAction
  | ResetTrackPlayerAction
