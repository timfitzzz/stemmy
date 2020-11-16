import React, { MouseEvent, useState } from 'react'
import { ProjectActionTypes } from '../../store/projects'
import { ProjectProps } from '../../types'
import styled from 'styled-components'
import ProjectFormFields from './ProjectFormFields'
import { SaveProjectAction } from '../../store/projects/types'

import { BigButton } from '../Buttons'

import TracksEditor from './ProjectEditor/TracksEditor'
import BlankProjectCreator from './BlankProjectCreator'

const AddProjectWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: row;
  /* border: 5px solid ${p => p.theme.palette.midPrimary}; */
  padding-top: ${p => p.theme.spacing.unit}px;
  border-radius: 10px;
  height: 475px;
`

const VerticalMenu = styled.div`
  width: 120px;
  min-width: 120px;
  max-width: 120px;

  display: flex;
  flex-direction: column;
`
interface IVerticalMenuItem {
  act: boolean
}

const VerticalMenuItem = styled(BigButton)<IVerticalMenuItem>`
  height: 100px;
  background-color: ${p =>
    p.act ? p.theme.palette.lightPrimary : p.theme.palette.darkPrimary};
  border-color: ${p =>
    p.act ? p.theme.palette.midPrimary : p.theme.palette.lightPrimary};
  align-content: center;
  vertical-align: middle;
  margin-top: 0px;
  margin-bottom: ${p => p.theme.spacing.unit}px;
  margin-right: ${p => p.theme.spacing.unit}px;
  margin-left: 0px;

  > span {
    margin: auto auto;
    color: ${p =>
      p.act ? p.theme.palette.darkPrimary : p.theme.palette.lightPrimary};
  }
`

export default ({}) => {
  enum addMethods {
    'loopy',
    'web',
  }

  let [mode, setMode] = useState(addMethods.web)

  return (
    <AddProjectWrapper>
      <VerticalMenu>
        <VerticalMenuItem
          act={mode === addMethods.web}
          handler={() => setMode(addMethods.web)}
          text={'Start with Blank Project'}
        />
        <VerticalMenuItem
          act={mode === addMethods.loopy}
          handler={() => setMode(addMethods.loopy)}
          text={'Import from Loopy'}
        />
      </VerticalMenu>
      {
        {
          0: <div></div>,
          1: <BlankProjectCreator />,
        }[mode]
      }
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
