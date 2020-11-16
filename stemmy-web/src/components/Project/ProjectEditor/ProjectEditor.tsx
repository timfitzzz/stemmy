import React, { useState } from 'react'
import styled from 'styled-components'
import { ProjectActionTypes } from '../../../store/projects'
import { ProjectProps } from '../../../types'
import TracksEditor from './TracksEditor'
import ProjectSettingsEditor from './ProjectSettingsEditor'

const ProjectEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ProjectEditorSplitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 800px;
  border: 3px solid ${p => p.theme.palette.lightPrimary};
  border-radius: 20px;
  position: relative;
  align-items: stretch;
  height: 100%;
`

const ProjectEditorFormFieldsWrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
`

const ProjectEditorSplitBorder = styled.div`
  width: 2px;
  background: ${p => p.theme.palette.lightPrimary};
`
const ProjectEditorTracksListWrapper = styled.div`
  padding: 10px;
  width: 100%;
  min-height: 100%;
`

interface ProjectEditorProps {
  project: ProjectProps
  saveProject: (project: ProjectProps) => void
  upsertProject: (project: ProjectProps) => void
}

export default ({
  project,
  saveProject,
  upsertProject,
}: ProjectEditorProps) => {
  const [name, setName] = useState(project.name)
  const [tracks, setTracks] = useState(project.tracks)

  return (
    <ProjectEditorWrapper>
      <ProjectEditorSplitWrapper>
        <ProjectEditorFormFieldsWrapper>
          <ProjectSettingsEditor
            project={project}
            saveProject={saveProject}
            upsertProject={upsertProject}
          />
        </ProjectEditorFormFieldsWrapper>
        <ProjectEditorSplitBorder />
        <TracksEditor trackIds={project.tracks!} projectId={project.id!} />
      </ProjectEditorSplitWrapper>
    </ProjectEditorWrapper>
  )
}
