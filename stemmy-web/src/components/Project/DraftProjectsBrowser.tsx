import React, { useState, useEffect, ReactNode } from 'react'
import { useProjects } from '../../helpers'
import styled from 'styled-components'

import { Panel, PanelWrapper } from '../Panel'
import Project, { ProjectViews } from './Project'

interface IDraftProjectsPanel {
  children?: ReactNode[] | ReactNode
  onSelect: (projectId: string) => void
}

const DraftProjectsPanelWrapper = styled(PanelWrapper)`
  flex-direction: row;
`

const DraftProjectsPanel = styled(Panel)`
  flex-direction: column;
  padding: ${p => p.theme.spacing.unit}px;
  border-radius: 20px;
`

const DraftListTitle = styled.h5`
  margin-left: auto;
  margin-right: auto;
  margin-top: ${p => p.theme.spacing.unit}px;
  margin-bottom: ${p => p.theme.spacing.unit / 2}px;
`

const DraftListItemWrapper = styled.div<{ hover: boolean; selected: boolean }>`
  padding: ${p => p.theme.spacing.unit}px;
  margin-bottom: ${p => p.theme.spacing.unit}px;
  ${p =>
    p.hover && !p.selected
      ? `
    border: 2px solid ${p.theme.global.colors.lightPrimary};
    border-radius: ${p.theme.spacing.unit}px;
    color: ${p.theme.global.colors.lightPrimary};
    background-color: ${p.theme.global.colors.darkPrimary};
  `
      : `
    border: 2px solid transparent;
    border-radius: ${p.theme.spacing.unit}px;
    color: ${p.theme.global.colors.lightPrimary};
    background-color: ${p.theme.global.colors.darkPrimary};
  `}
  ${p =>
    p.selected &&
    `
    color: ${p.theme.global.colors.darkPrimary};
    background-color: ${p.theme.global.colors.lightPrimary};
  `}

  &:first-of-type {
    margin-top: ${p => p.theme.spacing.unit}px;
  }

  &:last-of-type {
    margin-bottom: 0px;
  }
`

const DraftProjectsBrowser = function({
  children,
  onSelect,
}: IDraftProjectsPanel) {
  const { projects } = useProjects({ type: 'drafts' })
  const [hover, setHover] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(0)

  function handleSelect(i: number) {
    setSelected(i)
    if (projects && projects[i] && projects[i].id) {
      onSelect(projects[i].id!)
    }
  }

  return (
    <DraftProjectsPanelWrapper>
      <DraftProjectsPanel>
        {children}
        <DraftListTitle>Drafts</DraftListTitle>
        {projects &&
          projects.map((project, i) => (
            <DraftListItemWrapper
              onMouseOver={() => setHover(i)}
              hover={hover === i ? true : false}
              onClick={e => handleSelect(i)}
              selected={selected === i ? true : false}
              key={'draftListItem' + i}
            >
              <Project projectId={project.id} view={ProjectViews.basicList} />
            </DraftListItemWrapper>
          ))}
      </DraftProjectsPanel>
    </DraftProjectsPanelWrapper>
  )
}

export default DraftProjectsBrowser
