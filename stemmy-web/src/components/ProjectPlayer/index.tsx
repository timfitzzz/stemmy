import * as React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

export interface ProjectClockSettings {
  BPM?: number
  BPMIsGuessed?: boolean
  beatsPerBar?: number
  length?: number
  lengthIsSet?: boolean
  multiplier?: number
  originalBPM?: number
}

export interface ProjectPlayerProps {
  _id: string
  tracks: string[]
  clock: ProjectClockSettings
  name: string
}

const ProjectPlayerContainer = styled.div`
  width: 100%;
  border: 5px solid ${p => p.theme.palette.lightPrimary};
  border-radius: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 1px;
  padding-bottom: 1px;
  margin: 10px;
`

const ProjectPlayerName = styled.h3``

const ProjectPlayerTracksGrid = styled.div``

const GET_TRACKS = gql`
  query getTracks($ids: [String]) {
    tracks(ids: $ids) {
      track
      audioEntity
    }
  }
`

export default ({ _id, tracks, clock, name }: ProjectPlayerProps) => {
  const { data: queryData } = useQuery(GET_TRACKS, {
    variables: {
      ids: tracks,
    },
  })

  console.log(queryData)

  return (
    <ProjectPlayerContainer>
      <ProjectPlayerName>{name}</ProjectPlayerName>
      <ProjectPlayerTracksGrid></ProjectPlayerTracksGrid>
    </ProjectPlayerContainer>
  )
}
