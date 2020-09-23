import * as React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

// Layout
import Layout from '../layout/index'

// Components
import Image from '../components/Image'
import Heading from '../components/Heading'
import { gql, useQuery } from '@apollo/client'
import AddProject from '../components/AddProject'

interface AddPageProps {
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

export default ({ location }: AddPageProps) => {
  return (
    <Layout location={location}>
      <Wrapper>
        Add Project
        <AddProject></AddProject>
      </Wrapper>
    </Layout>
  )
}
