import { audioEntityTypes, AudioEntityProps } from '.'

export interface TrackProps {
  id?: string
  projectId?: string
  entityType?: audioEntityTypes
  entityId?: string
  pan?: number
  playing?: boolean
  reverse?: boolean
  scale?: number
  synchronize?: boolean
  volume?: number
}

export interface trackBundle {
  track: TrackProps
  audioEntity?: AudioEntityProps
}
