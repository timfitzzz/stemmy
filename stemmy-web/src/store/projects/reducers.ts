import { ProjectProps } from '../../types'
import { IProjectStore, ProjectActionTypes, ProjectActions } from '.'
import {
  removeDocFromSavingByName,
  removeDocFromSavingById,
  hasName,
  hasId,
} from '../'


const initialState: IProjectStore = {
  saving: [],
  drafts: [],
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
      // when we create a new (draft) project, we don't have an id yet.
      // store the blank project with just the name so that we can
      // keep track of its creation process and then remove it once it's done.
      return {
        ...state,
        saving: [...state.saving as hasName[], action.payload],
      }
    case ProjectActions.CREATE_NEW_PROJECT_SUCCESS:
      return {
        ...state,
        saving: removeDocFromSavingByName(state.saving as hasName[], {
          name: action.payload.newProject.name
        }),
        byId: {
          ...state.byId,
          [action.payload.newProject.id!]: action.payload.newProject,
        },
        drafts: [
          ...state.drafts,
          action.payload.newProject.id!
        ],
        creatingId: action.payload.newProject.id!
      }
    case ProjectActions.CREATE_NEW_PROJECT_FAIL:
      return {
        ...state,
        saving: removeDocFromSavingByName(state.saving as hasName[], {
          name: action.payload.err.id, // using undetermined id prop to carry name to keep simpler
        }),
        errors: [action.payload.err, ...state.errors],
      }
    case ProjectActions.CLEAR_CREATING_PROJECT_ID:
      return {
        ...state,
        creatingId: null
      }
    case ProjectActions.SAVE_PROJECT:
      // once a project has already been created,
      // we have an id for it. so here when we store it in the
      // saving array, it will have an id that it can be addressed via.
      return {
        ...state,
        saving: [...state.saving, action.payload],
        byId: { ...state.byId, [action.payload.id!]: action.payload },
      }
    case ProjectActions.SAVE_PROJECT_SUCCESS:
      return {
        ...state,
        saving: removeDocFromSavingById( // has an id for sure
          state.saving as hasId[],
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
        saving: removeDocFromSavingById(state.saving as hasId[], action.payload.err),
        byId: { ...state.byId, [action.payload.project.id!]: action.payload.project },
        errors: [action.payload.err, ...state.errors],
      }
    case ProjectActions.GET_PROJECT_SUCCESS:
      return {
        ...state,
        byId: { ...state.byId, [action.payload.id!]: action.payload },
        drafts: action.payload.draft ? [ ...state.drafts, action.payload.id!] : state.drafts
      }
    case ProjectActions.GET_PROJECT_FAIL:
      return {
        ...state,
        errors: [ action.payload.err, ...state.errors ],
      }
    case ProjectActions.LOAD_USER_DRAFT_PROJECTS_SUCCESS:
      
      let newProjects: { [key: string]: ProjectProps } = {}
      
      action.payload.forEach((project) => {
        newProjects[project.id!] = project
      })

      let draftProjectIds = 
        action.payload.map(project => project.id)
          .filter(
            projectId => !(projectId === undefined || projectId === null)
          ) as string[]

      return {
        ...state,
        drafts: draftProjectIds,
        byId: { ...state.byId, ...newProjects }
      }
    default:
      return state
  }
}
