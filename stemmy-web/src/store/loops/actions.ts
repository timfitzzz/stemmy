import { LoopProps } from '../../types'
import { ILoopStore, LoopActions, LoopActionTypes } from '.'
import { RootState } from '../root-reducer'
import { ThunkAction } from 'redux-thunk'
import * as API from '../../rest'

export function upsertLoop(newLoop: LoopProps): LoopActionTypes {
  return {
    type: LoopActions.UPSERT_LOOP,
    payload: newLoop,
  }
}

export function saveLoopData(loopData: LoopProps): LoopActionTypes {
  return {
    type: LoopActions.SAVE_LOOP,
    payload: loopData,
  }
}

export function saveLoopDataFail(
  loopData: LoopProps,
  err: Error
): LoopActionTypes {
  return {
    type: LoopActions.SAVE_LOOP_FAIL,
    payload: [loopData, err],
  }
}

export function saveLoopDataSuccess(
  beforeSave: LoopProps,
  afterSave: LoopProps
): LoopActionTypes {
  return {
    type: LoopActions.SAVE_LOOP_SUCCESS,
    payload: { beforeSave, afterSave },
  }
}

export const getNewLoop = (
  loopProps: LoopProps,
  fileData: API.AudioFileData
): ThunkAction<void, RootState, unknown, LoopActionTypes> => async dispatch => {
  dispatch(saveLoopData(loopProps))

  try {
    const newLoop = await API.getNewLoopFromAudioFile(loopProps, fileData)
    console.log(newLoop)
    dispatch(saveLoopDataSuccess(loopProps, newLoop.data[0]))
  } catch (err) {
    dispatch(saveLoopDataFail(loopProps, err))
  }
}

export const updateLoop = (
  loop: LoopProps,
  fileData?: API.AudioFileData
): ThunkAction<void, RootState, unknown, LoopActionTypes> => async dispatch => {
  dispatch(saveLoopData(loop))

  try {
    const updatedLoop = await API.updateLoopInDb(loop, fileData)
    dispatch(saveLoopDataSuccess(loop, updatedLoop.data[0]))
  } catch (err) {
    dispatch(saveLoopDataFail(loop, err))
  }
}
