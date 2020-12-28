import { useMemo } from 'react'
import { TrackProps } from '../../types'

interface IuseLoopIds {
  tracks: TrackProps[] | null
  count: number | null
}

export const useLoopIds = ({ tracks, count }: IuseLoopIds) => {
  const loopIds: string[] | null = useMemo(() => {
    if (tracks && count && tracks.length === count) {
      return tracks
        .map(track => (track.entityId ? track.entityId : null))
        .filter(eid => !!eid) as string[]
    } else {
      return null
    }
  }, [tracks, count])

  return loopIds
}
