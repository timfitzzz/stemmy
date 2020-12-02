import React from 'react'
import { TrackProps } from '../../../types';
import styled from 'styled-components';

interface IProjectBasicView {
  id: string,
  name: string,
  tracks: TrackProps[],
  draft: boolean
}

const BasicListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const BasicListRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${p => p.theme.spacing.unit/2}px;

  &:last-of-type {
    margin-bottom: 0px;
  }
`

const BasicListTitle = styled.span`
  font-size: 1em;
  font-weight: 700;
  line-height: 1em;
`

const BasicListDraftTag = styled.span`
  font-size: 0.9em;
  text-transform: uppercase;
`

const BasicListInfo = styled.div`
  font-size: 0.9em;
`

const BasicListInfoDesc = styled.span`
  margin-right: 5px;
`

const BasicListInfoData = styled.span`
`

export default ({id, name, tracks, draft}: IProjectBasicView) => {

  console.log(id, name, tracks, draft )

  return (
    <BasicListWrapper>
      <BasicListRow>
        <BasicListTitle>{name}</BasicListTitle>
        {draft && 
        <BasicListDraftTag>
          Draft
        </BasicListDraftTag>
        }
      </BasicListRow>
      <BasicListRow>
        <BasicListInfo>
          <BasicListInfoDesc>Stems</BasicListInfoDesc>
          <BasicListInfoData>{tracks && tracks.length}</BasicListInfoData>
        </BasicListInfo>
      </BasicListRow>
    </BasicListWrapper>
  )
}