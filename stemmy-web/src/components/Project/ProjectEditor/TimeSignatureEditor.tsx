import React from 'react'
import styled from 'styled-components'
import {
  SettingDescription,
  SettingNameAndSetterContainer,
  SettingName,
} from '../../TextComponents'
import { Slider } from '../../Slider'

interface TimeSignatureEditorFields {
  beatsPerBar: number
  setBeatsPerBar: (bpb: number) => void
  disabled: boolean
  saveHandler: () => void
}

const TimeSignatureEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TimeSignatureEditorDigits = styled.div`
  width: 50px;
  margin: auto 5px;
`

const TimeSignatureEditorSlider = styled(Slider)`
  width: 100%;
`

export default ({
  beatsPerBar,
  setBeatsPerBar,
  disabled,
  saveHandler,
}: TimeSignatureEditorFields) => {
  return (
    <TimeSignatureEditorContainer>
      <SettingNameAndSetterContainer>
        <SettingName>Beats Per Bar</SettingName>
        <TimeSignatureEditorDigits>{beatsPerBar}</TimeSignatureEditorDigits>
        <TimeSignatureEditorSlider
          min={1}
          max={32}
          value={beatsPerBar}
          step={1}
          setValue={setBeatsPerBar}
          thumbColor={'black'}
          onDragEnd={saveHandler}
        />
      </SettingNameAndSetterContainer>
      <SettingDescription>{'Number of beats per bar'}</SettingDescription>
    </TimeSignatureEditorContainer>
  )
}
