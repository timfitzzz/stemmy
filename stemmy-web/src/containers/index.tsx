import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

// Layout
import Layout from '../layout/index'

// Components
import Image from '../components/Image'
import Heading from '../components/Heading'
import { useQuery } from '@apollo/client'
import { GET_PROJECTS_PAGE } from '../gql/queries'

import ProjectPlayer, { ProjectPlayerProps } from '../components/ProjectPlayer'
import { RootState } from '../store'
import { getProjectsPage } from '../rest'
import {
  connect,
  ConnectedProps,
  useDispatch,
  useSelector,
  useStore,
} from 'react-redux'
import { ProjectProps } from '../types'
import { RootDispatcher } from '../store'
import { Dispatch } from 'redux'
import { ProjectActions } from '../store/projects'
import { loadProjectsPage } from '../store/projects/actions'

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

const mapState = (state: RootState) => ({
  projects: state.projects,
})

const mapDispatch = {
  loadProjectsPage,
}

const connector = connect(mapState, mapDispatch)
type propsFromRedux = ConnectedProps<typeof connector>

type IndexPageProps = propsFromRedux & {
  location: {
    pathname: string
  }
}

export default ({ location }: IndexPageProps) => {
  const projects = useSelector<RootState, { [key: string]: ProjectProps }>(
    state => state.projects.byId
  )

  const { pageNumber, perPage, currentPageIds } = useSelector<
    RootState,
    { pageNumber: number; perPage: number; currentPageIds: string[] }
  >(state => state.projects.page)

  const projectsDispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsDispatch(loadProjectsPage(pageNumber, perPage))
  }, [])

  return (
    <Layout location={location}>
      <Wrapper>
        {currentPageIds &&
          currentPageIds.map((projectId: string) => (
            <ProjectPlayer
              {...projects[projectId]}
              key={'projectplayer' + projectId}
            />
          ))}
      </Wrapper>
    </Layout>
  )
}
