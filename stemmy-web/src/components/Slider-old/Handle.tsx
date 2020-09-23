import React from 'react'
import styled from 'styled-components'
import { GetHandleProps, SliderItem } from 'react-compound-slider'

interface HandleProps {
  domain: number[]
  handle: SliderItem
  getHandleProps: GetHandleProps
  disabled?: boolean
}

interface HandleDivProps {
  percent?: number
  id: number
  [key: string]: any
}

const HandleDiv1 = styled.div`
  left: ${(p: HandleDivProps) => p.percent}%;
  position: absolute;
  transform: translate(-50%, -50%);
  --webkit-tap-highlight-color: ${p => p.theme.palette.lightPrimary};
  z-index: 5;
  width: 28px;
  height: 42px;
  cursor: pointer;
  background-color: none;
`
const HandleDiv2 = styled.div`
  left: ${(p: HandleDivProps) => p.percent}%;
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-color: ${p =>
    p.disabled ? p.theme.palette.lightPrimary : p.theme.palette.darkPrimary};
`

export const Handle: React.FC<HandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  disabled = false,
  getHandleProps,
}) => {
  console.log(id)
  console.log(value)
  console.log(getHandleProps(id))
  return (
    <>
      <HandleDiv1 percent={percent} {...getHandleProps(id)} />
      <HandleDiv2
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        percent={percent}
        disabled={disabled}
      />
    </>
  )
}
