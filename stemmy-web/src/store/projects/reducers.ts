import { ProjectProps } from '../../types'
import { IProjectStore, ProjectActionTypes, ProjectActions } from '.'
import {
  removeDocFromSaving,
  removeDocFromSavingByName,
  removeDocFromSavingById,
} from '../'

const initialState: IProjectStore = {
  saving: [],
  errors: [],
  byId: {},
  page: {
    loading: false,
    pageNumber: 1,
    perPage: 20,
    currentPageIds: [],
  },
  creatingId: null,
}

function arrayToObject(projects: ProjectProps[]) {
  let output: { [key: string]: ProjectProps } = {}
  projects.forEach(project => (output[project.id || 0] = project))
  return output
}

export function projectsReducer(
  state = initialState,
  action: ProjectActionTypes
): IProjectStore {
  switch (action.type) {
    case ProjectActions.UPSERT_PROJECT:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id!]: action.payload },
      }
    case ProjectActions.UPSERT_PROJECTS:
      return {
        ...state,
        byId: { ...state.byId, ...arrayToObject(action.payload) },
      }
    case ProjectActions.LOADING_PROJECTS:
      return {
        ...state,
        page: { ...state.page, loading: true },
      }
    case ProjectActions.DONE_LOADING_PROJECTS:
      return {
        ...state,
        page: { ...state.page, loading: false },
      }
    case ProjectActions.ERROR_LOADING_PROJECTS:
      return {
        ...state,
        page: { ...state.page, loading: false },
        errors: [action.payload, ...state.errors],
      }
    case ProjectActions.UPDATE_PROJECTS_PAGE:
      return {
        ...state,
        page: { ...state.page, ...action.payload },
      }
    case ProjectActions.CREATE_NEW_PROJECT:
      return {
        ...state,
        saving: [...state.saving, action.payload],
      }
    case ProjectActions.CREATE_NEW_PROJECT_SUCCESS:
      console.log(
        removeDocFromSavingByName(state.saving, {
          name: action.payload.name,
        })
      )
      return {
        ...state,
        saving: removeDocFromSavingByName(state.saving, {
          name: action.payload.name,
        }),
        byId: {
          ...state.byId,
          [action.payload.newProject.id!]: action.payload.newProject,
        },
        creatingId: action.payload.newProject.id!,
      }
    case ProjectActions.CREATE_NEW_PROJECT_FAIL:
      return {
        ...state,
        saving: removeDocFromSavingByName(state.saving, {
          name: action.payload[0],
        }),
        errors: [action.payload[1], ...state.errors],
      }
    case ProjectActions.SAVE_PROJECT:
      return {
        ...state,
        saving: [...state.saving, action.payload],
        byId: { ...state.byId, [action.payload.id!]: action.payload },
      }
    case ProjectActions.SAVE_PROJECT_SUCCESS:
      return {
        ...state,
        saving: removeDocFromSavingById(
          state.saving,
          action.payload.beforeSave
        ),
        byId: {
          ...state.byId,
          [action.payload.afterSave.id!]: action.payload.afterSave,
        },
      }
    case ProjectActions.SAVE_PROJECT_FAIL:
      return {
        ...state,
        saving: removeDocFromSavingById(state.saving, action.payload[0]),
        byId: { ...state.byId, [action.payload[0].id!]: action.payload[0] },
        errors: [action.payload[1], ...state.errors],
      }
    case ProjectActions.GET_PROJECT_SUCCESS:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id!]: action.payload },
      }
    case ProjectActions.GET_PROJECT_FAIL:
      return {
        ...state,
        errors: [action.payload[1], ...state.errors],
      }
    default:
      return state
  }
}
