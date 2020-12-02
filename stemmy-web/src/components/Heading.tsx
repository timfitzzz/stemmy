import { Link } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

interface IHeadingProps {
  title: string
  subtitle?: string
  link?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  color: white;
  width: 100%;
`

export const Title = styled.h1`
  margin-top: 2px;
  margin-bottom: 1px;
`

export const Subtitle = styled.p`
  margin-top: 2px;
`

export default ({ title, subtitle, link}: IHeadingProps) => {
  return (
    <Wrapper>
      <Title> 
        { link ? (
          <Link to={link}>{title}</Link>
        ) : title }
      </Title>
      <Subtitle>{subtitle}</Subtitle>
    </Wrapper>
  )
}
