import React, { ReactNode } from 'react'
import styled from 'styled-components'

const ProjectHeaderContainer = styled.div`
  height: 160px;
`

interface iProjectHeader {
  children: ReactNode[] | ReactNode
  className?: string
}

export const ProjectHeader = ({ children, className }: iProjectHeader) => {
  return (
    <ProjectHeaderContainer className={className}>
      {children}
    </ProjectHeaderContainer>
  )
}

export default ProjectHeader
