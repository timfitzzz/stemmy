import React, { useEffect, useState } from 'react'
import { Circle, Group, Layer, Line, Rect } from 'react-konva'

interface TracksDisplayPlayButton {
  playToggle: () => void
  isPlaying: () => boolean
  layerOffset: { x: number; y: number }
  height: number
  width: number
}

export function TracksDisplayPlayButton({
  playToggle,
  isPlaying,
  layerOffset,
  height,
  width,
}: TracksDisplayPlayButton) {
  const [playing, setPlaying] = useState<boolean>(isPlaying())

  let playPoints = [
    -width * 0.05,
    -height * 0.05,
    -width * 0.05,
    height * 0.05,
    width * 0.05,
    0,
  ]

  function handlePlayPause() {
    setPlaying(!playing)
    playToggle()
  }

  return (
    <Layer offset={layerOffset} onClick={handlePlayPause}>
      {playing ? (
        <Group onClick={handlePlayPause}>
          <Rect
            height={height * 0.3}
            width={width * 0.1}
            y={-(height * 0.3) / 2}
            x={-(width * 0.1) * 1.5}
            fill={'black'}
            stroke={'black'}
            strokeWidth={5}
            opacity={0.6}
          />
          <Rect
            height={height * 0.3}
            width={width * 0.1}
            y={-(height * 0.3) / 2}
            x={width * 0.05}
            fill={'black'}
            stroke={'black'}
            strokeWidth={5}
            opacity={0.6}
          />
        </Group>
      ) : (
        <Line
          closed={true}
          points={playPoints}
          x={0}
          y={0}
          color={'black'}
          fill={'black'}
          stroke={'black'}
          strokeWidth={20}
          onClick={handlePlayPause}
          opacity={0.6}
        ></Line>
      )}
    </Layer>
  )
}
