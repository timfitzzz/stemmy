import React from 'react'
import { GetTrackProps, SliderItem } from 'react-compound-slider'
import styled from 'styled-components'

interface SliderTrackProps {
  source: SliderItem
  target: SliderItem
  getTrackProps: GetTrackProps
  disabled?: boolean
}

interface TrackDivProps {
  source: SliderItem
  target: SliderItem
  [key: string]: any
}

const TrackDiv = styled.div`
  position: absolute;
  transform: translate(0%, -50%);
  height: 14px;
  z-index: 1;
  background-color: ${p =>
    p.disabled ? p.theme.palette.primary : p.theme.palette.darkPrimary};
  border-radius: 7px;
  cursor: pointer;
  left: ${(p: TrackDivProps) => p.source.percent}%;
  width: ${(p: TrackDivProps) => p.target.percent - p.source.percent}%;
`

export const SliderTrack: React.FC<SliderTrackProps> = ({
  source,
  target,
  getTrackProps,
  disabled = false,
}) => {
  return (
    <TrackDiv
      disabled={disabled}
      source={source}
      target={target}
      {...getTrackProps()}
    ></TrackDiv>
  )
}
