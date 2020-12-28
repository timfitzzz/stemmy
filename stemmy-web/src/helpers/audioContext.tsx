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
import {
  BaseContext,
  Gain,
  getContext,
  getTransport,
  Player,
  ToneAudioBuffer,
  ToneAudioNode,
} from 'tone'
import { Transport } from 'tone/build/esm/core/clock/Transport'
import Tone from 'tone'
import {
  createSelectorProvider,
  useContextSelector,
} from 'react-use-context-selector'
import { Destination } from 'tone'
import { getLoopAudioUrlById } from '../rest'

export interface ITransportState {
  // status: TransportStatus | null;
  currentProjectId: string | null
  nextProjectId: string | null
}

export interface AudioLibraryState {
  entityPlayers: {
    [key: string]: Player
  }
  entitySourceBuffers: {
    [key: string]: ToneAudioBuffer
  }
  transportState: ITransportState
  buffersLoading: string[]
  playersLoading: string[]
}

const defaultAudioLibraryState: AudioLibraryState = {
  transportState: {
    currentProjectId: null,
    nextProjectId: null,
  },
  entityPlayers: {},
  entitySourceBuffers: {},
  buffersLoading: [],
  playersLoading: [],
}

export type OAudioEngine = {
  dispatch: React.Dispatch<AudioLibraryActions>
  transport: Transport | null
  transportState: ITransportState | null
  entityPlayers: {
    [key: string]: Player
  }
  entitySourceBuffers: {
    [key: string]: ToneAudioBuffer
  }
  buffersLoading: string[]
  playersLoading: string[]
  upsertEntityPlayer: (entityId: string, player: Player) => void
  upsertSourceBuffer: (
    entityId: string,
    toneAudioBuffer: ToneAudioBuffer
  ) => void
  getEntityPlayer: (entityId: string) => Player
  getSourceBuffer: (entityId: string) => ToneAudioBuffer
  clearEntityPlayer: (entityId: string) => void // setTransportState: ({ status, currentProjectId, nextProjectId}: ITransportState) => void
  setCurrentProject: (projectId: string) => void
  clearCurrentProject: () => void
  setNextProject: (projectId: string) => void
  isCurrentProject: (projectId: string) => boolean
  isNextProject: (projectId: string) => boolean
  isAudioReady: () => boolean
  isBufferLoading: (entityId: string) => boolean
  isPlayerLoading: (entityId: string) => boolean
  queuePlayback: (entityId: string, time?: string) => () => void | null
  unqueuePlayback: (entityId: string, scheduleId: number) => void
  startTransport: () => void
  stopTransport: () => void
  loadBufferFromURL: (entityId: string, entityUrl: string) => void
  loadBufferFromId: (entityId: string) => void
  makePlayerFromBuffer: (entityId: string) => void
  getBufferSegments: (
    entityId: string,
    segmentCount: number,
    loopForDuration?: number
  ) => { min: number; max: number }[]
  getLongestDuration: (entityIds: string[]) => number
}

export type AudioLibraryActions =
  | { type: 'upsertEntityPlayer'; entityId: string; player: Player }
  | {
      type: 'upsertSourceBuffer'
      entityId: string
      toneAudioBuffer: ToneAudioBuffer
    }
  | { type: 'loadingEntityPlayer'; entityId: string }
  | { type: 'clearEntityPlayer'; entityId: string }
  | { type: 'setCurrentProject'; projectId: string }
  | { type: 'clearCurrentProject' }
  | { type: 'setNextProject'; projectId: string }
  | { type: 'loadingBuffer'; entityId: string }
  | { type: 'loadedBuffer'; entityId: string }

export function AudioLibraryReducer(
  state: AudioLibraryState,
  action: AudioLibraryActions
) {
  switch (action.type) {
    case 'loadingBuffer':
      return {
        ...state,
        buffersLoading: [...state.buffersLoading, action.entityId],
      }
    case 'loadedBuffer':
      let buffersWithout = state.buffersLoading.filter(
        id => id !== action.entityId
      )
      return {
        ...state,
        buffersLoading: [...buffersWithout],
      }
    case 'loadingEntityPlayer':
      return {
        ...state,
        playersLoading: [...state.playersLoading, action.entityId],
      }
    case 'upsertEntityPlayer':
      let loadingWithout: string[] = state.playersLoading.filter(
        id => id !== action.entityId
      )
      return {
        ...state,
        entityPlayers: {
          ...state.entityPlayers,
          [action.entityId]: action.player,
        },
        playersLoading: loadingWithout,
      }
    case 'clearEntityPlayer':
      const {
        [action.entityId]: nodeToClear,
        ...otherNodes
      } = state.entityPlayers
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
        },
      }
    case 'setNextProject': {
      return {
        ...state,
        transportState: {
          ...state.transportState,
          nextProjectId: action.projectId,
        },
      }
    }
    case 'clearCurrentProject':
      return {
        ...state,
        transportState: {
          ...state.transportState,
          currentProjectId: null,
        },
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
  const [library, dispatch] = useReducer(
    AudioLibraryReducer,
    libraryContextState
  )

  const [audioContext, setAudioContext] = useState<BaseContext | null>(null)
  const [masterGainNode, setMasterGainNode] = useState<Gain<'gain'> | null>()
  const [transport, setTransport] = useState<Transport | null>(null)

  // lifecycle
  const isAudioReady = useMemo(() => (audioContext ? true : false), [])

  // getters
  const getEntityPlayer = useMemo(
    () => (entityId: string): Player | null =>
      library.entityPlayers[entityId] || null,
    [library.entityPlayers]
  )

  const getSourceBuffer = useMemo(
    () => (entityId: string): ToneAudioBuffer | null =>
      library.entitySourceBuffers[entityId] || null,
    [library.entitySourceBuffers]
  )

  const isCurrentProject = useMemo(
    () => (projectId: string): boolean | null =>
      library.transportState.currentProjectId === projectId,
    [library.transportState.currentProjectId]
  )

  const isNextProject = useMemo(
    () => (projectId: string): boolean | null =>
      library.transportState.nextProjectId === projectId,
    []
  )

  const isBufferLoading = useMemo(
    () => (entityId: string): boolean | null =>
      library.buffersLoading.indexOf(entityId) !== -1,
    []
  )

  const isPlayerLoading = useMemo(
    () => (entityId: string): boolean | null =>
      library.playersLoading.indexOf(entityId) !== -1,
    []
  )

  // setters (deprecated, use dispatch directly instead)
  const upsertEntityPlayer = useMemo(
    () => (entityId: string, player: Player) =>
      dispatch({ type: 'upsertEntityPlayer', entityId, player }),
    []
  )

  const clearEntityPlayer = useMemo(
    () => (entityId: string) =>
      dispatch({ type: 'clearEntityPlayer', entityId }),
    []
  )

  const upsertSourceBuffer = useMemo(
    () => (entityId: string, toneAudioBuffer: ToneAudioBuffer) =>
      dispatch({ type: 'upsertSourceBuffer', entityId, toneAudioBuffer }),
    []
  )

  const setCurrentProject = useMemo(
    () => (projectId: string) => {
      dispatch({ type: 'setCurrentProject', projectId })
    },
    []
  )

  const clearCurrentProject = useMemo(
    () => dispatch({ type: 'clearCurrentProject' }),
    []
  )

  const setNextProject = useMemo(
    () => (projectId: string) =>
      dispatch({ type: 'setNextProject', projectId }),
    []
  )

  // create library items
  const loadBufferFromURL = useMemo(
    () => (entityId: string, entityUrl: string) => {
      dispatch({ type: 'loadingBuffer', entityId })
      new ToneAudioBuffer(entityUrl, buffer => {
        upsertSourceBuffer(entityId, buffer)
        dispatch({ type: 'loadedBuffer', entityId })
      })
    },
    []
  )

  const loadBufferFromId = useMemo(
    () => (entityId: string): void => {
      dispatch({ type: 'loadingBuffer', entityId })
      new ToneAudioBuffer(getLoopAudioUrlById(entityId), buffer => {
        upsertSourceBuffer(entityId, buffer)
        dispatch({ type: 'loadedBuffer', entityId })
      })
    },
    []
  )

  const makePlayerFromBuffer = useMemo(
    () => (entityId: string) => {
      console.log('got makePlayerFromBuffer call for entityId ', entityId)
      console.log(
        `library.entitySourceBuffer[${entityId}] is ${getSourceBuffer(
          entityId
        )}`
      )
      if (getSourceBuffer(entityId)) {
        console.log(
          'found sourceBuffer, creating new player from buffer: ',
          getSourceBuffer(entityId)
        )
        dispatch({ type: 'loadingEntityPlayer', entityId })
        let player = new Player({
          url: getSourceBuffer(entityId)!,
          loop: true,
          autostart: false,
          onerror: err => console.log(err),
        }).toDestination()
        console.log('player loaded,upserting ', player)
        dispatch({ type: 'upsertEntityPlayer', entityId, player })
      }
    },
    [getSourceBuffer]
  )

  const getBufferSegments = useMemo(
    () => (
      entityId: string,
      segmentCount: number,
      loopForDuration: number | undefined = undefined
    ): { min: number; max: number }[] => {
      let s: { min: number; max: number }[] = []
      let buffer = getSourceBuffer(entityId)
      let repetitions = 1
      if (buffer) {
        if (loopForDuration) {
          repetitions = loopForDuration / buffer.duration
        }
        // for each repetition, for each channel
        for (let i = 0; i < buffer.numberOfChannels; i++) {
          // get channel data
          let channelData = buffer.getChannelData(i)
          // samples per segment is the total number of samples
          // (including repetitions) divided by the number of segments
          let samplesPerSegment =
            (channelData.length * repetitions) / segmentCount
          let segmentsPerRepetition = segmentCount / repetitions
          // for each repetition,
          for (let r = 0; r < repetitions; r++) {
            // process each segment
            for (let z = 0; z < segmentsPerRepetition; z++) {
              var min = 1.0
              var max = -1.0
              let segment = channelData.slice(
                z * samplesPerSegment,
                z * samplesPerSegment + samplesPerSegment
              )
              segment.forEach(datum => {
                if (datum < min) {
                  min = datum
                } else if (datum > max) {
                  max = datum
                }
              })
              s[z + r * segmentsPerRepetition] = { min, max }
            }
          }
        }
      }
      return s
    },
    [getSourceBuffer]
  )

  const getLongestDuration = useMemo(
    () => (entityIds: string[]): number => {
      return entityIds.reduce<number>((acc, id) => {
        if (getSourceBuffer(id) && acc < getSourceBuffer(id)!.duration) {
          return getSourceBuffer(id)!.duration
        } else {
          return acc
        }
      }, 0)
    },
    [getSourceBuffer]
  )

  interface StartStopScheduleIds {
    startId: number
    stopId: number
  }

  // library object control
  const queuePlayback = useMemo(
    () => (entityId: string, time: string = '0:0:0'): (() => void) => {
      // because the only way to stop the player from playing without having to synchronize transport and event players later
      // is to add a per-player event listener to the 'stop' event emitted by transport, we'll return a callback to the player
      // which it can run to easily deschedule both start and stop listeners.

      console.log('queueing playback for ', entityId, ' at ', time)
      let player: Player | null

      if ((player = getEntityPlayer(entityId)) && transport) {
        console.log('using transport.schedule for player ', player)
        let scheduleId = transport.schedule(() => player!.start(), time)
        let stopEvent = () => player!.stop()
        transport.on('stop', stopEvent)

        let unqueuingCallback = function() {
          console.log('clearing scheduleId ', scheduleId)
          transport.clear(scheduleId)
          transport.off('stop', stopEvent)
        }

        return unqueuingCallback
      } else {
        return () => {}
      }
    },
    [getEntityPlayer]
  )

  const unqueuePlayback = useMemo(
    () => (entityId: string, scheduleId: number) => {
      let player: Player

      if ((player = library.entityPlayers[entityId]) && transport) {
        console.log('unqueueing playback for id ', scheduleId)
        transport.clear(scheduleId)
        transport.off('stop', () => {
          console.log('stopping for ', entityId)
          player.stop()
        })
      } else {
        console.log('did not unqueue; could not find transport')
      }
    },
    []
  )

  // transport control functions
  const startTransport = useMemo((): void => {
    if (transport) {
      transport.start()
    }
  }, [])

  const stopTransport = useMemo(
    () => (): void => {
      if (transport) {
        transport.stop()
      }
    },
    []
  )

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
        loadBufferFromId,
        makePlayerFromBuffer,
        clearEntityPlayer,
        setCurrentProject,
        clearCurrentProject,
        setNextProject,
        isCurrentProject,
        isNextProject,
        getBufferSegments,
        getLongestDuration,
        isBufferLoading,
        isPlayerLoading,
      }}
    >
      {children}
    </AudioEngineProvider>
  )
}

export default ContextForAudio
