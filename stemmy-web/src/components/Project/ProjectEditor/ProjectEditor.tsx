import React, { useState, useContext, useEffect, Context } from 'react'
import styled from 'styled-components'
import { ProjectActionTypes } from '../../../store/projects'
import { ProjectProps } from '../../../types'
import TracksEditor from './TracksEditor'
import ProjectSettingsEditor from './ProjectSettingsEditor'
import useTransport from '../../../helpers/useTransport'
import ContextForAudio, { OAudioEngine } from '../../../helpers/audioContext'
import { Panel, PanelWrapper } from '../../Panel';
import { useProject } from '../../../helpers/useProject'
import { useContextSelector } from 'react-use-context-selector';


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

const ProjectEditor = function({
  projectId
}: ProjectEditorProps) {

  const { project } = useProject({ id: projectId, props: [ 'name', 'tracks']})

  const setCurrentProject = useContextSelector(ContextForAudio as Context<OAudioEngine>, value => value.setCurrentProject)
  const clearCurrentProject = useContextSelector(ContextForAudio as Context<OAudioEngine>, value => value.clearCurrentProject)

  const { transportSet, unsetTransport, start, stop, isPlaying } = useTransport({
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
  }, [project])

  const toggleStartStop = () => {
    console.log('playing: ', isPlaying())
    if (isPlaying() && stop) {
      stop()
    } else if (!isPlaying() && start) {
      start()
    }
  }

  return (
    <ProjectEditorWrapper>
      <ProjectEditorSplitWrapper>
        <ProjectEditorFormFieldsWrapper>
          <ProjectSettingsEditor
            projectId={projectId}
            registerTransportChange={() => {}} //unsetTransport
          />
          <button onClick={(e) => {toggleStartStop()}}>Play</button>
        </ProjectEditorFormFieldsWrapper>
        <ProjectEditorSplitBorder />
        <TracksEditor 
          projectId={projectId}
        />
      </ProjectEditorSplitWrapper>
    </ProjectEditorWrapper>
  )
}

ProjectEditor.whyDidYouRender = true

export default ProjectEditor