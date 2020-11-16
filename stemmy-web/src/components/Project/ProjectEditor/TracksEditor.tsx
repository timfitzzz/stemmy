import React, { DragEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getNewLoop } from '../../../store/loops/actions'
import styled from 'styled-components'
import HoverDisplay from '../../HoverDisplay'
import { addTrackAndEntityFromAudioFile } from '../../../store/crossoverActions'
import { audioEntityTypes } from '../../../types'
import { AudioEntitySources } from '../../../types'
import { Track } from '../../Tracks'

const TracksEditorWrapper = styled.div`
  padding: 0px;
  width: 100%;
  min-height: 100%;
  position: relative;
`

const TracksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

interface TracksEditorProps {
  trackIds: string[]
  projectId: string
}

export default ({ trackIds, projectId }: TracksEditorProps) => {
  const [hover, setHover] = useState(false)
  const [dragTarget, setDragTarget] = useState<HTMLElement>()
  const [dragCounter, setDragCounter] = useState<number>(0)

  const dispatch = useDispatch()

  // function getTracksStateSetter<T>(prop: ) {
  //   return (value: T) =>
  // }

  function handleAudioFile(event: DragEvent<HTMLElement>): void {
    let { files } = event.dataTransfer

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        dispatch(
          addTrackAndEntityFromAudioFile(
            [files[i], files[i].name],
            projectId,
            audioEntityTypes.Loop,
            AudioEntitySources.web
          )
        )
      }
    }
  }

  function handleDragEnter(event: DragEvent<HTMLElement>): void {
    setDragCounter(dragCounter + 1)
  }

  function handleDragLeave(event: DragEvent<HTMLElement>): void {
    setDragCounter(dragCounter - 1)
  }

  function handleDragOver(event: DragEvent<HTMLElement>): void {
    event.stopPropagation()
    event.preventDefault()
  }

  function handleDrop(event: DragEvent<HTMLElement>): void {
    event.preventDefault()
    setDragCounter(0)
    setHover(false)
    handleAudioFile(event)
  }

  useEffect(() => {
    if (dragCounter > 0) {
      setHover(true)
    } else {
      setHover(false)
    }
  }, [dragCounter])

  return (
    <TracksEditorWrapper
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {hover && (
        <HoverDisplay
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      )}
      <TracksWrapper>
        {trackIds &&
          trackIds.map(trackId => (
            <Track trackId={trackId} editing={true} perRow={3} />
          ))}
      </TracksWrapper>
    </TracksEditorWrapper>
  )
}
