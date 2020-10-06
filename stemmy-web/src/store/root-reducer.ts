import { Dispatch } from 'react'
import { combineReducers } from 'redux'

import { tracksReducer } from './tracks'
import { projectsReducer } from './projects'
import { loopsReducer } from './loops'

import { LoopProps } from '../types'

export const rootReducer = combineReducers({
  tracks: tracksReducer,
  loops: loopsReducer,
  projects: projectsReducer,
})
export type RootState = ReturnType<typeof rootReducer>

// Reducer<InitialState, DispatchAction> = (
//   state = initialState,
//   action
// ) => {
//   if (action.type == ActionType.AddTracks) {
//     let tracks: ITrackStore = action.payload.tracks || {}
//     return { ...state!, tracks: { ...state!.tracks, ...tracks } }
//   } else {
//     return state
//   }
// }
export interface DispatchAction {
  payload: any
}

export class RootDispatcher {
  constructor(private readonly dispatch: Dispatch<DispatchAction>) {
    this.dispatch = dispatch
  }
}
