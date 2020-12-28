import TrackDisplay from './TrackDisplay'

// helpers for drawing tracks

// find point in a circle
export function getCirclePoint(degrees: number, radius: number) {
  degrees = degrees - 90
  return {
    x: Math.cos((degrees * Math.PI) / 180) * radius,
    y: Math.sin((degrees * Math.PI) / 180) * radius,
  }
}

// get XY points for wav segment line (segmentVal would generally be the max/min)
export function getSegmentXY(
  segmentIndex: number,
  segmentVal: number,
  zeroRadius: number,
  drawAreaHeight: number,
  segmentCount: number
): { x: number; y: number } {
  let segmentPos = zeroRadius + segmentVal * drawAreaHeight
  return getCirclePoint((360 / segmentCount) * (segmentIndex + 1), segmentPos)
}

export default TrackDisplay
