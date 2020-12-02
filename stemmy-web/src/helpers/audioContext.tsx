import React, {
  Consumer,
  Context,
  createContext,
  Provider,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ProjectClockSettings } from '../types'
import { BaseContext, Destination, Gain, getContext, getTransport, Player, ToneAudioBuffer, ToneAudioNode } from 'tone'
import { Transport } from 'tone/build/esm/core/clock/Transport'
import { Tone } from 'tone/build/esm/core/Tone'

// export enum TransportStatus {
//   Project = "Project",
//   Transition = "Transition"
// }

export interface ITransportState {
  // status: TransportStatus | null;
  currentProjectId: string | null;
  nextProjectId: string | null;
}

export type IContextForAudio = {
  Transport: Transport | null
  audioCtx: BaseContext | null
  transportState: ITransportState | null
  masterGainNode: Gain<"gain">
  entityPlayers: {
    [key: string]: Player
  }
  entitySourceBuffers: {
    [key: string]: ToneAudioBuffer
  }
  // entityGainNodes: {
  //   [key: string]: ToneAudioNode<Gain>
  // }
  upsertEntityPlayer: (id: string, player: Player) => void
  upsertSourceBuffer: (id: string, toneAudioBuffer: ToneAudioBuffer) => void
  // upsertEntityGain: (id: string, gainNode: ToneAudioNode<Gain>) => void
  getEntityPlayer: (id: string) => Player
  getSourceBuffer: (id: string) => ToneAudioBuffer
  // getEntityGain: (id: string) => ToneAudioNode<Gain>
  clearEntityPlayer: (id: string) => void
  // setTransportState: ({ status, currentProjectId, nextProjectId}: ITransportState) => void
  setCurrentProject: (projectId: string) => void
  clearCurrentProject: () => void
  setNextProject: (projectId: string) => void
  isCurrentProject: (projectId: string) => boolean
  isNextProject: (projectId: string) => boolean
}

const defaultContextForAudioState: Partial<IContextForAudio> = {
  Transport: null,
  transportState: null,
  audioCtx: null,
  entityPlayers: {},
  entitySourceBuffers: {},
  // entityGainNodes: {},
}

interface IAudioProvider {
  children?: any
  contextState?: Partial<IContextForAudio>
}

const ContextForAudio = createContext<IContextForAudio | {}>(
  defaultContextForAudioState
)

export const AudioEngineProvider = ContextForAudio.Provider
export const AudioEngineConsumer = ContextForAudio.Consumer

export const AudioProvider = ({
  children,
  contextState = defaultContextForAudioState,
}: IAudioProvider) => {
  const [context, setContext] = useState(contextState)

  const upsertEntityPlayer = (id: string, player: Player) => {
    console.log('upserting entityPlayer ', player)
    setContext({
      ...context,
      entityPlayers: {
        ...context.entityPlayers,
        [id]: player,
      },
    })
  }


  const clearEntityPlayer = (id: string) => {
    const { [id]: nodeToClear, ...otherNodes } = context.entityPlayers!

    setContext({
      ...context,
      entityPlayers: {
        ...otherNodes,
      },
    })
  }

  const upsertSourceBuffer = (id: string, toneAudioBuffer: ToneAudioBuffer) =>
    setContext({
      ...context,
      entitySourceBuffers: {
        ...context.entitySourceBuffers,
        [id]: toneAudioBuffer,
      },
    })


  const getEntityPlayer = (id: string): Player | null =>
    context!.entityPlayers![id] || null

  const getSourceBuffer = (id: string): ToneAudioBuffer | null =>
    context!.entitySourceBuffers![id] || null

  const setTransportState = ({currentProjectId, nextProjectId}: Partial<ITransportState>): void => {
    if (context.transportState) {
      setContext({
        ...context,
        transportState: {
          currentProjectId: currentProjectId ? currentProjectId : context.transportState.currentProjectId,
          nextProjectId: nextProjectId ? nextProjectId : context.transportState.nextProjectId
        }
      })
    }
  }

  const clearCurrentProject = (): void => {
    if (context.transportState) {
      setContext({ 
        ...context, 
        transportState: { 
          currentProjectId: null, 
          nextProjectId: context.transportState.nextProjectId 
        }
      })
    }
  }

  const setCurrentProject = (projectId: string): void => 
    setTransportState({ currentProjectId: projectId})

  const setNextProject = (projectId: string): void => 
    setTransportState({ nextProjectId: projectId })

  const isCurrentProject = (projectId: string): boolean | null => 
    context.transportState ?
      context.transportState.currentProjectId === projectId 
      : null

  const isNextProject = (projectId: string): boolean | null => 
    context.transportState ?
      context.transportState.nextProjectId === projectId
      : null

  useEffect(() => {
    if (window) {
      let Transport = getTransport()
      let audioCtx = getContext()
      let masterGainNode = Destination.output

      console.log(audioCtx.lookAhead);

      setContext({
        ...context,
        Transport,
        masterGainNode,
        audioCtx,
      })
    }
  }, [])

  return (
    <AudioEngineProvider
      value={{
        ...context,
        upsertEntityPlayer,
        upsertSourceBuffer,
        // upsertEntityGain,
        getEntityPlayer,
        getSourceBuffer,
        // getEntityGain,
        clearEntityPlayer,
        setTransportState,
        setCurrentProject,
        clearCurrentProject,
        setNextProject,
        isCurrentProject,
        isNextProject
      }}
    >
      {children}
    </AudioEngineProvider>
  )
}

export default ContextForAudio
