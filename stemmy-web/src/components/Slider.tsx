import React, { ChangeEvent } from 'react'
import styled from 'styled-components'
import { NodeBuilderFlags } from 'typescript'

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

const SliderInput = styled.input`
  width: 100%;
`

interface ISliderProps {
  value: number
  min: number
  max: number
  setValue?: (value: number) => void
  className?: string
  thumbColor: string
  step: number
  onDragEnd: () => void
}

interface ISliderContainerProps {
  thumbColor: string
}

export const Slider: React.FC<ISliderProps> = ({
  value,
  min,
  max,
  setValue,
  step,
  className,
  thumbColor,
  onDragEnd,
}: ISliderProps) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue && setValue(parseFloat(e.target.value))

  return (
    <SliderContainer className={className} thumbColor={thumbColor}>
      <SliderInput
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleOnChange}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
      />
    </SliderContainer>
  )
}
