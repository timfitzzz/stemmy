import { LoopProps, ProjectProps } from '../../types'
import { ThunkAction } from 'redux-thunk'
import { GET_PROJECTS_PAGE } from '../../gql/queries'
import { LoopActions } from '../loops'
import { hasId, hasName } from '../'

export enum ProjectActions {
  UPSERT_PROJECT = 'UPSERT_PROJECT',
  UPSERT_PROJECTS = 'UPSERT_PROJECTS',
  LOAD_PROJECTS_PAGE = 'LOAD_PROJECTS_PAGE',
  LOADING_PROJECTS = 'LOADING_PROJECTS',
  DONE_LOADING_PROJECTS = 'DONE_LOADING_PROJECTS',
  ERROR_LOADING_PROJECTS = 'ERROR_LOADING_PROJECTS',
  UPDATE_PROJECTS_PAGE = 'UPDATE_PROJECTS_PAGE',
  CREATE_NEW_PROJECT = 'CREATE_NEW_PROJECT',
  CREATE_NEW_PROJECT_SUCCESS = 'CREATE_NEW_PROJECT_SUCCESS',
  CREATE_NEW_PROJECT_FAIL = 'CREATE_NEW_PROJECT_FAIL',
  SAVE_PROJECT = 'SAVE_PROJECT',
  SAVE_PROJECT_SUCCESS = 'SAVE_PROJECT_SUCCESS',
  SAVE_PROJECT_FAIL = 'SAVE_PROJECT_FAIL',
  GET_PROJECT = 'GET_PROJECT',
  GET_PROJECT_SUCCESS = 'GET_PROJECT_SUCCESS',
  GET_PROJECT_FAIL = 'GET_PROJECT_FAIL',
  LOAD_USER_DRAFT_PROJECTS = 'LOAD_USER_DRAFT_PROJECTS',
  LOAD_USER_DRAFT_PROJECTS_SUCCESS = 'LOAD_USER_DRAFT_PROJECTS_SUCCESS',
  LOAD_USER_DRAFT_PROJECTS_FAIL = 'LOAD_USER_DRAFT_PROJECTS_FAIL',
  CLEAR_CREATING_PROJECT_ID = 'CLEAR_CREATING_PROJECT_ID'
}

export type ProjectIOError = {
  id?: string
  message: string
}

export interface IProjectStore {
  saving: hasId[] | hasName[] | ProjectProps[] | []
  errors: ProjectIOError[] | []
  byId: {
    [key: string]: ProjectProps
  },
  drafts: string[], // each array is a page
  page: {
    loading: boolean
    pageNumber: number
    perPage: number
    currentPageIds: string[]
  }
  creatingId: null | string
}

export interface LoadingProjectsAction {
  type: ProjectActions.LOADING_PROJECTS
}

export interface DoneLoadingProjectsAction {
  type: ProjectActions.DONE_LOADING_PROJECTS
}

export interface ErrorLoadingProjectsAction {
  type: ProjectActions.ERROR_LOADING_PROJECTS
  payload: ProjectIOError
}

export interface GetProjectAction {
  type: ProjectActions.GET_PROJECT
  payload: string
}

export interface GetProjectSuccessAction {
  type: ProjectActions.GET_PROJECT_SUCCESS
  payload: ProjectProps
}

export interface GetProjectFailAction {
  type: ProjectActions.GET_PROJECT_FAIL
  payload: {
    project: ProjectProps, 
    err: ProjectIOError
  }
}

export interface UpsertProjectAction {
  type: ProjectActions.UPSERT_PROJECT
  payload: ProjectProps
}

export interface UpsertProjectsAction {
  type: ProjectActions.UPSERT_PROJECTS
  payload: ProjectProps[]
}

export interface UpdateProjectsPageAction {
  type: ProjectActions.UPDATE_PROJECTS_PAGE
  payload: { pageNumber: number; perPage: number; currentPageIds: string[] }
}

export interface CreateNewProjectAction {
  type: ProjectActions.CREATE_NEW_PROJECT
  payload: { name: string, draft: true }
}

export interface CreateNewProjectSuccessPayload {
  newProject: ProjectProps
}

export interface CreateNewProjectSuccessAction {
  type: ProjectActions.CREATE_NEW_PROJECT_SUCCESS
  payload: CreateNewProjectSuccessPayload
}

export interface CreateNewProjectFailAction {
  type: ProjectActions.CREATE_NEW_PROJECT_FAIL
  payload: { name: string, err: ProjectIOError }
}

export interface SaveProjectAction {
  type: ProjectActions.SAVE_PROJECT
  payload: ProjectProps
}

export interface SaveProjectSuccessPayload {
  beforeSave: ProjectProps
  afterSave: ProjectProps
}

export interface SaveProjectSuccessAction {
  type: ProjectActions.SAVE_PROJECT_SUCCESS
  payload: SaveProjectSuccessPayload
}

export interface SaveProjectFailAction {
  type: ProjectActions.SAVE_PROJECT_FAIL
  payload: {
    project: ProjectProps, 
    err: ProjectIOError
  }
}

export interface LoadUserDraftProjectsAction {
  type: ProjectActions.LOAD_USER_DRAFT_PROJECTS
}

export interface LoadUserDraftProjectsSuccessAction {
  type: ProjectActions.LOAD_USER_DRAFT_PROJECTS_SUCCESS
  payload: ProjectProps[]
}

export interface LoadUserDraftProjectsFailAction {
  type: ProjectActions.LOAD_USER_DRAFT_PROJECTS_FAIL
  payload: ProjectIOError
}

export interface ClearCreatingProjectIdAction {
  type: ProjectActions.CLEAR_CREATING_PROJECT_ID
}

// export interface LoadProjectsPageAction {
//   types: [
//     ProjectActions.UPSERT_PROJECTS,
//     ProjectActions.UPSERT_PROJECTS_SUCCESS,
//     ProjectActions.UPSERT_PROJECTS_FAIL
//   ]
//   type: ProjectActions.LOAD_PROJECTS_PAGE
//   query: typeof GET_PROJECTS_PAGE
//   fetchPolicy: string
//   variables: {
//     page: number
//     perPage: number
//   }
// }

export type ProjectActionTypes =
  | UpsertProjectAction
  | UpsertProjectsAction
  | LoadingProjectsAction
  | DoneLoadingProjectsAction
  | ErrorLoadingProjectsAction
  | UpdateProjectsPageAction
  | CreateNewProjectAction
  | CreateNewProjectSuccessAction
  | CreateNewProjectFailAction
  | SaveProjectAction
  | SaveProjectSuccessAction
  | SaveProjectFailAction
  | GetProjectAction
  | GetProjectSuccessAction
  | GetProjectFailAction
  | LoadUserDraftProjectsAction
  | LoadUserDraftProjectsSuccessAction
  | LoadUserDraftProjectsFailAction
  | ClearCreatingProjectIdAction

export type ProjectThunkResult<R> = ThunkAction<
  R,
  IProjectStore,
  undefined,
  ProjectActionTypes
>
