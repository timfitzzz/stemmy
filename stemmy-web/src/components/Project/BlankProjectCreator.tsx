import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import verbalId from 'verbal-id'

import { RootState } from '../../store'
import {
  createNewProject,
  saveProjectToServer,
  upsertProject,
} from '../../store/projects/actions'
import { ProjectProps } from '../../types'
import ProjectEditor from './ProjectEditor'

const BlankProjectCreatorWrapper = styled.div`
  display: contents;
`

export default ({}) => {
  const projectsDispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const creatingProjectId: string | null = useSelector<
    RootState,
    string | null
  >(state => state.projects.creatingId)

  let protoProject: ProjectProps | null = useSelector<
    RootState,
    ProjectProps | null
  >(state => {
    if (!creatingProjectId) {
      return null
    } else {
      return state.projects.byId[creatingProjectId]
    }
  })

  // const projectLoading: boolean = useSelector<RootState, boolean>(
  //   state => state.projects.saving.loading
  // )

  useEffect(() => {
    if (!creatingProjectId) {
      projectsDispatch(createNewProject({ name: verbalId.create(undefined) }))
    } else if (creatingProjectId && loading) {
      setLoading(false)
    }
  })

  return (
    <BlankProjectCreatorWrapper>
      {loading || !creatingProjectId ? (
        <div>loading...</div>
      ) : (
        <ProjectEditor
          saveProject={(project: ProjectProps) => {
            projectsDispatch(saveProjectToServer(project))
          }}
          upsertProject={(project: ProjectProps) => {
            projectsDispatch(upsertProject(project))
          }}
          project={protoProject || {}}
        ></ProjectEditor>
      )}
    </BlankProjectCreatorWrapper>
  )
}
