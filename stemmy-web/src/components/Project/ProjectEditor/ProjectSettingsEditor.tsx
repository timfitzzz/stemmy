import { SettingsSectionTitle } from '../../TextComponents'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import verbalid from 'verbal-id'
import EditableLabel from '../../EditableLabel'

import BPMEditor from './BPMEditor'
import TimeSignatureEditor from './TimeSignatureEditor'
import { ProjectProps } from '../../../types'
import { ProjectActionTypes } from '../../../store/projects'
import { SaveProjectAction } from '../../../store/projects/types'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

interface ProjectClockFields {
  BPM?: number
  BPMIsGuessed?: boolean
  beatsPerBar?: number
  length?: number
  lengthIsSet?: boolean
  multiplier?: number
  originalBPM?: number
}

interface NewProjectFields {
  name: string
}

interface ProjectFields {
  name?: string
  tracks?: string[]
  id?: string
  clock?: ProjectClockFields
}

interface IAddProjectProps {
  project: ProjectProps
  saveProject: (project: ProjectProps) => void
  upsertProject: (project: ProjectProps) => void
}

const ProjectSettingsDisplay = styled.form`
  display: flex;
  flex-direction: column;
`

const FormLabel = styled.label`
  color: ${p => p.theme.palette.lightPrimary};
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

const ArtAndLabelContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const ClockSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`

const ProjectArt = styled.img``

const ActivityDisplay = styled.div`
  font-size: 0.8em;
`

const SavingIndicator = styled.span``

const UpToDateIndicator = styled.span``

export default ({ project, upsertProject, saveProject }: IAddProjectProps) => {
  const [protoProject, setProtoProject] = useState<ProjectProps>(
    { ...project } || {}
  )
  const [editing, setEditing] = useState<boolean>(true)

  const saving: boolean = useSelector<RootState, boolean>(state => {
    if (protoProject) {
      if (
        state.projects.saving.length > 0 &&
        state.projects.saving.findIndex(value => value === protoProject) !== -1
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  })

  function getProjectStateSetter<T>(prop: string) {
    return (value: T) => {
      setProtoProject({ ...protoProject, [prop]: value })
    }
  }

  function getClockStateSetter<T>(prop: string) {
    return (value: T) => {
      setProtoProject({
        ...protoProject,
        clock: { ...protoProject.clock, [prop]: value },
      })
    }
  }

  function renderActivity() {
    return (
      <>
        {saving ? (
          <SavingIndicator>Saving...</SavingIndicator>
        ) : (
          <UpToDateIndicator>Up to date</UpToDateIndicator>
        )}
      </>
    )
  }

  const setName = getProjectStateSetter<string>('name')
  const setTracks = getProjectStateSetter<string[]>('tracks')

  function handleSaveChange() {
    upsertProject(protoProject)
    saveProject(protoProject)
  }

  useEffect(() => {
    setProtoProject(project || {})
  }, [project])

  return (
    <ProjectSettingsDisplay>
      <ArtAndLabelContainer>
        <ProjectArt src="https://via.placeholder.com/100" />
        <EditableLabel
          fieldName={'name'}
          type={'textarea'}
          value={protoProject.name}
          setValue={setName}
          valueContainer={ProjectTitle}
          inputContainer={TitleInputContainer}
          saveHandler={handleSaveChange}
        />
      </ArtAndLabelContainer>
      <ClockSettingsContainer>
        <SettingsSectionTitle>Time Settings</SettingsSectionTitle>
        <BPMEditor
          BPM={protoProject.clock!.BPM || 120}
          setBPM={getClockStateSetter<number>('BPM')}
          originalBPM={protoProject.clock!.originalBPM}
          saveHandler={handleSaveChange}
          disabled={editing || protoProject.clock!.BPMIsGuessed || true}
        />
        <TimeSignatureEditor
          beatsPerBar={protoProject.clock!.beatsPerBar || 4}
          setBeatsPerBar={getClockStateSetter<number>('beatsPerBar')}
          disabled={editing}
          saveHandler={handleSaveChange}
        />
      </ClockSettingsContainer>
      <ActivityDisplay>{renderActivity()}</ActivityDisplay>
    </ProjectSettingsDisplay>
  )
}
