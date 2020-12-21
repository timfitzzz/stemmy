import {
  Reducer,
  ReducerAction,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import verbalId from 'verbal-id'

import { AudioEntitySources, audioEntityTypes, ProjectProps } from '../types'
import {
  createNewProject,
  saveProjectToServer,
  upsertProject,
} from '../store/projects/actions'
import { clearCreatingProjectId } from '../store/projects/actions'
import { getProject } from '../store/projects/actions'
import { ProjectIOError } from '../store/projects/types'
import { addTrackAndEntityFromAudioFile } from '../store/crossoverActions'
import { AudioFileData } from '../rest'

interface IgetProjectOptions {
  id?: string
}

interface OgetProject {
  project: Partial<ProjectProps> | null
  error?: string
  saving: boolean
  copy: Partial<ProjectProps> | null
  commitCopy: () => void
  // saveProject: (project: ProjectProps) => void
  // upsertProject: (project: ProjectProps) => void
  addTrackFromFile: (fileData: AudioFileData) => void
  getSetter: <T>(prop: string) => (value: T) => void
  getClockSetter: <T>(prop: string) => (value: T) => void
}

interface useProjectState {
  projectId: string | null
  error: string | null
  copy: Partial<ProjectProps> | null
}

type ReducerActions =
  | { type: 'setProjectId'; id: string }
  | { type: 'setError'; err: string }
  | { type: 'setCopy'; project: ProjectProps }

function useProjectReducer(state: useProjectState, action: ReducerActions) {
  switch (action.type) {
    case 'setProjectId':
      return {
        ...state,
        projectId: action.id,
      }
    case 'setError':
      return {
        ...state,
        error: action.err,
      }
    case 'setCopy':
      return {
        ...state,
        copy: action.project,
      }
    default:
      return state
  }
}

export const useProject = ({ id }: IgetProjectOptions = {}) => {
  // useProject interface:
  // - if a blank object is passed, a new project will be created, stored as a draft, and
  //   returned.
  // - if an object is passed:
  //   - id: string -- will return the project with the following id
  //   - props: string[] -- a list of property names from the project to return
  //     - (default: the full project as locally stored)

  const dispatch = useDispatch()

  const [{ projectId, error, copy }, localDispatch] = useReducer(
    useProjectReducer,
    {
      projectId: id || null,
      error: null,
      copy: null,
    }
  )

  const project: Partial<ProjectProps> | null = useSelector<
    RootState,
    ProjectProps | null
  >(state => (projectId ? state.projects.byId[projectId] : null))

  //   // if a a projectId is set and it exists in state,
  //   // we'll return it.
  //   if (projectId && state.projects.byId[projectId]) {
  //     // console.log('running useSelector with projectId ', projectId, ' state.projects.byId[projectId] ', state.projects.byId[projectId], ' and passed in id ', id);
  //     // .. though we'll filter it first if asked.
  //     if (props && props.length > 0) {
  //       let validProps = props.filter(prop => state.projects.byId[projectId][prop])
  //       if (validProps.length > 0) {
  //         return Object.assign({}, ...validProps.map(
  //           prop => ({
  //             [prop]: state.projects.byId[projectId][prop]
  //           })
  //         ))
  //       } else {
  //         return null
  //       }
  //     // if not asked to filter, here's the object from store.
  //     } else {
  //       return state.projects.byId[projectId]
  //     }
  //   // or if there's no project id, or there's no project in the store
  //   // by the given id, those are jobs for useEffect to handle, which it will know
  //   // because we are returning null.
  //   } else {
  //     return null
  //   }
  // })

  const creatingProjectId: string | null = useSelector<
    RootState,
    string | null
  >(state => state.projects.creatingId)

  // if the current most recent error belongs to this project,
  // capture it and return it
  const fetchError: ProjectIOError | null = useSelector<
    RootState,
    ProjectIOError | null
  >(state => {
    if (state.projects.errors[0] && state.projects.errors[0].id === projectId) {
      return state.projects.errors[0]
    } else {
      return null
    }
  })

  const saving: boolean = useSelector<RootState, boolean>(state => {
    if (project) {
      if (
        state.projects.saving.length > 0 &&
        state.projects.saving.findIndex(
          (value: ProjectProps) => value === project
        ) !== -1
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  })

  // if the project was retrieved but the output object hasn't been set,
  // or the output object does not match the retrieved project,
  // set the output object
  // useEffect(() => {
  //   if (project && (!outputObject || outputObject.id != project.id)) {
  //     localDispatch({ type: 'setOutputObject', project})
  //   }
  // },[project, outputObject])

  // if the project wasn't retrieved, and no id was passed,
  // and a new project hasn't already been created,
  // create a new project
  useEffect(() => {
    if (!id && !project && !projectId) {
      if (!creatingProjectId) {
        dispatch(createNewProject({ name: verbalId.create(undefined) }))
      } else {
        // if a creatingProjectId does exist, set it as the projectId
        // this will cause project to be populated, triggering objectOutput to be
        // returned to the calling component
        //
        localDispatch({ type: 'setProjectId', id: creatingProjectId })
        // also clear the creatingProjectId
        dispatch(clearCreatingProjectId())
      }
    }
  }, [creatingProjectId])
  // will run once at start and then again if creatingProjectId is populated

  // if the project wasn't retrieved from store, but an id was set,
  // load it from the server.
  useEffect(() => {
    if (!project && projectId) {
      dispatch(getProject(projectId))
    }
  }, [projectId]) // this runs once at start and again if projectId changed

  // if an error is thrown, capture it for return
  useEffect(() => {
    if (fetchError) {
      localDispatch({ type: 'setError', err: fetchError.message })
    }
  }, [fetchError])

  // if the passed-in project id changes, change project id
  useEffect(() => {
    if (id && id != projectId) {
      localDispatch({ type: 'setProjectId', id })
    }
  }, [id])

  // if the retrieved project's id changes, reset copy (for now)
  useEffect(() => {
    if (copy && project && copy.id !== project.id) {
      localDispatch({ type: 'setCopy', project: { ...project } })
    }
  })

  function saveProject() {
    if (project) {
      dispatch(saveProjectToServer(copy || project))
    }
  }

  function updateProject(project: ProjectProps) {
    dispatch(upsertProject(project))
  }

  function addTrackFromFile(fileData: AudioFileData) {
    if (projectId) {
      dispatch(
        addTrackAndEntityFromAudioFile(
          fileData,
          projectId,
          audioEntityTypes.Loop,
          AudioEntitySources.web
        )
      )
    }
  }

  function initCopy() {
    if (!copy && project) {
      localDispatch({ type: 'setCopy', project: { ...project } })
    }
  }

  function commitCopy() {
    if (copy) {
      updateProject(copy)
      saveProject()
    }
  }

  const getSetter = useMemo(
    () => <T>(prop: string) => {
      initCopy()
      return (value: T) => {
        if (project && copy) {
          localDispatch({
            type: 'setCopy',
            project: { ...copy, [prop]: value },
          })
        }
      }
    },
    [project, copy]
  )

  const getClockSetter = useMemo(
    () => <T>(prop: string) => {
      initCopy()
      return (value: T) => {
        if (project && copy) {
          localDispatch({
            type: 'setCopy',
            project: {
              ...copy,
              clock: { ...copy.clock, [prop]: value },
            },
          })
        }
      }
    },
    [project, copy]
  )

  // finally, return the project and/or error.
  return {
    project,
    error,
    saving,
    copy,
    commitCopy,
    // saveProject,
    // upsertProject,
    addTrackFromFile,
    getSetter,
    getClockSetter,
  }
}
