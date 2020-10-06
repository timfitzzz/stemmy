import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import styled from 'styled-components'
import { TrackProps } from '../../types'

interface ITrackProps {
  trackId: string
  editing: boolean
  perRow: number
}

interface ITrackWrapper {
  perRow: number
}

const TrackWrapper = styled.div<ITrackWrapper>`
  width: ${p => 100 / p.perRow}%;
`

const TrackImageContainer = styled.div``

const TrackImage = styled.img`
  flex-shrink: 0;
  width: 100%;
`

export const Track = ({ trackId, editing, perRow }: ITrackProps) => {
  const trackProps: TrackProps = useSelector<RootState, TrackProps>(state => {
    return state.tracks.byId[trackId]
  })

  let { entityType, entityId } = trackProps

  return (
    <TrackWrapper perRow={3}>
      <TrackImageContainer>
        <TrackImage
          src={`${process.env.GATSBY_PNGS_URI}/${entityType}/${entityId}/0`}
        />
      </TrackImageContainer>
    </TrackWrapper>
  )
}
