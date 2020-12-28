import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TrackIOError } from '../../store/tracks/types'
import {
  tracksErrorSelector,
  tracksLoadingSelector,
} from '../../helpers/selectors'
import { createDesiredTracksSelector } from '../../helpers/selectors'
import { TrackProps } from '../../types'
import { getTrack } from '../../store/tracks/actions'

export interface IuseTracks {
  trackIds: string[] | null
  count: number | null
}

export interface OuseTracks {
  tracks: TrackProps[] | null
  errors: TrackIOError[] | null
}

export const useTracks = ({ trackIds, count }: IuseTracks): OuseTracks => {
  const dispatch = useDispatch()

  const tracksSelector = useMemo(() => createDesiredTracksSelector(trackIds), [
    trackIds,
  ])
  const tracks: TrackProps[] | null = useSelector(tracksSelector)
  const tracksLoading: string[] | null = useSelector(tracksLoadingSelector)
  const tracksErrors: TrackIOError[] | null = useSelector(tracksErrorSelector)

  const isTrackLoading = useMemo(
    () => (id: string) => {
      return !(tracksLoading.indexOf(id) === -1)
    },
    [tracksLoading]
  )

  const getTrackErrors = useMemo(
    () => (id: string) => tracksErrors.filter(t => t.id === id),
    [tracksErrors]
  )

  useEffect(() => {
    if (
      trackIds &&
      count &&
      trackIds.length === count &&
      tracks &&
      tracks.length < count
    ) {
      trackIds.forEach(id => {
        if (
          !isTrackLoading(id) &&
          getTrackErrors(id).length === 0 &&
          tracks.filter(e => e.id === id).length === 0
        ) {
          dispatch(getTrack(id))
        }
      })
    }
  }, [trackIds, tracksErrors])

  return {
    tracks,
    errors:
      trackIds && tracksErrors.filter(e => trackIds.indexOf(e.id || '') > -1),
  }
}
