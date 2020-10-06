import { gql } from '@apollo/client'

export const GET_PROJECTS_PAGE = gql`
  query getProjectsPage($page: Float, $perPage: Float) {
    projectsPage(page: $page, perPage: $perPage) {
      _id
      tracks
      name
      clock {
        BPM
        BPMIsGuessed
        beatsPerBar
        length
        lengthIsSet
        multiplier
        originalBPM
      }
    }
  }
`
