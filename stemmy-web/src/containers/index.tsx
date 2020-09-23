import * as React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

// Layout
import Layout from '../layout/index'

// Components
import Image from '../components/Image'
import Heading from '../components/Heading'
import { gql, useQuery } from '@apollo/client'

import ProjectPlayer, { ProjectPlayerProps } from '../components/ProjectPlayer'

interface IndexPageProps {
  location: {
    pathname: string
  }
}

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  padding: ${p => p.theme.spacing.unit * 3}px;
  background: ${p => p.theme.palette.darkPrimary};
`

const GET_PROJECTS_PAGE = gql`
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

export default ({ location }: IndexPageProps) => {
  const { data } = useQuery(GET_PROJECTS_PAGE, {
    variables: {
      page: 1,
      perPage: 5,
    },
  })
  console.log('projects :', data)

  return (
    <Layout location={location}>
      <Wrapper>
        {data &&
          data.projectsPage.map((project: ProjectPlayerProps) => (
            <ProjectPlayer {...project} />
          ))}
      </Wrapper>
    </Layout>
  )
}
