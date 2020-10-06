import { LoopProps } from '../../types'

export enum LoopActions {
  UPSERT_LOOP = 'UPSERT_LOOP',
  SAVE_LOOP = 'SAVE_LOOP',
  SAVE_LOOP_FAIL = 'SAVE_LOOP_FAIL',
  SAVE_LOOP_SUCCESS = 'SAVE_LOOP_SUCCESS'
}

export type APIError = {
  timestamp: Date
  error: Error
}

export interface ILoopStore {
  saving: LoopProps[]
  errors: APIError[] | []
  byId: {
    [key: string]: LoopProps
  }
}

export interface UpsertLoopAction {
  type: LoopActions.UPSERT_LOOP
  payload: LoopProps
}

export interface SaveLoopAction {
  type: LoopActions.SAVE_LOOP
  payload: LoopProps
}

export interface SaveLoopSuccessPayload {
  beforeSave: LoopProps
  afterSave: LoopProps
}

export interface SaveLoopSuccessAction {
  type: LoopActions.SAVE_LOOP_SUCCESS
  payload: SaveLoopSuccessPayload
}

export interface SaveLoopFailAction {
  type: LoopActions.SAVE_LOOP_FAIL
  payload: [LoopProps, Error]
}

export type LoopActionTypes =
  | UpsertLoopAction
  | SaveLoopAction
  | SaveLoopFailAction
  | SaveLoopSuccessAction
