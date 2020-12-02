import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useProject } from '../../helpers/useProject'
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

  // const [loading, setLoading] = useState(true)
  
  const { project } = useProject({})

  // // here is the amount of logic we actually want in here:
  // // const { getDraftProjects } = getProject()
  // // const draftProjects = getDraftProjects()
  // //
  // // const 
  // //
  // // useEffect(() => {
  // //  
  // // })

  // const creatingProjectId: string | null = useSelector<
  //   RootState,
  //   string | null
  // >(state => state.projects.creatingId)

  // let protoProject: ProjectProps | null = useSelector<
  //   RootState,
  //   ProjectProps | null
  // >(state => {
  //   if (!creatingProjectId) {
  //     return null
  //   } else {
  //     return state.projects.byId[creatingProjectId]
  //   }
  // })

  // // const projectLoading: boolean = useSelector<RootState, boolean>(
  // //   state => state.projects.saving.loading
  // // )

  // useEffect(() => {
  //   if (!creatingProjectId) {
  //     projectsDispatch(createNewProject({ name: verbalId.create(undefined) }))
  //   } else if (creatingProjectId && loading) {
  //     setLoading(false)
  //   }
  // }, [creatingProjectId, loading])

  return (
    <BlankProjectCreatorWrapper>
      {!project? (
        <div>loading...</div>
      ) : (
        <ProjectEditor
          saveProject={(project: ProjectProps) => {
            projectsDispatch(saveProjectToServer(project))
          }}
          upsertProject={(project: ProjectProps) => {
            projectsDispatch(upsertProject(project))
          }}
          project={project}
        ></ProjectEditor>
      )}
    </BlankProjectCreatorWrapper>
  )
}
