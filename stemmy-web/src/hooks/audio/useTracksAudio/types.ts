import { Player, ToneAudioBuffer } from 'tone'
import { TrackProps, LoopProps } from '../../../types'

export enum IuseTracksAudioModes {
  buffer = 'buffer',
  player = 'player',
  display = 'display',
  setPlayback = 'setPlayback',
}

export interface IuseTracksAudio {
  ids?: string[]
  projectId?: string
  modules?: IuseTracksAudioModes[]
  debug?: boolean
  setPlayback?: boolean
}

export interface OuseTracksAudio {
  tracks: TrackProps[] | undefined
  entities: LoopProps[] | undefined
  sourceBuffers: { [key: string]: ToneAudioBuffer }
  entityPlayers: { [key: string]: Player }
  fullyLoaded: boolean
  getSegments: (segmentCount: number) => { max: number; min: number }[][] | null
  getLongest: () => number
  getVolume: (entityId: string) => number | null
  volumeUp: (entityId: string) => void
  volumeDown: (entityId: string) => void
  getGain: (entityId: string) => number
}

export interface useTracksAudioState {
  callbacks: {
    [key: string]: () => void
  }
}

export type useTracksReducerActions =
  | { type: 'storeCallback'; entityId: string; callback: () => void }
  | { type: 'clearCallback'; entityId: string }
