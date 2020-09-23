import React, { ChangeEvent } from 'react'
import styled from 'styled-components'

const sliderThumbStyles = (props: ISliderContainerProps) => `
  width: 25px;
  height: 25px;
  background: ${props.thumbColor}
  cursor: pointer;
  outline: 5px solid #333;
`

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${p => p.theme.palette.lightPrimary};

  > div {
    flex: 6;
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: ${p => p.theme.palette.darkPrimary};
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${(p: ISliderContainerProps) => sliderThumbStyles(p)}
    }

    &::-moz-range-thumb {
      ${(p: ISliderContainerProps) => sliderThumbStyles(p)}
    }
  }
`

interface ISliderProps {
  value: number
  min: number
  max: number
  setValue: (value: number) => void
  className: string
  thumbColor: string
}

interface ISliderContainerProps {
  thumbColor: string
}

export const Slider: React.FC<ISliderProps> = ({
  value,
  min,
  max,
  setValue,
  className,
  thumbColor,
}: ISliderProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(parseFloat(e.target.value))

  return (
    <SliderContainer className={className} thumbColor={thumbColor}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleOnChange}
      />
    </SliderContainer>
  )
}
