import React from 'react'
import { GetRailProps } from 'react-compound-slider'
import styled from 'styled-components'

export const OuterRail = styled.div`
  position: absolute;
  width: 100%;
  height: 42px;
  transform: translate(0%, -50%);
  border-radius: 7;
  cursor: pointer;
`

export const InnerRail = styled.div`
  position: absolute;
  width: 100%;
  height: 14px;
  transform: translate(0%, -50%);
  border-radius: 7px;
  pointer-events: none;
  background-color: ${p => p.theme.palette.lightPrimary};
`

interface RailProps {
  getRailProps: GetRailProps
}

export const SliderRail: React.FC<RailProps> = ({ getRailProps }) => {
  return (
    <>
      <OuterRail {...getRailProps()} />
      <InnerRail />
    </>
  )
}
