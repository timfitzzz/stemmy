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
import {
  createDesiredProjectSelector,
  createDesiredProjectWithEditorChangesSelector,
  createDesiredProjectWithPlayerChangesSelector,
  createProjectErrorSelector,
  createProjectSavingSelector,
  selectCreatingProjectId,
} from './selectors'

interface IgetProjectOptions {
  id?: string
  createNew?: boolean
  mode?: 'player' | 'editor'
}

interface OgetProject {
  project: Partial<ProjectProps> | null
  originalProject: Partial<ProjectProps> | null
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

export const useProject = ({
  id,
  createNew = false,
  mode = 'player',
}: IgetProjectOptions = {}) => {
  // useProject interface:
  // - if a blank object is passed, a new project will be created, stored as a draft, and
  //   returned.
  // - if an object is passed:
  //   - id: string -- will return the project with the following id
  //   - props: string[] -- a list of property names from the project to return
  //     - (default: the full project as locally stored)

  // we're doing some conditional hooking based on whether we want to show
  // player or editor changes, which means that this hook cannot
  // change modes. it needs to be the same from its instantiation or
  // hooks will get out of order.

  const [dataMode, dontSetDataMode] = useState(mode)

  const dispatch = useDispatch()

  const [{ projectId, error, copy }, localDispatch] = useReducer(
    useProjectReducer,
    {
      projectId: id || null,
      error: null,
      copy: null,
    }
  )

  const originalProjectSelector = useMemo(
    () => createDesiredProjectSelector(projectId),
    [projectId]
  )

  const originalProject = useSelector(originalProjectSelector)

  let project: Partial<ProjectProps> | null

  if (dataMode === 'player') {
    const projectPlayerChangesSelector = useMemo(
      () => createDesiredProjectWithPlayerChangesSelector(projectId),
      [projectId]
    )

    project = useSelector(projectPlayerChangesSelector)
  } else if (dataMode === 'editor') {
    const projectEditorChangesSelector = useMemo(
      () => createDesiredProjectWithEditorChangesSelector(projectId),
      [projectId]
    )

    project = useSelector(projectEditorChangesSelector)
  } else {
    // default to player

    const projectPlayerChangesSelector = useMemo(
      () => createDesiredProjectWithPlayerChangesSelector(projectId),
      [projectId]
    )

    project = useSelector(projectPlayerChangesSelector)
  }

  const creatingProjectId: string | null = useSelector(selectCreatingProjectId)

  const projectErrorsSelector = useMemo(
    () => createProjectErrorSelector(projectId),
    [projectId]
  )

  // if the current most recent error belongs to this project,
  // capture it and return it
  const fetchErrors: ProjectIOError[] | null = useSelector(
    projectErrorsSelector
  )

  const projectSavingSelector = useMemo(
    () => createProjectSavingSelector(project),
    [project]
  )

  const saving: boolean = useSelector(projectSavingSelector)

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
  // and createNew was passed in, create a new project
  useEffect(() => {
    if (!id && !project && !projectId && createNew) {
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
    if (fetchErrors) {
      localDispatch({ type: 'setError', err: fetchErrors[0].message })
    }
  }, [fetchErrors])

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

  function commitChanges() {
    if (copy) {
      updateProject(copy)
      saveProject()
    }
  }

  // const getSetter = useMemo(
  //   () => <T>(prop: string) => {
  //     initCopy()
  //     return (value: T) => {
  //       if (project && copy) {
  //         localDispatch({
  //           type: 'setCopy',
  //           project: { ...copy, [prop]: value },
  //         })
  //       }
  //     }
  //   },
  //   [project, copy]
  // )

  // const getClockSetter = useMemo(
  //   () => <T>(prop: string) => {
  //     initCopy()
  //     return (value: T) => {
  //       if (project && copy) {
  //         localDispatch({
  //           type: 'setCopy',
  //           project: {
  //             ...copy,
  //             clock: { ...copy.clock, [prop]: value },
  //           },
  //         })
  //       }
  //     }
  //   },
  //   [project, copy]
  // )

  // finally, return the project and/or error.
  return {
    project,
    originalProject,
    error,
    saving,
    commitChanges,
    addTrackFromFile,
  }
}
