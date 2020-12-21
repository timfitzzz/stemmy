import TrackDisplay from './TrackDisplay'


// helpers for drawing tracks
export function getCirclePoint(degrees: number, radius: number) {
  degrees = degrees - 90
  return {
    x: Math.cos((degrees * Math.PI) / 180) * radius,
    y: Math.sin((degrees * Math.PI) / 180) * radius,
  }
}


export default TrackDisplay
