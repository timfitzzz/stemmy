import { LoopProps } from '../../types'

export enum LoopActions {
  UPSERT_LOOP = 'UPSERT_LOOP',
  SAVE_LOOP = 'SAVE_LOOP',
  SAVE_LOOP_FAIL = 'SAVE_LOOP_FAIL',
  SAVE_LOOP_SUCCESS = 'SAVE_LOOP_SUCCESS',
  GET_LOOP = 'GET_LOOP',
  GET_LOOP_FAIL = 'GET_LOOP_FAIL',
  GET_LOOP_SUCCESS = 'GET_LOOP_SUCCESS',
}

export type APIError = {
  timestamp: Date
  error: string
  oid: string
}

export interface ILoopStore {
  saving: Partial<LoopProps>[]
  errors: APIError[] | []
  byId: {
    [key: string]: LoopProps
  }
  loading: string[]
}

export interface UpsertLoopAction {
  type: LoopActions.UPSERT_LOOP
  payload: LoopProps
}

export interface GetLoopAction {
  type: LoopActions.GET_LOOP
  payload: string
}

export interface GetLoopSuccessAction {
  type: LoopActions.GET_LOOP_SUCCESS
  payload: LoopProps
}

export interface GetLoopFailAction {
  type: LoopActions.GET_LOOP_FAIL
  payload: [Partial<LoopProps>, APIError]
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
  payload: [LoopProps, APIError]
}

export type LoopActionTypes =
  | UpsertLoopAction
  | SaveLoopAction
  | SaveLoopFailAction
  | SaveLoopSuccessAction
  | GetLoopAction
  | GetLoopFailAction
  | GetLoopSuccessAction
