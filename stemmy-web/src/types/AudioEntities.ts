export enum audioEntityTypes {
  Loop,
}

export enum AudioEntitySources {
  'loopyhd',
  'web',
  'unset',
}

export enum PngShapes {
  'round',
  'flat',
}

export interface png {
  shape: PngShapes
  size: number
  path: string
}

export interface AudioEntityProps {
  id?: string
  fileName?: string
  pngs?: png[]
  source?: AudioEntitySources
  audioData?: any
}

export interface LoopProps extends AudioEntityProps {
  originalProjectId?: string
  decay?: number
  loopStartTime?: number
  originalLoopStartTime?: number
  originalScale?: number
}
