import React, { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { ProjectActionTypes } from '../../../store/projects'
import { ProjectProps } from '../../../types'
import TracksEditor from './TracksEditor'
import ProjectSettingsEditor from './ProjectSettingsEditor'
import useTransport from '../../../helpers/useTransport'
import ContextForAudio, { IContextForAudio } from '../../../helpers/audioContext'
import { Panel, PanelWrapper } from '../../Panel';
import { useProject } from '../../../helpers/useProject'


const ProjectEditorWrapper = styled(PanelWrapper)`
  flex-direction: row;
`

const ProjectEditorSplitWrapper = styled(Panel)`
  flex-direction: row;
  max-width: 800px;
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
  projectId: string
}

export default ({
  projectId
}: ProjectEditorProps) => {

  const { project } = useProject({ id: projectId, props: [ 'name', 'tracks']})

  const [name, setName] = useState(project ? project.name : null)
  const [tracks, setTracks] = useState(project ? project.tracks : null)

  const contextObj: Partial<IContextForAudio> = useContext(ContextForAudio)
  const { setCurrentProject, clearCurrentProject } = contextObj;

  const { transportSet, unsetTransport, Transport } = useTransport({
    projectId: project ? project.id : undefined,
    projectClock: project ? project.clock : undefined
  });

  useEffect(() => {
    if (setCurrentProject && project && project.id) {
      setCurrentProject(project.id)
    }

    return () => {
      if (clearCurrentProject) {
        clearCurrentProject()
      }
    }
  }, [])

  return (
    <ProjectEditorWrapper>
      <ProjectEditorSplitWrapper>
        <ProjectEditorFormFieldsWrapper>
          <ProjectSettingsEditor
            projectId={projectId}
            registerTransportChange={unsetTransport}
          />
        </ProjectEditorFormFieldsWrapper>
        <ProjectEditorSplitBorder />
        <TracksEditor 
          projectId={projectId}
        />
      </ProjectEditorSplitWrapper>
    </ProjectEditorWrapper>
  )
}
