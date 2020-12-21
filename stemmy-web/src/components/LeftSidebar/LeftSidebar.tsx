import * as React from 'react'
import { graphql } from 'gatsby'
import styled from 'styled-components'
import Heading from '../Heading'

interface LeftSidebarProps {
  userName: string
  menuItems: []
  title: string
  subtitle: string
}

const Wrapper = styled.div`
  background: ${p => p.theme.palette.lightPrimary};
  padding-left: 15px;
  padding-top: 5px;
  padding-right: 15px;
  color: ${p => p.theme.palette.darkPrimary};
  border-right: 10px solid ${p => p.theme.palette.midPrimary};
  h1 {
    color: ${p => p.theme.palette.darkPrimary};
  }
`

export default ({ title, subtitle, userName, menuItems }: LeftSidebarProps) => {
  return (
    <Wrapper>
      <Heading title={title} subtitle={subtitle} link={'/'} />
      {userName || 'testUserName'}
      {menuItems}
    </Wrapper>
  )
}
