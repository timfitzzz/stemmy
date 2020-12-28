import { useMemo, Context, useState, useEffect } from 'react'
import { useContextSelector } from 'react-use-context-selector'
import ContextForAudio, { OAudioEngine } from '../../helpers/audioContext'
import {
  createDesiredSourceBuffersSelector,
  selectLoadBufferFromId,
  sourceBuffersLoadingSelector,
} from '../../helpers/selectors'
import { ToneAudioBuffer } from 'tone'
import { LoopProps } from '../../types'
import { shallowEqual } from 'react-redux'

export interface IuseSourceBuffers {
  loops: LoopProps[] | null
  count: number | null
}

export interface OuseSourceBuffers {
  sourceBuffers: {
    [key: string]: ToneAudioBuffer
  }
  errors: string[]
}

export const useSourceBuffers = ({
  loops,
  count,
}: IuseSourceBuffers): OuseSourceBuffers => {
  const [errors, setErrors] = useState<string[]>([])
  const [failedLoops, setFailedLoops] = useState<LoopProps[]>([])

  const loopIds = useMemo(
    () =>
      (loops ? loops.map(l => (l.id ? l.id : null)) : []).filter(
        i => i
      ) as string[],
    [loops]
  )

  // configure sourcebuffers selector instance for this component
  const sourceBuffersSelector = useMemo(
    () => createDesiredSourceBuffersSelector(loopIds),
    [loopIds]
  )

  // select sourcebuffers
  const selectedSourceBuffers:
    | { id: string; sourceBuffer: ToneAudioBuffer }[]
    | null = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    sourceBuffersSelector
  )
  const sourceBuffersLoading: string[] = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    sourceBuffersLoadingSelector
  )

  // index sourcebuffers by id
  const sourceBuffers = useMemo(() => {
    return selectedSourceBuffers
      ? Object.assign(
          {},
          ...selectedSourceBuffers.map(sb => ({ [sb.id]: sb.sourceBuffer }))
        )
      : []
  }, [selectedSourceBuffers])

  const loadBufferFromId = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectLoadBufferFromId
  )

  const isBufferLoading = useMemo(
    () => (id: string) => {
      return !(sourceBuffersLoading.indexOf(id) === -1)
    },
    [sourceBuffersLoading]
  )

  // if loops are present in the number expected,
  // and sourcebuffers aren't already loaded,
  // load sourcebuffers
  useEffect(() => {
    if (
      loops &&
      count &&
      loops.length === count &&
      sourceBuffers.length !== loops.length &&
      loadBufferFromId
    ) {
      loops.forEach(loop => {
        if (
          loop.id &&
          !sourceBuffers[loop.id] &&
          failedLoops.indexOf(loop) === -1 &&
          !isBufferLoading(loop.id)
        ) {
          loadBufferFromId(loop.id)
        } else {
          if (!loop.id) {
            setErrors([
              ...errors,
              `couldn't find id for loop obj ${JSON.stringify(loop)}`,
            ])
            setFailedLoops([...failedLoops, loop])
          }
        }
      })
    }
  }, [loops])

  // return sourcebuffers only if they've been located as expected
  return {
    sourceBuffers:
      selectedSourceBuffers &&
      loops &&
      selectedSourceBuffers.length === loops.length
        ? sourceBuffers
        : null,
    errors,
  }
}
