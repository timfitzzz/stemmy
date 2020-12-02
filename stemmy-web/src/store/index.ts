import { fromPromise } from '@apollo/client'
import { rootReducer, RootDispatcher } from './root-reducer'
export { RootDispatcher } from './root-reducer'
import { applyMiddleware, compose, createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware from 'redux-thunk'
import { TrackActions } from './tracks'
import { ProjectActions } from './projects'
import { LoopActions } from './loops'

export { RootState } from './root-reducer'
export { ReduxProvider } from './provider'

export const store = configureStore({
  reducer: rootReducer,
})

export function removeDocFromSaving<T>(savingState: T[], document: T) {
  let docIndex = savingState.findIndex(value => value === document)
  return savingState.slice(0, docIndex).concat(savingState.slice(docIndex + 1))
}

export interface hasName {
  name?: string
}

export interface hasId {
  id?: string
}

export function removeDocFromSavingById(savingState: hasId[], document: hasId) {
  let docIndex = savingState.findIndex(value => value.id === document.id)
  return savingState.slice(0, docIndex).concat(savingState.slice(docIndex + 1))
}

export function removeDocFromSavingByName(
  savingState: hasName[],
  document: hasName
) {
  let docIndex = savingState.findIndex(value => value.name === document.name)
  return savingState.slice(0, docIndex).concat(savingState.slice(docIndex + 1))
}

export type AppDispatch = typeof store.dispatch
