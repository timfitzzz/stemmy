import React, { MouseEvent, useState } from 'react'
import { ProjectActionTypes } from '../../store/projects'
import { ProjectProps } from '../../types'
import styled from 'styled-components'
import ProjectFormFields from './ProjectFormFields'
import { SaveProjectAction } from '../../store/projects/types'
import TracksEditor from './ProjectEditor/TracksEditor'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AddProjectSplitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 800px;
  border: 5px solid ${p => p.theme.palette.lightPrimary};
  border-radius: 20px;
  position: relative;
  align-items: stretch;
`

const AddProjectFormFieldsWrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
`

const AddProjectSplitBorder = styled.div`
  width: 2px;
  background: ${p => p.theme.palette.lightPrimary};
`
const AddProjectTracksListWrapper = styled.div`
  padding: 10px;
  width: 100%;
  min-height: 100%;
`

interface AddProjectsProps {
  project: ProjectProps
  saveProject: (project: ProjectProps) => void
  upsertProject: (project: ProjectProps) => void
}

export default ({ project, upsertProject, saveProject }: AddProjectsProps) => {
  return (
    <Wrapper>
      <AddProjectSplitWrapper>
        <AddProjectFormFieldsWrapper>
          <ProjectFormFields
            project={project}
            saveProject={saveProject}
            upsertProject={upsertProject}
          />
        </AddProjectFormFieldsWrapper>
        <AddProjectSplitBorder />
        <TracksEditor trackIds={project.tracks!} projectId={project.id!} />
      </AddProjectSplitWrapper>
    </Wrapper>
  )
}
