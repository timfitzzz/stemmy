import React from 'react'
import styled from 'styled-components'
import {
  SettingDescription,
  SettingNameAndSetterContainer,
  SettingName,
} from '../../TextComponents'
import { Slider } from '../../Slider'

import { stringifyBPM } from '../../../helpers'

interface BPMEditorFields {
  BPM: number
  setBPM?: (value: number) => void
  originalBPM?: number
  disabled: boolean
  saveHandler: () => void
}

const BPMEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const BPMEditorDigits = styled.div`
  width: 50px;
  margin: 5px;
`

const BPMEditorSlider = styled(Slider)`
  width: 100%;
`

export default ({
  BPM,
  setBPM,
  originalBPM,
  disabled,
  saveHandler,
}: BPMEditorFields) => {
  return (
    <BPMEditorContainer>
      <SettingNameAndSetterContainer>
        <SettingName>BPM</SettingName>
        <BPMEditorDigits>{stringifyBPM(BPM)}</BPMEditorDigits>
        <BPMEditorSlider
          min={30}
          max={300}
          value={BPM}
          step={0.01}
          setValue={setBPM}
          thumbColor={'black'}
          onDragEnd={saveHandler}
        />
      </SettingNameAndSetterContainer>
      <SettingDescription>
        {originalBPM && `Original: ${stringifyBPM(originalBPM)}. `}
        {`Fine adjust = arrow keys`}
      </SettingDescription>
    </BPMEditorContainer>
  )
}
