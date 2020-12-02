import { useContext, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import verbalId from 'verbal-id'

import { AudioEntitySources, audioEntityTypes, ProjectProps } from "../types";
import { createNewProject, saveProjectToServer, upsertProject } from '../store/projects/actions';
import { clearCreatingProjectId } from '../store/projects/actions';
import { getProject } from '../store/projects/actions';
import { ProjectIOError } from '../store/projects/types';
import { addTrackAndEntityFromAudioFile } from '../store/crossoverActions';
import { AudioFileData } from '../rest';

interface IgetProjectOptions {
  id?: string
  props?: (keyof ProjectProps)[]
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

export const useProject = ({id, props}: IgetProjectOptions = {}) => {

  // useProject interface:
  // - if a blank object is passed, a new project will be created, stored as a draft, and
  //   returned.
  // - if an object is passed:
  //   - id: string -- will return the project with the following id
  //   - props: string[] -- a list of property names from the project to return
  //     - (default: the full project as locally stored)

  const dispatch = useDispatch()
  const [projectId, setProjectId] = useState<string | null>(id || null)
  const [outputObject, setOutputObject] = useState<Partial<ProjectProps> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copy, setCopy] = useState<Partial<ProjectProps> | null>(null)

  const project: Partial<ProjectProps> | null = useSelector<
    RootState,
    ProjectProps | null
  >(state => {
    // if a a projectId is set and it exists in state,
    // we'll return it.
    if (projectId && state.projects.byId[projectId]) {
      // .. though we'll filter it first if asked.
      if (props && props.length > 0) {
        let validProps = props.filter(prop => state.projects.byId[projectId][prop])
        if (validProps.length > 0) {
          return Object.assign({}, ...validProps.map(
            prop => ({
              [prop]: state.projects.byId[projectId][prop]
            })
          ))
        } else {
          return null
        }
      // if not asked to filter, here's the object from store.
      } else {
        return state.projects.byId[projectId]
      }
    // or if there's no project id, or there's no project in the store
    // by the given id, those are jobs for useEffect to handle, which it will know
    // because we are returning null.
    } else {
      return null
    }
  })

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
    if (state.projects.errors[0]
        && state.projects.errors[0].id === projectId) {
          return state.projects.errors[0]
    } else {
      return null
    }
  })

  const saving: boolean = useSelector<RootState, boolean>(state => {
    if (project) {
      if (
        state.projects.saving.length > 0 &&
        state.projects.saving.findIndex((value: ProjectProps) => value === project) !== -1
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
  // set the output object
  useEffect(() => {
    if (project && !outputObject) {
      setOutputObject(project)
    }
  },[project, outputObject])

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
        setProjectId(creatingProjectId)
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
      setError(fetchError.message)
    }
  }, [fetchError])

  function saveProject () {
    if (project) {
      dispatch(saveProjectToServer(project))
    }
  }
  
  function updateProject(project: ProjectProps) {
    dispatch(upsertProject(project))
  }

  function addTrackFromFile (fileData: AudioFileData) {
    if (projectId) {
      dispatch(
        addTrackAndEntityFromAudioFile (
          fileData,
          projectId,
          audioEntityTypes.Loop,
          AudioEntitySources.web
        )
      )
    }
  }

  const [protoProject, setProtoProject] = useState<ProjectProps>(
    { ...project } || {}
  )


  function initCopy() {
    if (!copy && project) {
      setCopy({...project})
    }
  }

  function commitCopy() {
    if (copy) {
      updateProject(copy)
      saveProject()
    }
  }

  function getSetter<T>(prop: string) {
    initCopy()
    return (value: T) => {
      if (project && copy) {
        setCopy({ ...copy, [prop]: value })
      }
    }
  }

  function getClockSetter<T>(prop: string) {
    initCopy()
    return (value: T) => {
      if (project && copy) {
        setCopy({
          ...copy,
          clock: { ...copy.clock, [prop]: value },
        })
      }
    }
  }

  // finally, return the project and/or error.
  return {
    project: outputObject,
    error,
    saving,
    copy,
    commitCopy,
    // saveProject,
    // upsertProject,
    addTrackFromFile,
    getSetter,
    getClockSetter
  }
}