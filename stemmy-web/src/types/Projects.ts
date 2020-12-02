import { audioEntityTypes } from '.'

export abstract class ProjectClockSettings {
  BPM?: number
  BPMIsGuessed?: boolean
  beatsPerBar?: number
  length?: number
  lengthIsSet?: boolean
  multiplier?: number
  originalBPM?: number
}

export abstract class ProjectProps {
  id?: string
  tracks?: string[]
  clock?: ProjectClockSettings
  name?: string
  draft?: boolean
}

export abstract class ProjectTrackProps {
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
