import React, { DragEvent } from 'react'
import styled from 'styled-components'

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
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  p {
    z-index: 10;
    color: ${p => p.theme.palette.darkPrimary};
    font-weight: 600;
    font-size: 1.5em;
    margin-bottom: 0;
  }
`

interface HoverDisplayProps {
  onDrop: (event: DragEvent<HTMLElement>) => void
  onDragLeave: (event: DragEvent<HTMLElement>) => void
  onDragOver: (event: DragEvent<HTMLElement>) => void
}

const HoverDisplay = ({
  onDragLeave,
  onDrop,
  onDragOver,
}: HoverDisplayProps) => (
  <HoverOverlay
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    onDragOver={onDragOver}
  >
    <p onDragOver={onDragOver} onDragLeave={onDragLeave}>
      Release to import
    </p>
  </HoverOverlay>
)

export default HoverDisplay
