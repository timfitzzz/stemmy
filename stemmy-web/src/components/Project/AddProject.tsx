import React, { MouseEvent, useState } from 'react'
import { ProjectActionTypes } from '../../store/projects'
import { ProjectProps } from '../../types'
import styled from 'styled-components'
import ProjectFormFields from './ProjectFormFields'
import { SaveProjectAction } from '../../store/projects/types'

import { BigButton } from '../Buttons'

import TracksEditor from './ProjectEditor/TracksEditor'
import BlankProjectCreator from './BlankProjectCreator'
import DraftProjectsBrowser from './DraftProjectsBrowser'
import Heading from '../Heading'
import { Project } from '.'
import { ProjectViews } from './Project'

const AddProjectWrapper = styled.div`
  width: 100%;
  /* max-width: 800px; */
  display: flex;
  flex-direction: column;
  /* border: 5px solid ${p => p.theme.palette.midPrimary}; */
  padding-top: ${p => p.theme.spacing.unit}px;
  border-radius: 10px;
  height: 475px;
`

const AddProjectHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
`

const AddProjectHeading = styled(Heading)`
  color: ${p => p.theme.global.colors.midPrimary};
  margin-right: ${p => p.theme.spacing.unit}px;
  padding-right: ${p => p.theme.spacing.unit}px;
  > h1 {
    > a {
    text-decoration: none;
    }
  }
`

const AddProjectContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const LeftMenuPanel = styled.div`
  width: 300px;
  /* min-width: 300px;
  max-width: 300px; */

  display: flex;
  flex-direction: column;
`

const TopMenuPanel = styled.div`
  width: 500px;
  min-width: 500px;
  max-width: 500px;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  margin-bottom: auto;

`

const ProjectEditorContainer = styled.div`
`

interface IVerticalMenuItem {
  act: boolean
}

const PinnedListItem = styled(BigButton)<IVerticalMenuItem>`
  height: 50px;
  background-color: ${p =>
    p.act ? p.theme.palette.lightPrimary : p.theme.palette.darkPrimary};
  border-color: ${p =>
    p.act ? p.theme.palette.midPrimary : p.theme.palette.lightPrimary};
  align-content: center;
  vertical-align: middle;
  margin-bottom: ${p => p.theme.spacing.unit}px;
  margin-right: ${p => p.theme.spacing.unit}px;

  > span {
    margin: auto auto;
    color: ${p =>
      p.act ? p.theme.palette.darkPrimary : p.theme.palette.lightPrimary};
  }
  width: 24%;
  justify-content: space-between;
  border-width: 1px;
`

export default ({}) => {
  enum addMethods {
    'loopy',
    'web',
    'drafts',
  }

  let [mode, setMode] = useState(addMethods.drafts)
  let [selectedDraft, setSelectedDraft] = useState<string | null>(null)

  return (
    <AddProjectWrapper>
      <AddProjectHeader>
        <AddProjectHeading 
          title={'Add Project'} 
          subtitle={'Edit drafts, import, or start fresh'}
        />
        <TopMenuPanel>
          <PinnedListItem
            act={mode === addMethods.web}
            handler={() => setMode(addMethods.web)}
            text={'New Project'}
          />
          <PinnedListItem
            act={mode === addMethods.loopy}
            handler={() => setMode(addMethods.loopy)}
            text={'Import from Loopy'}
          />
        </TopMenuPanel>
      </AddProjectHeader>
      <AddProjectContentContainer>
        <LeftMenuPanel>
          <DraftProjectsBrowser onSelect={setSelectedDraft}/>
        </LeftMenuPanel>
        <ProjectEditorContainer>
          {selectedDraft && (
            <Project view={ProjectViews.editor} projectId={selectedDraft}/>
          )}
        </ProjectEditorContainer>
      </AddProjectContentContainer>

{/*         
      {
        {
          0: <div></div>,
          1: <BlankProjectCreator />,
          2: <DraftProjectsBrowser />
        }[mode]
      } */}
    </AddProjectWrapper>
  )
}

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
// `

// const AddProjectSplitWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   width: 100%;
//   max-width: 800px;
//   border: 5px solid ${p => p.theme.palette.lightPrimary};
//   border-radius: 20px;
//   position: relative;
//   align-items: stretch;
// `

// const AddProjectFormFieldsWrapper = styled.div`
//   padding: 10px;
//   width: 100%;
//   height: 100%;
// `

// const AddProjectSplitBorder = styled.div`
//   width: 2px;
//   background: ${p => p.theme.palette.lightPrimary};
// `
// const AddProjectTracksListWrapper = styled.div`
//   padding: 10px;
//   width: 100%;
//   min-height: 100%;
// `

// interface AddProjectsProps {
//   project: ProjectProps
//   saveProject: (project: ProjectProps) => void
//   upsertProject: (project: ProjectProps) => void
// }

// export default ({ project, upsertProject, saveProject }: AddProjectsProps) => {
//   return (
//     <Wrapper>
//       <AddProjectSplitWrapper>
//         <AddProjectFormFieldsWrapper>
//           <ProjectFormFields
//             project={project}
//             saveProject={saveProject}
//             upsertProject={upsertProject}
//           />
//         </AddProjectFormFieldsWrapper>
//         <AddProjectSplitBorder />
//         <TracksEditor trackIds={project.tracks!} projectId={project.id!} />
//       </AddProjectSplitWrapper>
//     </Wrapper>
//   )
// }
