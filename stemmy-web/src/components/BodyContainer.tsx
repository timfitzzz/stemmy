import React from 'react'
import styled from 'styled-components'
import TopBar from './TopBar'

interface BodyContainerProps {
  children: any
}

const Wrapper = styled.div`
  width: 100%;
`

export default ({ children }: BodyContainerProps) => {
  return (
    <Wrapper>
      <TopBar />
      {children}
    </Wrapper>
  )
}
