import React, {
  Component,
  ReactComponentElement,
  ReactElement,
  useState,
  useEffect,
  useRef,
  Ref,
  ElementType,
} from 'react'
import styled from 'styled-components'
import verbalid from 'verbal-id'
import EditableLabel from '../EditableLabel'

import { Slider } from '../Slider'

interface TrackFullyResolved {}

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

interface IProjectFields {
  fields: ProjectFields
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
  flex-direction: row;
  position: relative;
`

const ProjectArt = styled.img``

interface BPMDisplayFields {
  BPM: number
  setBPM?: (value: number) => void
}

const BPMDisplayContainer = styled.div``

const BPMSlider = styled(Slider)``

const BPMDisplay = ({ BPM, setBPM }: BPMDisplayFields) => {
  return (
    <BPMDisplayContainer>
      <BPMSlider
        min={30}
        max={300}
        value={BPM}
        setValue={setBPM}
        thumbColor={'black'}
      />
      {/* <BPMSlider
        domain={[30, 300]}
        step={0.01}
        mode={1}
        values={[BPM]}
        onChange={
          setBPM
            ? values => {
                console.log(values)
                if (values) {
                  setBPM(values[0])
                }
              }
            : values => {}
        }
        onUpdate={
          setBPM
            ? values => {
                console.log(values)
                if (values) {
                  setBPM(values[0])
                }
              }
            : values => {}
        }
      /> */}
    </BPMDisplayContainer>
  )
}

export default ({ fields }: IProjectFields) => {
  const [name, setName] = useState<string>(
    fields.name || verbalid.create(undefined)
  )
  const [tracks, setTracks] = useState<string[]>(fields.tracks || [])
  const [id, setId] = useState<string>(fields.id || '')
  const [clock, setClock] = useState<ProjectClockFields>(
    fields.clock || {
      BPM: 120,
    }
  )

  function handleSaveChange() {}

  function getClockSetter<T>(param: string) {
    return (value: T) => setClock({ ...clock, [param]: value })
  }

  return (
    <ProjectSettingsDisplay>
      <ArtAndLabelContainer>
        <ProjectArt src="https://via.placeholder.com/100" />
        <EditableLabel
          fieldName={'name'}
          type={'textarea'}
          value={name}
          setValue={setName}
          valueContainer={ProjectTitle}
          inputContainer={TitleInputContainer}
          saveHandler={handleSaveChange}
        />
      </ArtAndLabelContainer>
      <ClockSettingsContainer>
        <BPMDisplay
          BPM={clock.BPM || 120}
          setBPM={getClockSetter<number>('BPM')}
        />
      </ClockSettingsContainer>
    </ProjectSettingsDisplay>
  )
}
