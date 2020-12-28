import { useMemo } from 'react'
import { Coordinates } from '.'

export interface IuseCenter {
  height: number
  width: number
}

export interface OuseCenter {
  center: Coordinates
  layerOffset: Coordinates
}

export const useCenter = ({ height, width }: IuseCenter) => {
  let center: Coordinates = useMemo(() => ({ x: width / 2, y: height / 2 }), [
    width,
    height,
  ])

  let layerOffset: Coordinates = useMemo(
    () => ({ x: -Math.abs(center.x), y: -Math.abs(center.y) }),
    [center]
  )

  return {
    center,
    layerOffset,
  }
}
