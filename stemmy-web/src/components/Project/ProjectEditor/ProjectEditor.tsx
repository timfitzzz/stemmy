import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  Context,
  useMemo,
} from 'react'
import styled from 'styled-components'
import { ProjectActionTypes } from '../../../store/projects'
import { ProjectProps } from '../../../types'
import TracksEditor from './TracksEditor'
import ProjectSettingsEditor from './ProjectSettingsEditor'
import useTransport from '../../../helpers/useTransport'
import ContextForAudio, { OAudioEngine } from '../../../helpers/audioContext'
import { Panel, PanelWrapper } from '../../Panel'
import { useProject } from '../../../helpers/useProject'
import { useContextSelector } from 'react-use-context-selector'
import SettingEditorProvider from './SettingEditorProvider'
import EditableLabel from '../../EditableLabel'
import TracksDisplay from '../../Tracks/TrackDisplay/TracksDisplay'

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

const ProjectTitle = styled.h1`
  font-size: 20px;
  line-height: 20px;
`

const TitleInputContainer = styled.textarea.attrs(props => ({
  rows: 3,
}))`
  margin: 10px 0px;
  font-size: 20px;
  line-height: 20px;
  width: 100%;
`

const ProjectArt = styled.img``

const ProjectHeader = styled.div`
  height: 130px;
  display: flex;
  flex-direction: row;
`

interface ProjectEditorProps {
  projectId: string
}

const ProjectEditor = function({ projectId }: ProjectEditorProps) {
  const { project, copy, getSetter, getClockSetter, commitCopy } = useProject({
    id: projectId,
  })

  const setCurrentProject = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    value => value.setCurrentProject
  )
  const clearCurrentProject = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    value => value.clearCurrentProject
  )

  const {
    transportSet,
    unsetTransport,
    start,
    stop,
    isPlaying,
    state,
  } = useTransport({
    projectId: project ? project.id : undefined,
    projectClock: project ? project.clock : undefined,
  })

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

  const toggleStartStop = useMemo(
    () => () => {
      console.log('playing: ', isPlaying())
      if (isPlaying() && stop) {
        stop()
      } else if (!isPlaying() && start) {
        start()
      }
    },
    []
  )

  const nameSetter = useCallback(getSetter<string>('name'), [])
  const imageurlSetter = useCallback(getSetter<string>('imageurl'), [])

  return (
    <ProjectEditorWrapper>
      <ProjectEditorSplitWrapper>
        <ProjectEditorFormFieldsWrapper>
          <ProjectHeader>
            <SettingEditorProvider setter={nameSetter}>
              {setter => (
                <EditableLabel
                  fieldName={'name'}
                  type={'textarea'}
                  value={copy ? copy.name : ''}
                  setValue={setter}
                  valueContainer={ProjectTitle}
                  inputContainer={TitleInputContainer}
                  saveHandler={commitCopy}
                />
              )}
            </SettingEditorProvider>
            <SettingEditorProvider setter={imageurlSetter}>
              {setter => (
                <>
                  <TracksDisplay
                    trackIds={(project && project.tracks) || []}
                    width={125}
                    height={125}
                    outerMargin={0}
                    innerMargin={50}
                    playToggle={toggleStartStop}
                    isPlaying={isPlaying}
                    setPlayback={true}
                  />
                  {/* <ProjectArt src="https://via.placeholder.com/100" /> */}
                </>
              )}
            </SettingEditorProvider>
          </ProjectHeader>
          {/* <ProjectSettingsEditor
            projectId={projectId}
            registerTransportChange={() => {}} //unsetTransport
          /> */}
          <TracksEditor projectId={projectId} />
        </ProjectEditorFormFieldsWrapper>
        {/* <ProjectEditorSplitBorder /> */}
      </ProjectEditorSplitWrapper>
    </ProjectEditorWrapper>
  )
}

ProjectEditor.whyDidYouRender = true

export default ProjectEditor
