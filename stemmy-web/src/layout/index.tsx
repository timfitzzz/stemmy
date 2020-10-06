import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'

import theme from '../styles/theme'
import GlobalStyles from '../styles/globalStyles'

import Head from '../components/Head'

import { apolloClient } from '../util/apolloClient'
import { gql, useQuery } from '@apollo/client'

import ProjectPlayer from '../components/ProjectPlayer'
import { graphql, useStaticQuery } from 'gatsby'
import LeftSidebar from '../components/LeftSidebar'
import BodyContainer from '../components/BodyContainer'
import { Provider } from 'react-redux'
import { store } from '../store'

interface ILayoutProps {
  children: any
  location: {
    pathname: string
  }
}

// interface IndexPageProps {
//   location: {
//     pathname: string
//   }

// }

const Wrapper = styled.div`
  display: flex;
`

export default ({ children, location }: ILayoutProps) => {
  const { image, site } = useStaticQuery(graphql`
    query masthead {
      image: file(relativePath: { eq: "icon.png" }) {
        ...fluidImage
      }
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  return (
    <Wrapper>
      <GlobalStyles />
      <Head pathname={location.pathname} />
      <ThemeProvider theme={theme}>
        <LeftSidebar
          userName={'userName'}
          menuItems={[]}
          title={site.siteMetadata.title}
          subtitle={site.siteMetadata.description}
        />
        <BodyContainer>{children}</BodyContainer>
      </ThemeProvider>
    </Wrapper>
  )
}
