import React, { useMemo } from 'react'
import { useProject } from '../../helpers/useProject'
import styled from 'styled-components'
import { ProjectProps } from '../../types'
import BlankProjectCreator from './BlankProjectCreator'
import BasicList from './views/BasicList'
import ProjectEditor from './ProjectEditor'

export enum ProjectViews {
  basicList = 'basicList',
  smallPlayer = 'smallPlayer',
  bigPlayer = 'bigPlayer',
  editor = 'editor'
}

interface IProjectView {
  view: ProjectViews
  projectId?: string
}

const Project = function({view, projectId}: IProjectView) {

  console.log('rendered project')

  const props = useMemo<(keyof ProjectProps)[]>(() => {
    switch (view) {
      case ProjectViews.basicList:
        return [
          'name', 'tracks', 'draft'
        ]
      default:
        return []
    }
  }, [])

  const { project } = useProject({ id: projectId, props })


  // console.log(props)
  // console.log(project)

  const projectProps = useMemo(() => (project ? Object.assign({},
    ...props.map((prop) => ({
      [prop]: project[prop]
    }))) : null), [project])

  return (
    <>
      { project && projectId &&
        {
          basicList: <BasicList {...projectProps}/>,
          editor: <ProjectEditor projectId={projectId}/>,
          smallPlayer: <div></div>,
          bigPlayer: <div></div>
        }[view]
      }
    </>
  )
}

export default Project