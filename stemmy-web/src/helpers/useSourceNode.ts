// import { useEffect, useContext, useState } from 'react'
// import ContextForAudio, { IContextForAudio } from './audioContext'

// function dependenciesMet(dependencies: any[]) {
//   let passed = true
//   dependencies.forEach(dependency => {
//     if (!passed) {
//       return
//     } else if (!dependency && dependency !== 0) {
//       passed = false
//     }
//     return
//   })
//   return passed
// }

// export const useSourceNode = (
//   audioData: ArrayBuffer | null,
//   dependencies: any[],
//   entityId?: string,
//   debugOn?: boolean
// ) => {
//   // console.log('useSourceNode called with audioData: ', audioData)

//   // what we want:
//   // -- if there is already a sourcenode stored in context for the entity, return the sourcenode.
//   // -- elseif there is already an arraybuffer stored in context for the entity, return gettingNode = true and get node > set it context
//   // -- else if an arraybuffer is passed in, handle:
//   //     -- store it in context
//   //     -- create a sourcenode
//   //     -- store the sourcenode in context

//   let contextObj: Partial<IContextForAudio> = useContext(ContextForAudio)
//   let [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null)
//   let [gainNode, setGainNode] = useState<GainNode | null>(null)
//   let [startTime, setStartTime] = useState<number | null>(null)
//   // let [gettingNode, setGettingNode] = useState<boolean>(false)
//   // let [nodeReady, setNodeReady] = useState<boolean>(false)

//   let {
//     audioCtx,
//     masterGainNode,
//     getSourceBuffer,
//     getSourceNode,
//     getSourceGain,
//     upsertSourceBuffer,
//     upsertSourceNode,
//     upsertSourceGain,
//     clearSourceNode,
//   } = contextObj

//   useEffect(() => {
//     if (
//       audioCtx &&
//       masterGainNode &&
//       dependenciesMet(dependencies) &&
//       entityId
//     ) {
//       debugOn && console.log('-- found ctx, data, dependencies, entityid')
//       if (!sourceNode) {
//         debugOn && console.log('--- no sourceNode in state')
//         let ctxSourceNode = getSourceNode!(entityId)
//         let ctxGainNode = getSourceGain!(entityId)
//         if (!ctxSourceNode) {
//           debugOn && console.log('---- no sourceNode in context')
//           let ctxSourceBuffer = getSourceBuffer!(entityId)
//           if (!ctxSourceBuffer && audioData) {
//             debugOn && console.log(
//               '----- no sourceBuffer in context, decoding provided audio data'
//             )
//             audioCtx.decodeAudioData(audioData).then(audioBuffer => {
//               console.log('------ decoded audio data, adding it to context')
//               upsertSourceBuffer!(entityId, audioBuffer)
//             })
//           } else {
//             debugOn && console.log(
//               '----- found sourceBuffer in context, checking for gain node creating source and gain nodes'
//             )
//             if (!ctxGainNode) {
//               debugOn && console.log('----- no gain node, creating one')
//               let newGainNode = audioCtx.createGain()
//               newGainNode.connect(masterGainNode)
//               upsertSourceGain!(entityId, newGainNode)
//             } else {
//               '----- found gain node for source in context, creating source node'
//               let newSourceNode = audioCtx.createBufferSource()
//               newSourceNode.buffer = ctxSourceBuffer
//               newSourceNode.connect(ctxGainNode)
//               newSourceNode.loop = true
//               upsertSourceNode!(entityId, newSourceNode)
//             }
//           }
//         } else {
//           debugOn && console.log(
//             '--- sourceNode found in context, setting it as return state'
//           )
//           setGainNode(ctxGainNode)
//           setSourceNode(ctxSourceNode)
//         }
//       } else {
//         debugOn && console.log('--- sourceNode already in state, will return')
//       }
//     }
//   })

//   function startPlayback() {
//     if (sourceNode) {
//       setStartTime(new Date().getTime())
//       sourceNode.start()
//     }
//   }

//   function stopPlayback() {
//     if (sourceNode) {
//       sourceNode.stop()
//       setSourceNode(null)
//       clearSourceNode!(entityId!)
//       setStartTime(null)
//     }
//   }

//   function setGain(gain: number) {
//     debugOn && console.log(gain)
//     if (sourceNode && gainNode) {
//       gainNode.gain.value = gain
//     }
//   }

//   function gainUp() {
//     if (sourceNode && gainNode) {
//       let currentGain = gainNode.gain.value
//       if (currentGain + 0.05 >= 1) {
//         gainNode.gain.value = 1
//       } else {
//         gainNode.gain.value = currentGain + 0.05
//       }
//     }
//   }

//   function gainDown() {
//     if (sourceNode && gainNode) {
//       let currentGain = gainNode.gain.value
//       if (currentGain - 0.05 <= 0) {
//         gainNode.gain.value = 0
//       } else {
//         gainNode.gain.value = currentGain - 0.05
//       }
//     }
//   }

//   function getPlaybackTime() {
//     if (startTime && sourceNode && entityId) {
//       let now = new Date().getTime()
//       let playTime = now - startTime
//       let totalLength = getSourceBuffer!(entityId).duration * 1000
//       let playbackTime = playTime < totalLength ? playTime : playTime % totalLength
//       return playbackTime
//     }
//   }

//   return {
//     sourceBuffer: entityId ? getSourceBuffer!(entityId) : null,
//     sourceNode,
//     gainNode,
//     startPlayback,
//     stopPlayback,
//     getPlaybackTime,
//     setGain,
//     gainUp,
//     gainDown,
//   }
// }

// //   // if (nodeReady) {
// //   //   setGettingNode(false)
// //   // }

// //   useEffect(() => {
// //     console.log(
// //       'useEffect: ',
// //       audioData,
// //       contextObj,
// //       sourceNode,
// //       nodeReady,
// //       dependenciesMet(dependencies)
// //     )
// //     if (
// //       entityId &&
// //       audioCtx &&
// //       audioData &&
// //       dependenciesMet(dependencies) &&
// //       !nodeReady &&
// //       !gettingNode &&
// //       !sourceNode
// //     ) {
// //       setSourceNode(audioCtx.createBufferSource())
// //       setGettingNode(true)
// //       audioCtx.decodeAudioData(audioData).then((audioBuffer: AudioBuffer) => {
// //         if (sourceNode) {
// //           sourceNode.buffer = audioBuffer
// //           sourceNode.connect(audioCtx!.destination)
// //           sourceNode.loop = true
// //           setNodeReady(true)
// //         }
// //       })

// //       return () => {
// //         if (audioCtx && sourceNode) {
// //           sourceNode.stop()
// //           sourceNode.disconnect(audioCtx.destination)
// //           setNodeReady(false)
// //         }
// //       }
// //     }
// //   })

// //   console.log(nodeReady, sourceNode)
// //   return { nodeReady, sourceNode }
// // }
