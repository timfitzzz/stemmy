import React, { Context, useEffect, useRef, useState } from 'react'
import { Layer, Line } from 'react-konva';
import { useContextSelector } from 'react-use-context-selector';
import ContextForAudio, {} from '../../helpers/audioContext';
import { OAudioEngine } from '../../helpers/audioContext';
import mainTheme from '../../styles/theme';
import Konva from 'konva';

interface IPlayheadCoords {
  playheadTopX: number,
  playheadTopY: number,
  playheadZeroX: number,
  playheadZeroY: number,
  playheadBottomX: number,
  playheadBottomY: number,
  playheadShadowOffsetX: number,
  playheadShadowOffsetY: number,
}

interface ITrackKonvaPlayhead {
  trackLength: number,
  center: { x: number, y: number },
  getPlayheadCoords: (currentPlayhead: number) => () => IPlayheadCoords
}

const TrackKonvaPlayhead = ({trackLength, center, getPlayheadCoords}: ITrackKonvaPlayhead) => {

  let playheadRef = useRef<Konva.Line>(null)

  const movePlayhead = (coords: IPlayheadCoords) => {
    if (playheadRef && playheadRef.current) {

      playheadRef.current.to({
        duration: 0.064,
        points: [coords.playheadTopX, coords.playheadTopY, coords.playheadBottomX, coords.playheadBottomY],
        shadowOffsetX: coords.playheadShadowOffsetX,
        shadowOffsetY: coords.playheadShadowOffsetY
      })
    }
  }

  const getPlayheadLocation = (transportSeconds: number) => {
    return transportSeconds < trackLength ? transportSeconds / trackLength : (transportSeconds % trackLength) / trackLength;
  }

  const [timeCronNumber, setTimeCronNumber] = useState<number | null>(null)

  const transport = useContextSelector(ContextForAudio as Context<OAudioEngine>, value => value.transport)

  // const setPlayhead = (transportSeconds: number) => {
  //   let location = transportSeconds < trackLength ? transportSeconds / trackLength : (transportSeconds % trackLength) / trackLength;
  //   setCurrentPlayhead(getPlayheadCoords(location))
  // }

  const lineZeroCoords = getPlayheadCoords(getPlayheadLocation((transport && transport.seconds || 0)))()

  // console.log(timeCronNumber)
  
  useEffect(() => {
    // console.log('setting timecron')
    let timeCron = setInterval(() => {
        if (transport) {
          // console.log('setting playhead ', transport.seconds, getPlayheadLocation(transport.seconds))
          movePlayhead(getPlayheadCoords(getPlayheadLocation(transport.seconds))())
        }
      }, 64);

      setTimeCronNumber(timeCron)
  
      return(() => {
        // console.log('clearing timeout')
        clearTimeout(timeCron);
      })
  
  }, [])

  return (
    <Layer offset={{x: -Math.abs(center.x), y: -Math.abs(center.y)}}>
      <Line 
        ref={playheadRef}
        points={[lineZeroCoords.playheadTopX, lineZeroCoords.playheadTopY, lineZeroCoords.playheadBottomX, lineZeroCoords.playheadBottomY]} 
        strokeWidth={1} stroke={mainTheme.palette.darkPrimary} 
        fillEnabled 
        fill={mainTheme.palette.lightPrimary} 
        opacity={1} 
        // shadowOffset={{x: playheadBottomX - playheadShadowOffsetX, y: playheadTopX - playheadShadowOffsetY}}
        shadowColor={mainTheme.palette.midPrimary}
        shadowOffsetX={lineZeroCoords.playheadShadowOffsetX}
        shadowOffsetY={lineZeroCoords.playheadShadowOffsetY}
        shadowBlur={1}
      />
      {/* <Arrow pointerLength={5} points={[playheadX, playheadY, playheadEndX, playheadEndY]} fillEnabled fill={mainTheme.palette.lightPrimary} opacity={1} zIndex={2} /> */}
      {/* <Circle radius={2} x={playheadX} y={playheadY} fillEnabled /> */}
      </Layer>
  )

}

TrackKonvaPlayhead.whyDidYouRender = true;

export default TrackKonvaPlayhead