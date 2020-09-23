import React, { MouseEvent, useState } from 'react'
import styled from 'styled-components'
import ProjectFormFields from './ProjectFormFields'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AddProjectSplitWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 800px;
  border: 5px solid ${p => p.theme.palette.lightPrimary};
  border-radius: 20px;
  position: relative;
`

const AddProjectFormFieldsWrapper = styled.div`
  padding: 10px;
  width: 100%;
  height: 100%;
`

const AddProjectSplitBorder = styled.div`
  height: 100%;
  width: 2px;
  background: ${p => p.theme.palette.lightPrimary};
`
const AddProjectTracksListWrapper = styled.div`
  padding: 10px;
  width: 100%;
  min-height: 100%;
`

const HoverOverlay = styled.div`
  position: absolute;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  background-color: ${p => p.theme.palette.midPrimary};
  p {
    z-index: 10;
    color: ${p => p.theme.palette.darkPrimary};
    font-weight: 600;
    font-size: 1.5em;
    margin-bottom: 0;
  }
`

const HoverDisplay = () => (
  <HoverOverlay>
    <p>Release to import</p>
  </HoverOverlay>
)

export default () => {
  const [hover, setHover] = useState(false)
  const [dragTarget, setDragTarget] = useState<HTMLElement>()

  function handleDragEnter(event: MouseEvent<HTMLElement>): void {
    if (dragTarget) {
      return
    } else {
      console.log('dragenter is new target: ', event.currentTarget)
      setHover(true)
      setDragTarget(event.currentTarget)
    }
  }

  function handleDragLeave(event: MouseEvent<HTMLElement>): void {
    if (dragTarget === event.currentTarget) {
      console.log('left current target: ', event.currentTarget)
      setHover(false)
      setDragTarget(undefined)
    } else {
      console.log('left other target: ', event.currentTarget)
      return
    }
  }

  return (
    <Wrapper onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
      <AddProjectSplitWrapper>
        {hover && <HoverDisplay />}
        <AddProjectFormFieldsWrapper>
          <ProjectFormFields fields={{}} />
        </AddProjectFormFieldsWrapper>
        <AddProjectSplitBorder />
        <AddProjectTracksListWrapper />
      </AddProjectSplitWrapper>
    </Wrapper>
  )
}
