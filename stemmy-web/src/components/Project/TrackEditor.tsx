import React from 'react'
import styled from 'styled-components'
import { Track } from '../Tracks'
interface ITrackEditor {
  tracks: string[]
  setTracks: (tracks: string[]) => void
}

const TrackEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const TrackEditor = ({ tracks, setTracks }: ITrackEditor) => {
  return (
    <TrackEditorContainer>
      {tracks &&
        tracks.map(track => (
          <Track trackId={track} editing={true} perRow={3} />
        ))}
    </TrackEditorContainer>
  )
}
