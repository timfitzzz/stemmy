import { useContext, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import {
  createNewProject,
  loadUserDraftProjects,
  saveProjectToServer,
  upsertProject,
} from '../store/projects/actions'
import { IProjectStore } from '../store/projects/types'
import { ProjectProps } from '../types'
import { createSelector } from 'reselect'
import { createDesiredProjectsSelector } from './selectors'

// Project view components use this to initialize
// and obtain project-related getters and setters.
// -- If it's a new project (id is null)
// -- while each track interacts with

export interface IuseProjectsOptions {
  type?: 'drafts' | 'published'
  ids?: string[]
}

interface OuseProjects {
  projects: Partial<ProjectProps>[] | null
  getDraftIds: () => string[]
  refresh: () => void
}

// type useProjectType = (options: IgetProjectOptions) => OgetProject

export const useProjects = ({
  ids,
  type,
}: IuseProjectsOptions = {}): OuseProjects => {
  let dispatch = useDispatch()
  let [refreshed, setRefreshed] = useState(false)

  let desiredProjectsSelector = createDesiredProjectsSelector(ids || null, type)

  let projects = useSelector<RootState, Partial<ProjectProps>[] | null>(
    desiredProjectsSelector
  )

  function getDraftIds(): string[] {
    // get list of drafts from redux
    return useSelector<RootState, string[]>(state => state.projects.drafts)
  }

  function refreshDraftProjects(): void {
    dispatch(loadUserDraftProjects())
  }

  function refresh(): void {
    setRefreshed(false)
  }

  useEffect(() => {
    if (!refreshed) {
      if (type) {
        switch (type) {
          case 'drafts':
            refreshDraftProjects()
            setRefreshed(true)
          default:
            setRefreshed(true)
        }
      } else {
        setRefreshed(true)
      }
    }

    return () => {}
  }, [refreshed])

  return {
    projects,
    getDraftIds,
    refresh,
  }
}
