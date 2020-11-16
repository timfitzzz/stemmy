import React, {
  Consumer,
  Context,
  createContext,
  Provider,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type IContextForAudio = {
  audioCtx: AudioContext | null
  masterGainNode: AudioNode | null
  entitySourceNodes: {
    [key: string]: AudioBufferSourceNode
  }
  entitySourceBuffers: {
    [key: string]: AudioBuffer
  }
  entityGainNodes: {
    [key: string]: GainNode
  }
  upsertSourceNode: (id: string, sourceNode: AudioBufferSourceNode) => void
  upsertSourceBuffer: (id: string, audioBuffer: AudioBuffer) => void
  upsertSourceGain: (id: string, gainNode: AudioNode) => void
  getSourceNode: (id: string) => AudioBufferSourceNode
  getSourceBuffer: (id: string) => AudioBuffer
  getSourceGain: (id: string) => GainNode
  clearSourceNode: (id: string) => void
}

const defaultContextForAudioState: Partial<IContextForAudio> = {
  audioCtx: null,
  entitySourceNodes: {},
  entitySourceBuffers: {},
  entityGainNodes: {},
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

  const upsertSourceNode = (id: string, sourceNode: AudioBufferSourceNode) =>
    setContext({
      ...context,
      entitySourceNodes: {
        ...context.entitySourceNodes,
        [id]: sourceNode,
      },
    })

  const clearSourceNode = (id: string) => {
    const { [id]: nodeToClear, ...otherNodes } = context.entitySourceNodes!

    setContext({
      ...context,
      entitySourceNodes: {
        ...otherNodes,
      },
    })
  }

  const upsertSourceBuffer = (id: string, audioBuffer: AudioBuffer) =>
    setContext({
      ...context,
      entitySourceBuffers: {
        ...context.entitySourceBuffers,
        [id]: audioBuffer,
      },
    })

  const upsertSourceGain = (id: string, gainNode: GainNode) => {
    setContext({
      ...context,
      entityGainNodes: {
        ...context.entityGainNodes,
        [id]: gainNode,
      },
    })
  }

  const getSourceNode = (id: string): AudioBufferSourceNode | null =>
    context!.entitySourceNodes![id] || null

  const getSourceBuffer = (id: string): AudioBuffer | null =>
    context!.entitySourceBuffers![id] || null

  const getSourceGain = (id: string): GainNode | null =>
    context!.entityGainNodes![id] || null

  useEffect(() => {
    if (window) {
      let audioCtx = new AudioContext()
      let masterGainNode = audioCtx.createGain()
      masterGainNode.connect(audioCtx.destination)

      setContext({
        ...context,
        masterGainNode,
        audioCtx,
      })
    }
  }, [])

  return (
    <AudioEngineProvider
      value={{
        ...context,
        upsertSourceNode,
        upsertSourceBuffer,
        upsertSourceGain,
        getSourceNode,
        getSourceBuffer,
        getSourceGain,
        clearSourceNode,
      }}
    >
      {children}
    </AudioEngineProvider>
  )
}

export default ContextForAudio
