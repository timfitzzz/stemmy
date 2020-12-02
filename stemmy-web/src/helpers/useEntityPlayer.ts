import { addTypenameToDocument } from '@apollo/client/utilities'
import { useEffect, useContext, useState } from 'react'
import { Gain, Player, ToneAudioBuffer, ToneAudioNode } from 'tone'
import * as Tone from 'tone'
import ContextForAudio, { IContextForAudio } from './audioContext'

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

  let contextObj: Partial<IContextForAudio> = useContext(ContextForAudio)
  let [entityPlayer, setEntityPlayer] = useState<Player | null>(null)
  let [startTime, setStartTime] = useState<number | null>(null)
  // let [gettingNode, setGettingNode] = useState<boolean>(false)
  // let [nodeReady, setNodeReady] = useState<boolean>(false)

  let {
    Transport,
    audioCtx,
    masterGainNode,
    getSourceBuffer,
    getEntityPlayer,
    upsertSourceBuffer,
    upsertEntityPlayer,
    clearEntityPlayer,
  } = contextObj

  useEffect(() => {
    if (
      audioCtx &&
      masterGainNode &&
      dependenciesMet(dependencies) &&
      entityUrl,
      entityId
    ) {
      debugOn && console.log('-- found ctx, data, dependencies, entityid')
      // check for entityPlayer in component state
      if (!entityPlayer) {
        // finding no entityPlayer in state, 
        // check for the entityPlayer in the react audiocontext
        debugOn && console.log('--- no entityPlayer in state')
        let ctxEntityPlayer = getEntityPlayer!(entityId)
        if (!ctxEntityPlayer) {
          // finding no entityPlayer in the react context, 
          // check for the entity's ToneAudioBuffer in the react context
          debugOn && console.log('---- no entityPlayer in context')
          let ctxSourceBuffer = getSourceBuffer!(entityId)
          if (!ctxSourceBuffer) {
            // finding no ToneAudioBuffer in the react context,
            // create one from the provided url
            debugOn && console.log(
              '----- no ToneAudioBuffer in context, creating one for provided url'
            )
            let newBuffer = new ToneAudioBuffer(entityUrl, (buffer) => {
              console.log('------ decoded audio data, adding it to context')
              upsertSourceBuffer!(entityId, buffer)
            })
          } else {
            // Having found a ToneAudioBuffer in the react context,
            // create an entityPlayer and add it to state
            debugOn && console.log(
              '----- found ToneAudioBuffer in context, creating entityPlayer'
            )
            let player = new Player({
              url: entityUrl,
              loop: true,
              onerror: (err) => console.log(err),
              onload: () => {
                debugOn && console.log('upserting entityPlayer', player)
                upsertEntityPlayer!(entityId, player)
              }
            }).toDestination()
          }
        } else {
          // Having found a Player in the react context,
          // set it in local state
          debugOn && console.log(
            '--- player found in context, setting it as return state'
          )
          setEntityPlayer(ctxEntityPlayer)
        }
      } else {
        debugOn && console.log('--- entityPlayer already in state, will return')
      }
    }
  })

  async function startPlaybackNow() {
    if (entityPlayer) {
      entityPlayer.start()
      setStartTime(Tone.now())
      Transport?.start()
    }
  }

  function stopPlaybackNow() {
    if (entityPlayer) {
      entityPlayer.stop()
      setStartTime(null)
    }
  }

  function getVolume(): number | null {
    if (entityPlayer) {
      return entityPlayer.volume.value
    } else {
      return null
    }
  }

  function getGain(): number {
    if (entityPlayer) {
      if (entityPlayer.volume.value === -1000) {
        return 0;
      }
      else {
        return (entityPlayer.volume.value + 60) / 70
      }

    } else {
      return 0
    }
  }

  function setVolume(volume: number): void {
    debugOn && console.log(volume)
    if (entityPlayer) {
      entityPlayer.volume.value = volume;
    }
  }

  function volumeUp(): void {
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
    
  }

  function volumeDown(): void {
    if (entityPlayer) {
      let currentGain = entityPlayer.volume.value
      if (currentGain - 2 <= -60) {
        entityPlayer.volume.value = -1000
      } else {
        entityPlayer.volume.value = currentGain - 2
      }
    }
  }

  function getPlaybackLocation(): number {
    if (entityPlayer && startTime) {
      let now = Tone.now()
      let playTime = now - startTime
      let totalLength = entityPlayer.buffer.duration

      let location = playTime < totalLength ? playTime / totalLength : (playTime % totalLength) / totalLength;

      if (entityPlayer.reverse == true) {
        return 1 - location
      } else {
        return location
      }
    } else {
      return 0
    }
  }

  function getPlaybackTime(): number {
    if (entityPlayer && startTime) {
      let now = Tone.now()
      let playTime = now - startTime
      let totalLength = entityPlayer.buffer.duration
      if (entityPlayer.reverse == true) {
        return playTime < totalLength ? totalLength - playTime : totalLength - (playTime % totalLength);
      } else {
        return playTime < totalLength ? playTime : playTime % totalLength;
      }
    } else {
      return 0
    }
  }

  function toggleReverse(): void {

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
  }

  return {
    sourceBuffer: entityId ? getSourceBuffer!(entityId) : null,
    entityPlayer,
    startPlaybackNow,
    stopPlaybackNow,
    getPlaybackLocation,
    getPlaybackTime,
    setVolume,
    getVolume,
    getGain,
    volumeUp,
    volumeDown,
    toggleReverse,
    clearEntityPlayer,
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