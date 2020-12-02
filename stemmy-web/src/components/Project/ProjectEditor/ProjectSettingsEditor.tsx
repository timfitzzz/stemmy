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
import { useProject } from '../../../helpers/useProject'

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
  projectId: string;
  registerTransportChange: () => void;
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

export default ({ projectId, registerTransportChange }: IAddProjectProps) => {

  const { project, saving, copy, commitCopy, getSetter, getClockSetter } = useProject({ id: projectId })

  const [editing, setEditing] = useState<boolean>(true)

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

  const setName = getSetter<string>('name')
  const setBPM = getClockSetter<number>('BPM')
  const setBeatsPerBar = getClockSetter<number>('beatsPerBar')

  function handleSaveChange() {
    commitCopy()
  }

  return (
    <ProjectSettingsDisplay>
      { copy && copy.clock &&
        <>
          <ArtAndLabelContainer>
            <ProjectArt src="https://via.placeholder.com/100" />
            <EditableLabel
              fieldName={'name'}
              type={'textarea'}
              value={copy.name}
              setValue={setName}
              valueContainer={ProjectTitle}
              inputContainer={TitleInputContainer}
              saveHandler={handleSaveChange}
            />
          </ArtAndLabelContainer>
          <ClockSettingsContainer>
            <SettingsSectionTitle>Time Settings</SettingsSectionTitle>
            <BPMEditor
              BPM={copy.clock.BPM || 120}
              setBPM={setBPM}
              originalBPM={copy.clock.originalBPM}
              saveHandler={handleSaveChange}
              disabled={editing || copy.clock.BPMIsGuessed || true}
            />
            <TimeSignatureEditor
              beatsPerBar={copy.clock.beatsPerBar || 4}
              setBeatsPerBar={setBeatsPerBar}
              disabled={editing}
              saveHandler={handleSaveChange}
            />
          </ClockSettingsContainer>
          <ActivityDisplay>{renderActivity()}</ActivityDisplay>
        </>
      }
    </ProjectSettingsDisplay>
  )
}
