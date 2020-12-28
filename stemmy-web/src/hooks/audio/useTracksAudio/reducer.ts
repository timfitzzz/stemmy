import { useTracksAudioState, useTracksReducerActions } from './types'

export const defaultUseTracksState = {
  callbacks: {},
}

export function useTracksAudioReducer(
  state: useTracksAudioState,
  action: useTracksReducerActions
) {
  switch (action.type) {
    case 'storeCallback':
      return {
        ...state,
        callbacks: {
          ...state.callbacks,
          [action.entityId]: action.callback,
        },
      }
    case 'clearCallback':
      let { [action.entityId]: omit, ...otherCbs } = state.callbacks
      return {
        ...state,
        callbacks: {
          ...otherCbs,
        },
      }
    default:
      return state
  }
}
