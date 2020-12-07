import React, { ReactElement, Ref, useContext, useEffect, useRef, useState } from 'react'
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
import { audioContext as AudioContext } from '../helpers'
import { AudioProvider } from '../helpers/audioContext'
import * as Tone from 'tone'

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
  const [ startedTone, setStartedTone ] = useState<Boolean>(false)
  const [ removedToneStartListener, setRemovedToneStartListener ] = useState<Boolean>(false)


  const wrapperRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    async function handleStartTone() {
      await Tone.start()
      // console.log('starting tone')
      setStartedTone(true)
    }

    if (wrapperRef && !startedTone) {
      wrapperRef!.current!.addEventListener('click', handleStartTone)
    } else if (wrapperRef && startedTone && !removedToneStartListener) {
      wrapperRef!.current!.removeEventListener('click', handleStartTone)
      setRemovedToneStartListener(true)
    }

    return (() => {
      if (wrapperRef && !startedTone) {
        wrapperRef!.current!.removeEventListener('click', handleStartTone)
      }
    })
  }, [wrapperRef, startedTone, removedToneStartListener])
  
  return (
    <Wrapper ref={wrapperRef}>
      <GlobalStyles />
      <Head pathname={location.pathname} />
      <ThemeProvider theme={theme}>
        <AudioProvider>
          <LeftSidebar
            userName={'userName'}
            menuItems={[]}
            title={site.siteMetadata.title}
            subtitle={site.siteMetadata.description}
          />
          <BodyContainer>{children}</BodyContainer>
        </AudioProvider>
      </ThemeProvider>
    </Wrapper>
  )
}
