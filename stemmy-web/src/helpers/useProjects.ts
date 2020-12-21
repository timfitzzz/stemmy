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

// Project view components use this to initialize
// and obtain project-related getters and setters.
// -- If it's a new project (id is null) 
// -- while each track interacts with 


interface IgetProjectsOptions {
  type?: 'drafts' | 'published'
  ids?: string[],
  props?: (keyof ProjectProps)[]
}

interface OgetProjects {
  projects: Partial<ProjectProps>[] | null
  getDraftIds: () => string[]
  refresh: () => void
}

// type useProjectType = (options: IgetProjectOptions) => OgetProject

export const useProjects = ({ids, type, props}: IgetProjectsOptions = {}): OgetProjects => {

  let dispatch = useDispatch()
  let [refreshed, setRefreshed] = useState(false)

  let selectorProps = [];

  let typeIds = useSelector<RootState, string[] | null>(
    state => {
      switch (type) {
        case 'drafts':
          return state.projects.drafts
        default:
          return null
      }
    }
  )

  if (typeIds && typeIds.length > 0) {
    if (!ids) {
      ids = typeIds
    }
    else {
      ids = typeIds.filter(typeId => ids!.indexOf(typeId) !== -1)
    }
  }

  let byIdSelector = (state: RootState) => state.projects.byId
  let projectsSelector = createSelector(byIdSelector, (byId: IProjectStore['byId']): Partial<ProjectProps>[] | null => ids ? ids.map(id => byId[id]) : null)
  let projects = useSelector<RootState, Partial<ProjectProps>[] | null>(projectsSelector)

  // let projects = useSelector<RootState, Partial<ProjectProps>[] | null>(state => {
  //   let output: Partial<ProjectProps>[] = []
    
  //   // if projectIds were provided, set them as output
  //   if (ids) {
  //     output = ids.map( id => state.projects.byId[id])
  //   } else if (type) {
  //     if (type === 'drafts') {
  //       output = state.projects.drafts.map(id => state.projects.byId[id])
  //     } else if (type === 'published') {
  //       return null // TODO: add this as a status
  //     }
  //   }

  //   if (props && props.length > 0) {
  //     output = output.map(project => {
  //       let validProps = props.filter(prop => project[prop])
  //       if (validProps.length > 0) {
  //         return Object.assign({}, ...validProps.map(prop => ({
  //           [prop]: project[prop]
  //         })))
  //       } else {
  //         return null
  //       }
  //     })
  //   }

  //   return output
  // }, shallowEqual)

  function getDraftIds(): string[] {
    // get list of drafts from redux
    return useSelector<
      RootState,
      string[]
    >(state => state.projects.drafts)
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

    return (() => {})

  }, [refreshed]);

  return {
    projects,
    getDraftIds,
    refresh
  }


}