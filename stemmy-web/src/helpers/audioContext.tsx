import React, {
  Consumer,
  Context,
  createContext,
  Provider,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { ProjectClockSettings } from '../types'
import { BaseContext, Gain, getContext, getTransport, Player, ToneAudioBuffer, ToneAudioNode } from 'tone'
import { Transport } from 'tone/build/esm/core/clock/Transport'
import Tone from 'tone'
import { createSelectorProvider, useContextSelector } from 'react-use-context-selector';
import { Destination } from 'tone'

export interface ITransportState {
  // status: TransportStatus | null;
  currentProjectId: string | null;
  nextProjectId: string | null;
}

export interface AudioLibraryState {
  entityPlayers: {
    [key: string]: Player
  }
  entitySourceBuffers: {
    [key: string]: ToneAudioBuffer
  }
  transportState: ITransportState
}

const defaultAudioLibraryState: AudioLibraryState = {
  transportState: {
    currentProjectId: null,
    nextProjectId: null
  },
  entityPlayers: {},
  entitySourceBuffers: {},
}

export type OAudioEngine = {
  dispatch: React.Dispatch<AudioLibraryActions>
                                                      transport: Transport | null
                                                      // audioCtx: BaseContext | null
  transportState: ITransportState | null
                                                      // masterGainNode: Gain<"gain">
  entityPlayers: {
    [key: string]: Player
  }
  entitySourceBuffers: {
    [key: string]: ToneAudioBuffer
  }
  
                                                        // entityGainNodes: {
                                                        //   [key: string]: ToneAudioNode<Gain>
                                                        // }
  upsertEntityPlayer: (entityId: string, player: Player) => void
  upsertSourceBuffer: (entityId: string, toneAudioBuffer: ToneAudioBuffer) => void
                                                        // upsertEntityGain: (id: string, gainNode: ToneAudioNode<Gain>) => void
  getEntityPlayer: (entityId: string) => Player
  getSourceBuffer: (entityId: string) => ToneAudioBuffer
                                                        // getEntityGain: (id: string) => ToneAudioNode<Gain>
  clearEntityPlayer: (entityId: string) => void
                                                        // setTransportState: ({ status, currentProjectId, nextProjectId}: ITransportState) => void
  setCurrentProject: (projectId: string) => void
  clearCurrentProject: () => void
  setNextProject: (projectId: string) => void
  isCurrentProject: (projectId: string) => boolean
  isNextProject: (projectId: string) => boolean
  isAudioReady: () => boolean
  queuePlayback: (entityId: string, time?: string) => () => void | null
  unqueuePlayback: (entityId: string, scheduleId: number) => void
  startTransport: () => void
  stopTransport: () => void
  loadBufferFromURL: (entityId: string, entityUrl: string) => void
  makePlayerFromBuffer: (entityId: string) => void
}



export type AudioLibraryActions =
  | { type: 'upsertEntityPlayer', entityId: string, player: Player }
  | { type: 'upsertSourceBuffer', entityId: string, toneAudioBuffer: ToneAudioBuffer }
  | { type: 'clearEntityPlayer', entityId: string }
  | { type: 'setCurrentProject', projectId: string }
  | { type: 'clearCurrentProject' } 
  | { type: 'setNextProject', projectId: string }

export function AudioLibraryReducer(state: AudioLibraryState, action: AudioLibraryActions) {
  switch (action.type) {
    case 'upsertEntityPlayer':
      return {
        ...state,
        entityPlayers: {
          ...state.entityPlayers,
          [action.entityId]: action.player
        },
      }
    case 'clearEntityPlayer':
      const { [action.entityId]: nodeToClear, ...otherNodes } = state.entityPlayers
      return {
        ...state,
        entityPlayers: {
          ...otherNodes,
        },
      }
    case 'upsertSourceBuffer':
      return {
        ...state,
        entitySourceBuffers: {
          ...state.entitySourceBuffers,
          [action.entityId]: action.toneAudioBuffer,
        },
      }
    case 'setCurrentProject':
      return {
        ...state,
        transportState: {
          ...state.transportState,
          currentProjectId: action.projectId,
        }
      }
    case 'setNextProject': {
      return {
        ...state,
        transportState: {
          ...state.transportState,
          nextProjectId: action.projectId
        }
      }
    }
    case 'clearCurrentProject':
      return { 
        ...state, 
        transportState: {
          ...state.transportState,
          currentProjectId: null
        }
      }
    default:
      return state
  }
}


const ContextForAudio = createContext<OAudioEngine | {}>(
  defaultAudioLibraryState
)


export const AudioEngineProvider = createSelectorProvider(ContextForAudio)
export const AudioEngineConsumer = ContextForAudio.Consumer

interface IAudioProvider {
  children?: any
  libraryContextState?: AudioLibraryState
}

export const AudioProvider = ({
  children,
  libraryContextState = defaultAudioLibraryState,
}: IAudioProvider) => {
  const [library, dispatch] = useReducer(AudioLibraryReducer, libraryContextState)
  const [audioContext, setAudioContext] = useState<BaseContext | null>(null)
  const [masterGainNode, setMasterGainNode] = useState<Gain<"gain"> | null>()
  const [transport, setTransport] = useState<Transport | null>(null)

  // lifecycle
  const isAudioReady = () => audioContext ? true : false

  // getters
  const getEntityPlayer = (entityId: string): Player | null =>
    library.entityPlayers[entityId] || null

  const getSourceBuffer = (entityId: string): ToneAudioBuffer | null =>
    library.entitySourceBuffers[entityId] || null

  const isCurrentProject = (projectId: string): boolean | null => 
      library.transportState.currentProjectId === projectId 

  const isNextProject = (projectId: string): boolean | null => 
      library.transportState.nextProjectId === projectId

  // setters (deprecated, use dispatch directly instead)
  const upsertEntityPlayer = (entityId: string, player: Player) =>
    dispatch({type: 'upsertEntityPlayer', entityId, player})

  const clearEntityPlayer = (entityId: string) => 
    dispatch({ type: 'clearEntityPlayer', entityId})

  const upsertSourceBuffer = (entityId: string, toneAudioBuffer: ToneAudioBuffer) =>
    dispatch({type: 'upsertSourceBuffer', entityId, toneAudioBuffer})

  const setCurrentProject = (projectId: string) => {
    dispatch({type: 'setCurrentProject', projectId})
  }


  const clearCurrentProject = () => 
    dispatch({type: 'clearCurrentProject'})

  const setNextProject = (projectId: string) => 
    dispatch({type: 'setNextProject', projectId})

  // create library items
  const loadBufferFromURL = (entityId: string, entityUrl: string) => {
    new ToneAudioBuffer(entityUrl, (buffer) => {
      upsertSourceBuffer(entityId, buffer)
    })
  }

  const makePlayerFromBuffer = (entityId: string) => {
    // console.log('got makePlayerFromBuffer call for entityId ', entityId)
    if (library.entitySourceBuffers[entityId]) {
      // console.log('found sourceBuffer, creating new player from buffer: ', library.entitySourceBuffers[entityId])
      let player = new Player({
        url: library.entitySourceBuffers[entityId],
        loop: true,
        autostart: false,
        onerror: (err) => console.log(err),
      }).toDestination()
      // console.log('player loaded,upserting ', player)
      upsertEntityPlayer(entityId, player)
    }
  }

  interface StartStopScheduleIds {
    startId: number
    stopId: number
  }



  // library object control
  const queuePlayback = (entityId: string, time: string = "0:0:0"): () => void => {

    // because the only way to stop the player from playing without having to synchronize transport and event players later
    // is to add a per-player event listener to the 'stop' event emitted by transport, we'll return a callback to the player
    // which it can run to easily deschedule both start and stop listeners.

    console.log('queueing playback for ', entityId, ' at ', time);
    let player: Player;

    if ((player = library.entityPlayers[entityId]) && transport) {
      let scheduleId = transport.schedule(() => player.start(), time)
      let stopEvent = () => player.stop()
      transport.on('stop', stopEvent)
      console.log('schedule output', scheduleId, transport._scheduledEvents)

      let unqueuingCallback = function() {
        console.log('clearing scheduleId ', scheduleId)
        transport.clear(scheduleId)
        transport.off('stop', stopEvent)
      }

      return unqueuingCallback
    } else {
      return () => {}
    }
  }

  const unqueuePlayback = (entityId: string, scheduleId: number) => {
    let player: Player;

    if ((player = library.entityPlayers[entityId]) && transport) {
      console.log(transport._scheduledEvents)
      console.log('unqueueing playback for id ', scheduleId)
      transport.clear(scheduleId)
      transport.off('stop', () => { console.log('stopping for ', entityId ); player.stop()})
      console.log(transport._scheduledEvents)
    } else {
      console.log('did not unqueue; could not find transport')
    }
  }

  // transport control functions
  const startTransport = (): void => {
    if (transport) {
      console.log(transport._scheduledEvents)
      transport.start()
      console.log(transport._scheduledEvents)
    }
  }

  const stopTransport = (): void => {
    if (transport) {
      console.log(transport._scheduledEvents)
      transport.stop()
      console.log(transport._scheduledEvents)
    }
  }

  useEffect(() => {
    if (window) {
      let audioContext = getContext()
      let transport = getTransport()
      // transport.debug = true

      setTransport(getTransport())
      setAudioContext(audioContext)
      setMasterGainNode(Destination.output)
    }
  }, [])

  return (
    <AudioEngineProvider
      value={{
        ...library,
        dispatch,
        transport,
        isAudioReady,
        upsertEntityPlayer,
        upsertSourceBuffer,
        // upsertEntityGain,
        getEntityPlayer,
        getSourceBuffer,
        // getEntityGain,
        queuePlayback,
        unqueuePlayback,
        startTransport,
        stopTransport,
        loadBufferFromURL,
        makePlayerFromBuffer,
        clearEntityPlayer,
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
