import { ProjectProps } from '../../types'
import { IProjectStore, ProjectActions, ProjectActionTypes } from '.'
import { ProjectThunkResult } from './types'
import { RootState } from '..'

import { GET_PROJECTS_PAGE } from '../../gql/queries'
import * as API from '../../rest'

import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

export function upsertProject(newProject: ProjectProps): ProjectActionTypes {
  return {
    type: ProjectActions.UPSERT_PROJECT,
    payload: newProject,
  }
}

export function upsertProjects(projects: ProjectProps[]): ProjectActionTypes {
  return {
    type: ProjectActions.UPSERT_PROJECTS,
    payload: projects,
  }
}

export function getProject(projectId: string) {
  return {
    type: ProjectActions.GET_PROJECT,
    payload: projectId,
  }
}

export function getProjectSuccess(project: ProjectProps) {
  return {
    type: ProjectActions.GET_PROJECT_SUCCESS,
    payload: project,
  }
}

export function getProjectFail(project: Partial<ProjectProps>, err: Error) {
  return {
    type: ProjectActions.GET_PROJECT_FAIL,
    payload: {
      project, 
      err: { id: project.id, message: err.toString() }
    }
  }
}

export function loadProjects(): ProjectActionTypes {
  return {
    type: ProjectActions.LOADING_PROJECTS,
  }
}

export function doneLoadingProjects(): ProjectActionTypes {
  return {
    type: ProjectActions.DONE_LOADING_PROJECTS,
  }
}

export function errorLoadingProjects(err: Error): ProjectActionTypes {
  return {
    type: ProjectActions.ERROR_LOADING_PROJECTS,
    payload: { message: err.toString() },
  }
}

export function createProjectSuccess(
  newProject: ProjectProps
): ProjectActionTypes {
  return {
    type: ProjectActions.CREATE_NEW_PROJECT_SUCCESS,
    payload: { newProject },
  }
}

export function clearCreatingProjectId(): ProjectActionTypes {
  return {
    type: ProjectActions.CLEAR_CREATING_PROJECT_ID
  }
}

export function errorCreatingProject(
  name: string,
  err: Error
): ProjectActionTypes {
  return {
    type: ProjectActions.CREATE_NEW_PROJECT_FAIL,
    payload: { 
      name, 
      err: { 
        id: name, 
        message: err.toString() 
      }
    },
  }
}

export function setCurrentPage(
  page: number,
  perPage: number,
  ids: string[]
): ProjectActionTypes {
  return {
    type: ProjectActions.UPDATE_PROJECTS_PAGE,
    payload: { pageNumber: page, perPage, currentPageIds: ids },
  }
}

export function saveProject(project: ProjectProps): ProjectActionTypes {
  return {
    type: ProjectActions.SAVE_PROJECT,
    payload: project,
  }
}

export function saveProjectSuccess(
  beforeSave: ProjectProps,
  afterSave: ProjectProps
): ProjectActionTypes {
  return {
    type: ProjectActions.SAVE_PROJECT_SUCCESS,
    payload: { beforeSave, afterSave },
  }
}

export function saveProjectFail(
  project: ProjectProps,
  err: Error
): ProjectActionTypes {
  return {
    type: ProjectActions.SAVE_PROJECT_FAIL,
    payload: {
      project: project, 
      err: { id: project.id, message: err.toString() }
    }
  }
}

export const loadUserDraftProjects = (): ThunkAction<
  void,
  RootState,
  unknown,
  ProjectActionTypes
> => async dispatch => {
  dispatch ({
    type: ProjectActions.LOAD_USER_DRAFT_PROJECTS
  })
  try {
    const userDrafts = await API.getDraftProjects()
    dispatch(loadUserDraftProjectsSuccess(userDrafts.data))
  } catch(err) {
    dispatch(loadUserDraftProjectsFail(err))
  }
}

export function loadUserDraftProjectsSuccess(drafts: ProjectProps[]): ProjectActionTypes {
  return {
    type: ProjectActions.LOAD_USER_DRAFT_PROJECTS_SUCCESS,
    payload: drafts
  }
}

export function loadUserDraftProjectsFail(err: Error): ProjectActionTypes {
  return {
    type: ProjectActions.LOAD_USER_DRAFT_PROJECTS_FAIL,
    payload: { message: err.toString() }
  }
}

export const loadProjectsPage = (
  page: number,
  perPage: number
): ThunkAction<
  void,
  RootState,
  unknown,
  ProjectActionTypes
> => async dispatch => {
  dispatch(loadProjects())
  try {
    const projectsPage = await API.getProjectsPage(page, perPage)
    const projectPageIds: string[] = projectsPage.data
      .map(project => project.id)
      .filter(
        projectId => !(projectId === undefined || projectId === null)
      ) as string[]
    dispatch(setCurrentPage(page, perPage, projectPageIds))
    dispatch(upsertProjects(projectsPage.data))
    dispatch(doneLoadingProjects())
  } catch (err) {
    dispatch(errorLoadingProjects(err.message))
  }
}

export const createNewProject = ({
  name,
}: {
  name: string
}): ThunkAction<
  void,
  RootState,
  unknown,
  ProjectActionTypes
> => async dispatch => {
  dispatch({
    type: ProjectActions.CREATE_NEW_PROJECT,
    payload: { name, draft: true },
  })
  try {
    const newProject = await API.getNewProject({ name, draft: true })
    dispatch(createProjectSuccess(newProject.data))
  } catch (err) {
    dispatch(errorCreatingProject(name, err.message))
  }
}

export const saveProjectToServer = (
  project: ProjectProps
): ThunkAction<
  void,
  RootState,
  unknown,
  ProjectActionTypes
> => async dispatch => {
  dispatch({
    type: ProjectActions.SAVE_PROJECT,
    payload: project,
  })

  try {
    const updatedProject = await API.updateProjectInDb(project)
    dispatch(saveProjectSuccess(project, updatedProject.data))
  } catch (err) {
    dispatch(saveProjectFail(project, err))
  }
}
