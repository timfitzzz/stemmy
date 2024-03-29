import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'

// Layout
import Layout from '../layout/index'

// Components
import Image from '../components/Image'
import Heading from '../components/Heading'
import { gql, useQuery } from '@apollo/client'
import verbalId from 'verbal-id'
import AddProject from '../components/Project'
import { RootState } from '../store'
import {
  createNewProject,
  saveProjectToServer,
  upsertProject,
} from '../store/projects/actions'
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux'
import { ProjectProps } from '../types'
import { store } from '../store'
import { Dispatch } from 'redux'
import { isGetAccessor } from 'typescript'

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  padding-left: 35px;
  padding-top: ${p => p.theme.spacing.unit * 3}px;
  background: ${p => p.theme.palette.darkPrimary};
`

// const mapState = (state: RootState) => ({
//   projects: state.projects,
// })

// const mapDispatch = (dispatch: Dispatch) => {
//   createNewProject: dispatch(createNewProject)
// }

// const connector = connect(mapState, mapDispatch)
// type propsFromRedux = ConnectedProps<typeof connector>

type AddPageProps = /* propsFromRedux  & */ {
  location: {
    pathname: string
  }
}

export default ({ location }: AddPageProps) => {
  return (
    <Layout location={location}>
      <Wrapper>
        <AddProject />
      </Wrapper>
    </Layout>
  )
}
