import { useEffect, useContext, useState, useMemo, useCallback } from 'react'
import { Gain, Player, ToneAudioBuffer, ToneAudioNode } from 'tone'
import * as Tone from 'tone'
import ContextForAudio, { OAudioEngine } from './audioContext'
import { useContextSelector } from 'react-use-context-selector'
import { Context } from 'react'
import {
  createDesiredEntityPlayerSelector,
  createDesiredSourceBufferSelector,
  selectDispatch,
  selectGetBufferSegments,
  selectIsAudioReady,
  selectLoadBufferFromURL,
  selectMakePlayerFromBuffer,
  selectQueuePlayback,
} from './selectors'

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

export const useEntityPlayer = (
  entityUrl: string,
  dependencies: any[],
  entityId?: string,
  debugOn?: boolean
) => {
  debugOn && console.log('useEntityPlayer called with url: ', entityUrl)

  // what we want:
  // -- if there is already a player stored in context for the entity, return the player.
  // -- elseif there is already a toneaudiobuffer stored in context for the entity, return gettingNode = true and get node > set it context
  // -- else if a url is passed in:
  //     -- create a toneaudiobuffer from it and store it in context
  //     -- create a player and store it in context

  // get functions
  // let dispatch = useContextSelector(
  //   ContextForAudio as Context<OAudioEngine>,
  //   selectDispatch
  // )
  let isAudioReady = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectIsAudioReady
  )
  let loadBufferFromURL = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectLoadBufferFromURL
  )
  let makePlayerFromBuffer = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectMakePlayerFromBuffer
  )
  let queuePlayback = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectQueuePlayback
  )
  let getBufferSegments = useContextSelector(
    ContextForAudio as Context<OAudioEngine>,
    selectGetBufferSegments
  )

  // get library contents

  const sourceBufferSelector = useMemo(
    () => createDesiredSourceBufferSelector(entityId || null),
    [entityId]
  )
  const sourceBuffer: ToneAudioBuffer | null = useContextSelector(
    ContextForAudio as React.Context<OAudioEngine>,
    sourceBufferSelector
  )

  const entityPlayerSelector = useMemo(
    () => createDesiredEntityPlayerSelector(entityId || null),
    [entityId]
  )
  let entityPlayer: Player | null = useContextSelector(
    ContextForAudio as React.Context<OAudioEngine>,
    entityPlayerSelector
  )

  // console.log(entityUrl, entityId, sourceBuffer, entityPlayer);

  // let [entityPlayer, setEntityPlayer] = useState<Player | null>(null)
  let [startTime, setStartTime] = useState<number | null>(null)
  let [readyToPlay, setReadyToPlay] = useState<boolean>(false)
  let [loadingBuffer, setLoadingBuffer] = useState<boolean>(false)
  let [loadingPlayer, setLoadingPlayer] = useState<boolean>(false)
  let [unschedulingCb, setUnschedulingCb] = useState<(() => void) | null>(null)

  // let [gettingNode, setGettingNode] = useState<boolean>(false)
  // let [nodeReady, setNodeReady] = useState<boolean>(false)

  // let {
  //   Transport,
  //   audioCtx,
  //   getSourceBuffer,
  //   getEntityPlayer,
  //   upsertSourceBuffer,
  //   upsertEntityPlayer,
  //   clearEntityPlayer,
  // } = contextObj

  debugOn &&
    console.log(
      isAudioReady &&
        isAudioReady() &&
        queuePlayback &&
        loadBufferFromURL &&
        makePlayerFromBuffer &&
        dependenciesMet(dependencies) &&
        entityId
        ? 'useEffect conditions passed'
        : 'useEffect conditions failed'
    )

  useEffect(() => {
    if (
      isAudioReady &&
      isAudioReady() &&
      queuePlayback &&
      loadBufferFromURL &&
      makePlayerFromBuffer &&
      dependenciesMet(dependencies) &&
      entityId
    ) {
      debugOn && console.log('-- found ctx, dependencies, entityid')
      // check for entityPlayer or expectation of one in audioengine library store
      if (!entityPlayer && !loadingPlayer) {
        debugOn &&
          console.log(
            '--- no entityplayer & player not loading, checking for source buffer'
          )
        // is there a source buffer (or expectation of one) for the player?
        if (!sourceBuffer && !loadingBuffer) {
          debugOn &&
            console.log(
              '--- no sourcebuffer and buffer not loading, requesting buffer load'
            )
          loadBufferFromURL(entityId, entityUrl) // request buffer load
          setLoadingBuffer(true) // note that we are waiting for buffer to load
        } else if (sourceBuffer && loadingBuffer) {
          debugOn &&
            console.log(
              '--- buffer found after load requested, requesting create entity player'
            )
          setLoadingBuffer(false)
          setLoadingPlayer(true)
          makePlayerFromBuffer(entityId)
          debugOn && console.log('called makePlayerFromBuffer')
        }
      } else {
        // if there's no player but one is loading we'll do nothing
        // if there is a player, set it to play
        if (entityPlayer) {
          if (loadingPlayer) {
            debugOn &&
              console.log(
                '--- found player after requesting load, marking loaded'
              )
            setLoadingPlayer(false)
          } else {
            debugOn && console.log('--- found player')
          }

          // player exists, but is it set to play?
          // if so, we're good. if not:
          if (!readyToPlay) {
            debugOn && console.log('--- player not ready, readying player')
            let unqueuingCallback = queuePlayback(entityId)
            setUnschedulingCb(() => unqueuingCallback)
            console.log(unschedulingCb)
            setReadyToPlay(true)
            debugOn && console.log('--- player ready for transport.start()')
          } else {
            debugOn && console.log('component is still marked readytoplay')
          }
        }
      }
    }

    // TODO: use scheduleId to unschedule when component is unmounted

    // we need to unqueue playback when the hook is unmounted.
    return () => {
      console.log(
        'running useEntityPlayer useEffect return on unmount for ',
        entityId
      )
      console.log(unschedulingCb)
      if (unschedulingCb) {
        entityPlayer?.stop()
        console.log('running unscheduling cb')
        unschedulingCb()
        setReadyToPlay(false)
        setUnschedulingCb(null)
      }
    }
  }, [
    entityId,
    entityUrl,
    entityPlayer,
    sourceBuffer,
    readyToPlay,
    unschedulingCb,
  ])

  // bits of old hook for reference
  //   // // finding no entityPlayer in state,
  //   // // check for the entityPlayer in the react audiocontext
  //   // debugOn && console.log('--- no entityPlayer in state')
  //   // let ctxEntityPlayer = getEntityPlayer!(entityId)
  //   // if (!ctxEntityPlayer) {
  //     // finding no entityPlayer in the react context,
  //     // check for the entity's ToneAudioBuffer in the react context
  //     debugOn && console.log('---- no entityPlayer in context')
  //     let ctxSourceBuffer = getSourceBuffer!(entityId)
  //     if (!ctxSourceBuffer) {
  //       // finding no ToneAudioBuffer in the react context,
  //       // create one from the provided url
  //       debugOn && console.log(
  //         '----- no ToneAudioBuffer in context, creating one for provided url'
  //       )
  //       let newBuffer = new ToneAudioBuffer(entityUrl, (buffer) => {
  //         debugOn && console.log('------ decoded audio data, adding it to context')
  //         upsertSourceBuffer!(entityId, buffer)
  //       })
  //     } else {
  //       // Having found a ToneAudioBuffer in the react context,
  //       // create an entityPlayer and add it to state
  //       debugOn && console.log(
  //         '----- found ToneAudioBuffer in context, creating entityPlayer'
  //       )
  //       let player = new Player({
  //         url: entityUrl,
  //         loop: true,
  //         onerror: (err) => console.log(err),
  //         onload: () => {
  //           debugOn && console.log('upserting entityPlayer', player)
  //           upsertEntityPlayer!(entityId, player)
  //         }
  //       }).toDestination()
  //     }
  //   } else {
  //     // Having found a Player in the react context,
  //     // set it in local state
  //     debugOn && console.log(
  //       '--- player found in context, setting it as return state'
  //     )
  //     setEntityPlayer(ctxEntityPlayer)
  //   }
  // } else {
  //   debugOn && console.log('--- entityPlayer already in state, will return')
  // }

  // async function startPlaybackNow() {
  //   if (entityPlayer) {
  //     entityPlayer.start()
  //     setStartTime(Tone.now())
  //     Transport?.start()
  //   }
  // }

  // function stopPlaybackNow() {
  //   if (entityPlayer) {
  //     entityPlayer.stop()
  //     setStartTime(null)
  //   }
  // }

  const getVolume: () => number | null = useMemo(
    () => () => {
      if (entityPlayer) {
        return entityPlayer.volume.value
      } else {
        return null
      }
    },
    [entityPlayer]
  )

  const getGain: () => number = useMemo(
    () => () => {
      if (entityPlayer) {
        if (entityPlayer.volume.value === -1000) {
          return 0
        } else {
          return (entityPlayer.volume.value + 60) / 70
        }
      } else {
        return 0
      }
    },
    [entityPlayer]
  )

  const setVolume: (volume: number) => void = useMemo(
    () => (volume: number) => {
      debugOn && console.log(volume)
      if (entityPlayer) {
        entityPlayer.volume.value = volume
      }
    },
    [entityPlayer]
  )

  const volumeUp: () => void = useMemo(
    () => () => {
      if (entityPlayer) {
        let currentGain = entityPlayer.volume.value
        if (currentGain === -1000) {
          entityPlayer.volume.value = -58
        } else if (currentGain + 2 >= 10) {
          entityPlayer.volume.value = 10
        } else {
          entityPlayer.volume.value = currentGain + 2
        }
      }
    },
    [entityPlayer]
  )

  const volumeDown: () => void = useMemo(
    () => () => {
      if (entityPlayer) {
        let currentGain = entityPlayer.volume.value
        if (currentGain - 2 <= -60) {
          entityPlayer.volume.value = -1000
        } else {
          entityPlayer.volume.value = currentGain - 2
        }
      }
    },
    [entityPlayer]
  )

  const getPlaybackLocation: () => number = useMemo(
    () => () => {
      if (entityPlayer && startTime) {
        let now = Tone.now()
        let playTime = now - startTime
        let totalLength = entityPlayer.buffer.duration

        let location =
          playTime < totalLength
            ? playTime / totalLength
            : (playTime % totalLength) / totalLength

        if (entityPlayer.reverse == true) {
          return 1 - location
        } else {
          return location
        }
      } else {
        return 0
      }
    },
    [entityPlayer, startTime]
  )

  const getPlaybackTime: () => number = useMemo(
    () => () => {
      if (entityPlayer && startTime) {
        let now = Tone.now()
        let playTime = now - startTime
        let totalLength = entityPlayer.buffer.duration
        if (entityPlayer.reverse == true) {
          return playTime < totalLength
            ? totalLength - playTime
            : totalLength - (playTime % totalLength)
        } else {
          return playTime < totalLength ? playTime : playTime % totalLength
        }
      } else {
        return 0
      }
    },
    [entityPlayer, startTime]
  )

  const toggleReverse: () => void = useMemo(
    () => () => {
      if (entityPlayer) {
        if (entityPlayer.reverse === false) {
          // to reverse the loop, stop it
          // then tell it to start at the current playhead
          let currentPlaybackTime = getPlaybackTime()

          // if (currentPlaybackTime !== 0) {
          //   entityPlayer.loopStart = currentPlaybackTime
          //   entityPlayer.loopEnd = currentPlaybackTime - 0.00001
          // }

          // then tell it to play in reverse
          entityPlayer.reverse = true
          // then restart it
          // let's say it's 5 seconds long
          // at 2 seconds (playhead position 0.4 of circle)
          // we reverse it
          // it should start heading back to 0
          // the current location flips relative to length. so instead of 0.4 it's 0.6
          // the current location will be duration - getPlaybackTime
          let loopProgress = entityPlayer.buffer.duration - currentPlaybackTime
          setStartTime(Tone.now() - loopProgress)
        } else {
          // entityPlayer.stop()
          let currentPlaybackTime = getPlaybackTime()

          // if (currentPlaybackTime !== 0) {
          //   entityPlayer.loopStart = currentPlaybackTime
          //   entityPlayer.loopEnd = currentPlaybackTime - 0.00001
          // }

          entityPlayer.reverse = false
          // entityPlayer.start()
          setStartTime(Tone.now() - currentPlaybackTime)
        }
      }
    },
    [entityPlayer, setStartTime, getPlaybackTime]
  )

  const getSegments: (
    segmentCount: number
  ) => { min: number; max: number }[] | null = useCallback(
    (segmentCount: number) =>
      entityId && getBufferSegments
        ? getBufferSegments(entityId, segmentCount)
        : null,
    [entityId, getBufferSegments]
  )

  return {
    sourceBuffer,
    entityPlayer,
    getPlaybackLocation,
    getPlaybackTime,
    setVolume,
    getVolume,
    getGain,
    volumeUp,
    volumeDown,
    toggleReverse,
    getSegments,
  }
}

//   // if (nodeReady) {
//   //   setGettingNode(false)
//   // }

//   useEffect(() => {
//     console.log(
//       'useEffect: ',
//       audioData,
//       contextObj,
//       sourceNode,
//       nodeReady,
//       dependenciesMet(dependencies)
//     )
//     if (
//       entityId &&
//       audioCtx &&
//       audioData &&
//       dependenciesMet(dependencies) &&
//       !nodeReady &&
//       !gettingNode &&
//       !sourceNode
//     ) {
//       setSourceNode(audioCtx.createBufferSource())
//       setGettingNode(true)
//       audioCtx.decodeAudioData(audioData).then((audioBuffer: AudioBuffer) => {
//         if (sourceNode) {
//           sourceNode.buffer = audioBuffer
//           sourceNode.connect(audioCtx!.destination)
//           sourceNode.loop = true
//           setNodeReady(true)
//         }
//       })

//       return () => {
//         if (audioCtx && sourceNode) {
//           sourceNode.stop()
//           sourceNode.disconnect(audioCtx.destination)
//           setNodeReady(false)
//         }
//       }
//     }
//   })

//   console.log(nodeReady, sourceNode)
//   return { nodeReady, sourceNode }
// }
