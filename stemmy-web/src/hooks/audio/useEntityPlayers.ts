import { useMemo, Context, useEffect, useState, useReducer } from 'react'
import { useContextSelector } from 'react-use-context-selector'
import ContextForAudio from '../../helpers/audioContext'
import { OAudioEngine } from '../../helpers/audioContext'
import {
  entityPlayersLoadingSelector,
  selectMakePlayerFromBuffer,
  selectQueuePlayback,
} from '../../helpers/selectors'
import { createDesiredEntityPlayersSelector } from '../../helpers/selectors'
import { LoopProps } from '../../types'
import { Player, ToneAudioBuffer } from 'tone'
import { useSourceBuffers } from './useSourceBuffers'

interface IuseEntityPlayers {
  entities: LoopProps[] | null
  count: number | null
  dependencies: any[]
  setPlayback?: boolean
  debug?: boolean
}

export interface OuseEntityPlayers {
  sourceBuffers: { [key: string]: ToneAudioBuffer } | null
  entityPlayers: { [key: string]: Player } | null
  ready: boolean
  volumeDown: (entityId: string) => void
  volumeUp: (entityId: string) => void
  getVolume: (entityId: string) => number | null
  getGain: (entityId: string) => number
}

function dependenciesMet(dependencies: any[]) {
  let passed = true
  dependencies.forEach(dependency => {
    if (!passed) {
      return
    } else if (!dependency && dependency !== 0) {
      passed = false
    }
    return
  })
  return passed
}

export interface useEntityPlayersState {
  callbacks: {
    [key: string]: () => void
  }
}

export type useEntityPlayersReducerActions =
  | { type: 'storeCallback'; entityId: string; callback: () => void }
  | { type: 'clearCallback'; entityId: string }

export const defaultUseEntityPlayersState = {
  callbacks: {},
}

export function useEntityPlayersReducer(
  state: useEntityPlayersState,
  action: useEntityPlayersReducerActions
) {
  switch (action.type) {
    case 'storeCallback':
      return {
        ...state,
        callbacks: {
          ...state.callbacks,
          [action.entityId]: action.callback,
        },
      }
    case 'clearCallback':
      let { [action.entityId]: omit, ...otherCbs } = state.callbacks
      return {
        ...state,
        callbacks: {
          ...otherCbs,
        },
      }
    default:
      return state
  }
}

export const useEntityPlayers = ({
  entities,
  count,
  dependencies = [],
  setPlayback = false,
  debug = false,
}: IuseEntityPlayers): OuseEntityPlayers => {
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([])
  const [ready, setReady] = useState<boolean>(false)
  const [{ callbacks }, localDispatch] = useReducer(
    useEntityPlayersReducer,
    defaultUseEntityPlayersState
  )

  const { sourceBuffers, errors: sbErrors } = useSourceBuffers({
    loops: entities,
    count,
  })

  const entityPlayersSelector = useMemo(
    () =>
      createDesiredEntityPlayersSelector(
        entities ? (entities.map(e => e.id).filter(e => e) as string[]) : []
      ),
    [entities, count]
  )

  const entityPlayersLoading = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    entityPlayersLoadingSelector
  )

  const selectedEntityPlayers:
    | { id: string; entityPlayer: Player }[]
    | null = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    entityPlayersSelector
  )

  const entityPlayers: { [key: string]: Player } = useMemo(() => {
    return selectedEntityPlayers
      ? Object.assign(
          {},
          ...selectedEntityPlayers.map(ep => ({ [ep.id]: ep.entityPlayer }))
        )
      : {}
  }, [selectedEntityPlayers])

  const makePlayerFromBuffer = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectMakePlayerFromBuffer
  )

  let queuePlayback = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectQueuePlayback
  )

  const isPlayerLoading = useMemo(
    () => (id: string) => {
      return !(entityPlayersLoading.indexOf(id) === -1)
    },
    [entityPlayersLoading]
  )

  // create players, if not already done
  useEffect(() => {
    if (
      dependenciesMet(dependencies) &&
      sourceBuffers &&
      entities &&
      count &&
      entities.length === count
    ) {
      entities.forEach(entity => {
        if (
          entity &&
          entity.id &&
          !entityPlayers[entity.id] &&
          sourceBuffers[entity.id] &&
          !isPlayerLoading(entity.id) &&
          makePlayerFromBuffer
        ) {
          makePlayerFromBuffer(entity.id)
        }
      })
    }
  }, [dependencies, sourceBuffers, entities, count, entityPlayers])

  useEffect(() => {
    if (
      !setPlayback &&
      !ready &&
      selectedEntityPlayers &&
      selectedEntityPlayers.length === count
    ) {
      setReady(true)
    }
  }, [setPlayback, selectedEntityPlayers, count])

  useEffect(() => {
    let queuedPlayerCount: number = 0
    if (
      setPlayback &&
      !ready &&
      selectedEntityPlayers &&
      selectedEntityPlayers.length === count
    ) {
      entities &&
        entities.forEach(e => {
          if (e && e.id && !callbacks[e.id] && queuePlayback) {
            localDispatch({
              type: 'storeCallback',
              entityId: e.id,
              callback: queuePlayback(e.id),
            })
          }
          queuedPlayerCount++
        })
      if (queuedPlayerCount === count) {
        setReady(true)
      }
    }

    return () => {
      entities &&
        entities.forEach(
          e =>
            e.id &&
            callbacks[e.id] &&
            callbacks[e.id]() &&
            localDispatch({
              type: 'clearCallback',
              entityId: e.id,
            })
        )
    }
  }, [entityPlayers, selectedEntityPlayers])

  const volumeUp: (entityId: string) => void = useMemo(
    () => (entityId: string) => {
      if (entityPlayers[entityId]) {
        let currentGain = entityPlayers[entityId].volume.value
        if (currentGain === -1000) {
          entityPlayers[entityId].volume.value = -58
        } else if (currentGain + 2 >= 10) {
          entityPlayers[entityId].volume.value = 10
        } else {
          entityPlayers[entityId].volume.value = currentGain + 2
        }
      }
    },
    [ready]
  )

  const volumeDown: (entityId: string) => void = useMemo(
    () => (entityId: string) => {
      if (entityPlayers[entityId]) {
        let currentGain = entityPlayers[entityId].volume.value
        if (currentGain - 2 <= -60) {
          entityPlayers[entityId].volume.value = -1000
        } else {
          entityPlayers[entityId].volume.value = currentGain - 2
        }
      }
    },
    [ready]
  )

  const getVolume: (entityId: string) => number | null = useMemo(
    () => (entityId: string) => {
      if (entityPlayers[entityId]) {
        return entityPlayers[entityId].volume.value
      } else {
        return null
      }
    },
    [ready]
  )

  const getGain: (entityId: string) => number = useMemo(
    () => (entityId: string) => {
      if (entityPlayers[entityId]) {
        if (entityPlayers[entityId].volume.value === -1000) {
          return 0
        } else {
          return (entityPlayers[entityId].volume.value + 60) / 70
        }
      } else {
        return 0
      }
    },
    [ready]
  )

  return {
    entityPlayers,
    sourceBuffers,
    ready,
    volumeDown,
    volumeUp,
    getVolume,
    getGain,
  }
}
