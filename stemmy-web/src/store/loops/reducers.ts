import { LoopProps } from '../../types'
import { ILoopStore, LoopActionTypes, LoopActions } from '.'

const initialState: ILoopStore = {
  saving: [],
  errors: [],
  byId: {},
  loading: [],
}

function remStr(array: string[], string: string): string[] {
  let index = array.indexOf(string)
  return array.slice(0, index).concat(array.slice(index + 1))
}

export function loopsReducer(
  state = initialState,
  action: LoopActionTypes
): ILoopStore {
  function getNewSavingWithoutLoop(loop: LoopProps) {
    let savingLoopIndex = state.saving.indexOf(loop)
    return state.saving
      .slice(0, savingLoopIndex)
      .concat(state.saving.slice(savingLoopIndex + 1))
  }

  switch (action.type) {
    case LoopActions.UPSERT_LOOP:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id!]: action.payload },
      }
    case LoopActions.SAVE_LOOP:
      if (state.saving.indexOf(action.payload) > -1) {
        return state
      } else {
        return { ...state, saving: [...state.saving, action.payload] }
      }
    case LoopActions.SAVE_LOOP_FAIL:
      return {
        ...state,
        saving: getNewSavingWithoutLoop(action.payload[0]),
        errors: [action.payload[1], ...state.errors],
      }
    case LoopActions.SAVE_LOOP_SUCCESS:
      return {
        ...state,
        saving: getNewSavingWithoutLoop(action.payload.beforeSave),
        byId: {
          ...state.byId,
          [action.payload.afterSave.id!]: action.payload.afterSave,
        },
      }
    case LoopActions.GET_LOOP: {
      return {
        ...state,
        loading: [...state.loading, action.payload],
      }
    }
    case LoopActions.GET_LOOP_FAIL: {
      return {
        ...state,
        loading: remStr(state.loading, action.payload[0].id!),
        errors: [action.payload[1], ...state.errors],
      }
    }
    case LoopActions.GET_LOOP_SUCCESS: {
      return {
        ...state,
        loading: remStr(state.loading, action.payload.id!),
        byId: {
          ...state.byId,
          [action.payload.id!]: action.payload,
        },
      }
    }
    default:
      return state
  }
}
