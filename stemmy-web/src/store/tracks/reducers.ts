import { TrackProps } from '../../types'
import { ITrackStore, TrackActionTypes, TrackActions } from '.'

const initialState: ITrackStore = {
  saving: [],
  errors: [],
  byId: {},
  loadingIds: [],
  playerChanges: {},
  unsavedEditorChanges: {},
}

export function tracksReducer(
  state = initialState,
  action: TrackActionTypes
): ITrackStore {
  function getNewSavingWithoutTrack(track: TrackProps) {
    let savingTrackIndex = state.saving.indexOf(track)
    return state.saving
      .slice(0, savingTrackIndex)
      .concat(state.saving.slice(savingTrackIndex + 1))
  }

  switch (action.type) {
    case TrackActions.UPSERT_TRACK:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id!]: action.payload },
      }
    case TrackActions.GET_TRACK:
      return {
        ...state,
        loadingIds: [...state.loadingIds, action.payload],
      }
    case TrackActions.GET_TRACK_SUCCESS:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id!]: action.payload },
        loadingIds: [...state.loadingIds.filter(id => id != action.payload.id)],
      }
    case TrackActions.GET_TRACK_FAIL:
      return {
        ...state,
        loadingIds: [
          ...state.loadingIds.filter(id => id != action.payload.trackId),
        ],
        errors: [
          {
            id: action.payload.trackId,
            message: action.payload.err.toString(),
            timestamp: new Date(),
          },
          ...state.errors,
        ],
      }
    case TrackActions.SAVE_TRACK:
      if (state.saving.indexOf(action.payload) > -1) {
        return state
      } else {
        return { ...state, saving: [...state.saving, action.payload] }
      }
    case TrackActions.SAVE_TRACK_FAIL:
      return {
        ...state,
        saving: getNewSavingWithoutTrack(action.payload[0]),
        errors: [
          {
            id: action.payload[0].id,
            message: action.payload[1].toString(),
            timestamp: new Date(),
          },
          ...state.errors,
        ],
      }
    case TrackActions.SAVE_TRACK_SUCCESS:
      let {
        [action.payload.afterSave.id!]: discardSave,
        ...otherEditorChangeEntries
      } = state.unsavedEditorChanges
      return {
        ...state,
        saving: getNewSavingWithoutTrack(action.payload.beforeSave),
        byId: {
          ...state.byId,
          [action.payload.afterSave.id!]: action.payload.afterSave,
        },
        unsavedEditorChanges: {
          ...otherEditorChangeEntries,
        },
      }
    case TrackActions.CREATE_NEW_TRACK:
      return {
        ...state,
        saving: [...state.saving, action.payload],
      }
    case TrackActions.CREATE_NEW_TRACK_SUCCESS:
      return {
        ...state,
        saving: getNewSavingWithoutTrack(action.payload.beforeSave),
        byId: {
          ...state.byId,
          [action.payload.afterSave.id!]: action.payload.afterSave,
        },
      }
    case TrackActions.CREATE_NEW_TRACK_FAIL:
      return {
        ...state,
        saving: getNewSavingWithoutTrack(action.payload[0]),
        errors: [
          {
            id: action.payload[0].id || 'none',
            message: action.payload[1].toString(),
            timestamp: new Date(),
          },
          ...state.errors,
        ],
      }
    case TrackActions.MODIFY_TRACK_EDITOR:
      return {
        ...state,
        unsavedEditorChanges: {
          ...state.unsavedEditorChanges,
          [action.payload.id]: {
            ...state.unsavedEditorChanges[action.payload.id],
            ...action.payload.changes,
          },
        },
      }
    case TrackActions.MODIFY_TRACK_PLAYER:
      return {
        ...state,
        playerChanges: {
          ...state.playerChanges,
          [action.payload.id]: {
            ...state.playerChanges[action.payload.id],
            ...action.payload.changes,
          },
        },
      }
    case TrackActions.RESET_TRACK_PLAYER:
      let {
        [action.payload.id]: discardPlayerChanges,
        ...otherPlayerChanges
      } = state.playerChanges
      return {
        ...state,
        playerChanges: {
          ...otherPlayerChanges,
        },
      }
    default:
      return state
  }
}
