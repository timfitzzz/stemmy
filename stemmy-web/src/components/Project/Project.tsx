import React, { useMemo } from 'react'
import { useProject } from '../../helpers/useProject'
import styled from 'styled-components'
import { ProjectProps } from '../../types'
import BlankProjectCreator from './BlankProjectCreator'
import BasicList from './views/BasicList'
import ProjectEditor from './ProjectEditor'
import { useMultipleHooks } from '../../helpers/useMultipleHooks'
import { useTrack } from '../../helpers'

export enum ProjectViews {
  basicList = 'basicList',
  smallPlayer = 'smallPlayer',
  bigPlayer = 'bigPlayer',
  editor = 'editor',
}

interface IProjectView {
  view: ProjectViews
  projectId?: string
}

const Project = function({ view, projectId }: IProjectView) {
  const props = useMemo<(keyof ProjectProps)[]>(() => {
    switch (view) {
      case ProjectViews.basicList:
        return ['name', 'tracks', 'draft']
      default:
        return []
    }
  }, [])

  const { project } = useProject({ id: projectId })

  const projectProps = useMemo(
    () =>
      project
        ? Object.assign(
            {},
            ...props.map(prop => ({
              [prop]: project[prop],
            }))
          )
        : null,
    [project]
  )

  return (
    <>
      {project &&
        projectId &&
        {
          basicList: <BasicList {...projectProps} />,
          editor: <ProjectEditor projectId={projectId} />,
          smallPlayer: <div></div>,
          bigPlayer: <div></div>,
        }[view]}
    </>
  )
}

export default Project
