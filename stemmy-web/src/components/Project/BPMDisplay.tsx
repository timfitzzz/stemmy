import React from 'react'
import styled from 'styled-components'
import {
  SettingDescription,
  SettingNameAndSetterContainer,
  SettingName,
} from '../TextComponents'
import { Slider } from '../Slider'

interface BPMDisplayFields {
  BPM: number
  setBPM?: (value: number) => void
  originalBPM?: number
  disabled: boolean
  saveHandler: () => void
}

const BPMDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const BPMDigits = styled.div`
  width: 50px;
  margin: 5px;
`

const BPMSlider = styled(Slider)`
  width: 100%;
`

export const BPMDisplay = ({
  BPM,
  setBPM,
  originalBPM,
  disabled,
  saveHandler,
}: BPMDisplayFields) => {
  function stringifyBPM(bpm: number): string {
    const splitDecimal = bpm.toString().split('.')

    switch (splitDecimal.length) {
      case 1:
        return bpm.toString() + '.00'
        break
      case 2:
        if (splitDecimal[1].length === 1) {
          return bpm.toString() + '0'
        } else {
          return bpm.toString()
        }
        break
      default:
        return bpm.toString()
        break
    }
  }

  return (
    <BPMDisplayContainer>
      <SettingNameAndSetterContainer>
        <SettingName>BPM</SettingName>
        <BPMDigits>{stringifyBPM(BPM)}</BPMDigits>
        <BPMSlider
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
    </BPMDisplayContainer>
  )
}
