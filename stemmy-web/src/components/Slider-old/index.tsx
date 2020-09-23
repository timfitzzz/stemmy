import React from 'react'
import styled from 'styled-components'
import {
  Slider as SliderComponent,
  Rail,
  Handles,
  Tracks,
} from 'react-compound-slider'
import { SliderRail } from './SliderRail'
import { Handle } from './Handle'
import { SliderTrack } from './SliderTrack'

interface SliderProps {
  readonly values: number[]
  domain: number[]
  mode: number
  step: number
  className?: string
  onUpdate?: (values: readonly number[]) => void
  onChange?: (values: readonly number[]) => void
}

const StemmySlider = styled(SliderComponent)`
  width: 100%;
  touch-action: none;
`

export const Slider: React.FC<SliderProps> = ({
  values,
  domain,
  mode,
  step,
  className,
  onUpdate,
  onChange,
}) => {
  console.log(values)
  return (
    <div className={className}>
      <StemmySlider
        mode={mode}
        step={step}
        domain={domain}
        onUpdate={onUpdate}
        onChange={onChange}
        values={values}
      >
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div>
              {handles.map(handle => {
                console.log(handle)
                return (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                )
              })}
            </div>
          )}
        </Handles>
        <Tracks right={false}>
          {({ tracks, getTrackProps }) => (
            <div>
              {tracks.map(({ id, source, target }) => (
                <SliderTrack
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
      </StemmySlider>
    </div>
  )
}
