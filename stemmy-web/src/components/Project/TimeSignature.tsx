import React from 'react'
import styled from 'styled-components'
import {
  SettingDescription,
  SettingNameAndSetterContainer,
  SettingName,
} from '../TextComponents'
import { Slider } from '../Slider'

interface TimeSignatureDisplayFields {
  beatsPerBar: number
  setBeatsPerBar: (bpb: number) => void
  disabled: boolean
  saveHandler: () => void
}

const TimeSignatureDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TimeSignatureDigits = styled.div`
  width: 50px;
  margin: auto 5px;
`

const TimeSignatureSlider = styled(Slider)`
  width: 100%;
`

export const TimeSignatureDisplay = ({
  beatsPerBar,
  setBeatsPerBar,
  disabled,
  saveHandler,
}: TimeSignatureDisplayFields) => {
  return (
    <TimeSignatureDisplayContainer>
      <SettingNameAndSetterContainer>
        <SettingName>Beats Per Bar</SettingName>
        <TimeSignatureDigits>{beatsPerBar}</TimeSignatureDigits>
        <TimeSignatureSlider
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
    </TimeSignatureDisplayContainer>
  )
}
