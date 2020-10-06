import { LoopProps } from '../../types'
import { ILoopStore, LoopActionTypes, LoopActions } from '.'

const initialState: ILoopStore = {
  saving: [],
  errors: [],
  byId: {},
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
        errors: [
          { timestamp: new Date(), error: action.payload[1] },
          ...state.errors,
        ],
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
    default:
      return state
  }
}
