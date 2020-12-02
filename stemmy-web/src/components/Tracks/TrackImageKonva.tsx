import React, { useEffect, useMemo, useState } from 'react';
import { Stage, Layer, Line, Text, Circle, Arrow, Rect, Image } from 'react-konva'
import mainTheme from '../../styles/theme';
const forwardBlack = require('../../images/forward-black.svg') as string;
const reverseGreen = require('../../images/reverse-green.svg') as string;
import useImage from 'use-image';
import { Player, ToneAudioBuffer } from 'tone';

interface ITrackImageKonva {
  audioBuffer: ToneAudioBuffer
  entityPlayer: Player
  currentPlayhead: number
  toggleReverse: () => void
  width: number
  height: number
  volume: number
  outerMargin: number
  innerMargin: number
}

export default ({audioBuffer, entityPlayer, toggleReverse, currentPlayhead, width, height, volume, outerMargin, innerMargin}: ITrackImageKonva) => {

  let center = useMemo(() => {
    return {
      x: width/2,
      y: height/2 
    }
  }, [width, height])

  const [fwdImage, fwdImageStatus] = useImage(forwardBlack)
  const [revImage, revImageStatus] = useImage(reverseGreen)

  let outerRadius = useMemo(() => (height / 2) - (outerMargin as number), [height])
  let innerRadius = useMemo(() => (innerMargin as number), [height])
  let drawAreaHeight = outerRadius - innerRadius
  let zeroRadius = innerRadius + drawAreaHeight/2

  // console.log(`
  //   outerRadius: ${outerRadius}
  //   innerRadius: ${innerRadius}
  //   draw area height: ${drawAreaHeight}
  //   zero radius: ${zeroRadius}
  // `);


  let circumferencePixels = useMemo(() => {
    return 2*Math.PI*zeroRadius
  }, [center])

  let samplesPerPixel = useMemo(() => {
    return audioBuffer.getChannelData(0).length / circumferencePixels
  }, [circumferencePixels])

  let segments: {min: number, max: number}[] = useMemo(() => {
    let s: {min: number, max: number}[] = []
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      let channelData = audioBuffer.getChannelData(i)
      for (let z = 0; z < circumferencePixels; z++) {
        var min = 1.0;
        var max = -1.0;
        let segment = channelData.slice(z * samplesPerPixel, z * samplesPerPixel + samplesPerPixel)
        segment.forEach((datum) => {
          if (datum < min) {
            min = datum;
          } else if (datum > max) {
            max = datum;
          }
        })
        
        s[z] = { min, max }
      }
    }
    return s
  }, [samplesPerPixel])

  function getCirclePoint(degrees: number, radius: number) {
    degrees = degrees - 90
    return {
      x: Math.cos(degrees * Math.PI / 180) * radius,
      y: Math.sin(degrees * Math.PI / 180) * radius
    }
  }

  function getSegmentMinXY(segmentIndex: number, segmentMin: number): {x: number, y: number} {
    let segmentInnerRadius = zeroRadius + segmentMin*(drawAreaHeight)
    return getCirclePoint((360 / segments.length) * (segmentIndex + 1), segmentInnerRadius)
  }

  function getSegmentMaxXY(segmentIndex: number, segmentMax: number): {x: number, y: number} {
    let segmentOuterRadius = zeroRadius + segmentMax*(drawAreaHeight)
    return getCirclePoint((360 / segments.length) * (segmentIndex + 1), segmentOuterRadius)
  }

  function getShadowOffset(): { x: number, y: number } {
    let justBehindPlayhead = getCirclePoint(playHeadDegrees + 2 , zeroRadius)
    let result = {
      x: playheadZeroX - justBehindPlayhead.x,
      y: playheadZeroY - justBehindPlayhead.y
    }
    return result;
  }

  let playHeadDegrees = currentPlayhead * 360

  let { x: playheadTopX, y: playheadTopY } = getCirclePoint(playHeadDegrees, outerRadius + 4)
  let { x: playheadZeroX, y: playheadZeroY } = getCirclePoint(playHeadDegrees, zeroRadius)
  let { x: playheadBottomX, y: playheadBottomY } = getCirclePoint(playHeadDegrees, innerRadius)
  let { x: playheadShadowOffsetX, y: playheadShadowOffsetY } = getShadowOffset()

  return (
    <Stage width={width} height={height}>
      {/* Corner controls layer*/}
      <Layer offset={{x: -Math.abs(center.x), y: -Math.abs(center.y)}}>
        {/* Upper-left */}
        <Rect cornerRadius={2} 
          // strokeWidth={3} 
          // stroke={mainTheme.palette.midPrimary} 
          height={height/2 - 2} 
          width={width/2 - 2} 
          x={-width/2 + 2} 
          y={-height/2 + 2} 
          fillEnabled 
          fill={mainTheme.palette.lightPrimary}
          onClick={(e) => toggleReverse()}
        />
        { entityPlayer.reverse ? (
          <Image image={revImage}
            x={(-width/2 +2) + ((height/2 -2) / 30)}
            y={(-height/2 +2 ) + ((height/2 -2) / 30)}
            height={(height/2 - 2) / 4} 
            width={(width/2 - 2) / 4}
            onClick={(e) => toggleReverse()} 
          />
        ) : (
          <Image image={fwdImage}
            // width={(height/2 - 2) / 3}
            // height={(height/2 - 2) / 3}
            x={(-width/2 +2) + ((height/2 -2) / 30)}
            y={(-height/2 +2 ) + ((height/2 -2) / 30)}
            height={(height/2 - 2) / 4} 
            width={(width/2 - 2) / 4}
            onClick={(e) => toggleReverse()} 
            // x={-width/2 + 4} 
            // y={-height/2 + 4} 
            // stroke={'black'}
          />
        )}
        {/* Upper-right */}
        <Rect cornerRadius={2} 
          // strokeWidth={3} 
          // stroke={mainTheme.palette.midPrimary} 
          height={height/2 - 2} 
          width={width/2 - 2} 
          x={0} 
          y={-height/2 + 2} 
          fillEnabled 
          fill={mainTheme.palette.lightPrimary}
        />
        {/* Lower-left */}
        <Rect cornerRadius={2} 
          // strokeWidth={3} 
          // stroke={mainTheme.palette.midPrimary} 
          height={height/2 - 2} 
          width={width/2 - 2} 
          x={-width/2 + 2} 
          y={0} 
          fillEnabled 
          fill={mainTheme.palette.lightPrimary}
        />
        {/* Lower-right */}
        <Rect cornerRadius={2} 
          // strokeWidth={3} 
          // stroke={mainTheme.palette.midPrimary} 
          height={height/2 - 2} 
          width={width/2 - 2} 
          x={0} 
          y={0} 
          fillEnabled 
          fill={mainTheme.palette.lightPrimary}
        />
      </Layer>
      <Layer offset={{x: -Math.abs(center.x), y: -Math.abs(center.y)}}>
        <Circle 
          x={0} 
          y={0} 
          radius={height/2} 
          fillEnabled 
          fill={'white'}
          // strokeWidth={1}
          // opacity={1}
          // stroke={mainTheme.palette.midPrimary} 
        />
      </Layer>

      <Layer offset={{x: -Math.abs(center.x), y: -Math.abs(center.y)}}>
        { segments.map((segment, i) => {
            let startXY = getSegmentMinXY(i, segment.min * volume)
            let endXY = getSegmentMaxXY(i, segment.max * volume)
            // console.log(startXY, endXY)
            let line = (
              <Line 
              points={[startXY.x, startXY.y, endXY.x, endXY.y]}
              stroke={'black'}
              opacity={0.6}
              strokeWidth={1}
              open
            />
            )
            return line;
          }
        )}
      </Layer>
      <Layer offset={{x: -Math.abs(center.x), y: -Math.abs(center.y)}}>
        <Line 
          points={[playheadTopX, playheadTopY, playheadBottomX, playheadBottomY]} 
          strokeWidth={1} stroke={mainTheme.palette.darkPrimary} 
          fillEnabled 
          fill={mainTheme.palette.lightPrimary} 
          opacity={1} 
          // shadowOffset={{x: playheadBottomX - playheadShadowOffsetX, y: playheadTopX - playheadShadowOffsetY}}
          shadowColor={mainTheme.palette.midPrimary}
          shadowOffsetX={playheadShadowOffsetX}
          shadowOffsetY={playheadShadowOffsetY}
          shadowBlur={1}
        />
        {/* <Arrow pointerLength={5} points={[playheadX, playheadY, playheadEndX, playheadEndY]} fillEnabled fill={mainTheme.palette.lightPrimary} opacity={1} zIndex={2} /> */}
        {/* <Circle radius={2} x={playheadX} y={playheadY} fillEnabled /> */}
      </Layer>
    </Stage>
  )

}