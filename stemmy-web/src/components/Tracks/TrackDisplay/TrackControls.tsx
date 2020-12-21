import React, { useMemo } from 'react'
import { Layer, Rect, Image } from 'react-konva'
import useImage from 'use-image'
const forwardBlack = require('../../../images/forward-black.svg') as string
const reverseGreen = require('../../../images/reverse-green.svg') as string
import mainTheme from '../../../styles/theme'

interface ItrackControls {
  height: number
  width: number
  toggleReverse: () => void
  reverse: boolean
}

export function TrackControls({
  height,
  width,
  toggleReverse,
  reverse,
}: ItrackControls) {
  let center = useMemo(() => {
    return {
      x: width / 2,
      y: height / 2,
    }
  }, [width, height])

  let layerOffset: { x: number; y: number } = {
    x: -Math.abs(center.x),
    y: -Math.abs(center.y),
  }

  const [fwdImage, fwdImageStatus] = useImage(forwardBlack)
  const [revImage, revImageStatus] = useImage(reverseGreen)

  return (
    <Layer offset={layerOffset}>
      {/* Upper-left */}
      <Rect
        cornerRadius={2} // strokeWidth={3}
        // stroke={mainTheme.palette.midPrimary}
        height={height / 2 - 2}
        width={width / 2 - 2}
        x={-width / 2 + 2}
        y={-height / 2 + 2}
        fillEnabled
        fill={mainTheme.palette.lightPrimary}
        onClick={e => toggleReverse()}
      />
      {reverse ? (
        <Image
          image={revImage}
          x={-width / 2 + 2 + (height / 2 - 2) / 30}
          y={-height / 2 + 2 + (height / 2 - 2) / 30}
          height={(height / 2 - 2) / 4}
          width={(width / 2 - 2) / 4}
          onClick={e => toggleReverse()}
        />
      ) : (
        <Image
          image={fwdImage} // width={(height/2 - 2) / 3}
          // height={(height/2 - 2) / 3}
          x={-width / 2 + 2 + (height / 2 - 2) / 30}
          y={-height / 2 + 2 + (height / 2 - 2) / 30}
          height={(height / 2 - 2) / 4}
          width={(width / 2 - 2) / 4}
          onClick={e => toggleReverse()} // x={-width/2 + 4}
          // y={-height/2 + 4}
          // stroke={'black'}
        />
      )}
      {/* Upper-right */}
      <Rect
        cornerRadius={2} // strokeWidth={3}
        // stroke={mainTheme.palette.midPrimary}
        height={height / 2 - 2}
        width={width / 2 - 2}
        x={0}
        y={-height / 2 + 2}
        fillEnabled
        fill={mainTheme.palette.lightPrimary}
      />
      {/* Lower-left */}
      <Rect
        cornerRadius={2} // strokeWidth={3}
        // stroke={mainTheme.palette.midPrimary}
        height={height / 2 - 2}
        width={width / 2 - 2}
        x={-width / 2 + 2}
        y={0}
        fillEnabled
        fill={mainTheme.palette.lightPrimary}
      />
      {/* Lower-right */}
      <Rect
        cornerRadius={2} // strokeWidth={3}
        // stroke={mainTheme.palette.midPrimary}
        height={height / 2 - 2}
        width={width / 2 - 2}
        x={0}
        y={0}
        fillEnabled
        fill={mainTheme.palette.lightPrimary}
      />
    </Layer>
  )
}
