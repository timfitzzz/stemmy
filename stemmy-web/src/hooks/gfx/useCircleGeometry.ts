import { useMemo } from 'react'
import { Coordinates } from '.'
import { OuseCenter, useCenter } from './useCenter'

interface IuseCircleGeometry {
  height: number
  width: number
  outerMargin: number
  innerMargin: number
}

export interface OuseCircleGeometry {
  center: Coordinates
  layerOffset: Coordinates
  outerRadius: number
  innerRadius: number
  drawAreaHeight: number
  zeroRadius: number
  circumferencePixels: number
}

export const useCircleGeometry = ({
  height,
  width,
  outerMargin,
  innerMargin,
}: IuseCircleGeometry) => {
  const { center, layerOffset }: OuseCenter = useCenter({ width, height })

  const outerRadius = useMemo(() => height / 2 - (outerMargin as number), [
    height,
  ])

  const innerRadius = useMemo(() => innerMargin as number, [innerMargin])

  const drawAreaHeight = useMemo(() => outerRadius - innerRadius, [
    outerRadius,
    innerRadius,
  ])

  const zeroRadius = useMemo(() => innerRadius + drawAreaHeight / 2, [
    innerRadius,
    drawAreaHeight,
  ])

  const circumferencePixels = useMemo(() => 2 * Math.PI * zeroRadius, [
    layerOffset,
    zeroRadius,
  ])

  return {
    center,
    layerOffset,
    outerRadius,
    innerRadius,
    drawAreaHeight,
    zeroRadius,
    circumferencePixels,
  }
}
