import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

interface IHeadingProps {
  title: string
  subtitle: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  color: white;
  width: 100%;
`

const Title = styled.h1`
  margin-top: 2px;
  margin-bottom: 1px;
`

const Subtitle = styled.p`
  margin-top: 2px;
`

export default (props: IHeadingProps) => {
  const { title, subtitle } = props
  return (
    <Wrapper>
      <Title>
        <Link to="/">{title}</Link>
      </Title>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  )
}
