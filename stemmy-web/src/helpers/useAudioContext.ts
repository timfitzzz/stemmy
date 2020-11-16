// import { useContext, useState, useCallback, useEffect } from 'react';
// import ContextForAudio, { IContextForAudio } from './audioContext';

// export const useAudioContext = (): IContextForAudio => {

//   const [entitySourceNodes, setEntitySourceNodes] = useState<Partial<{[key: string]: AudioBufferSourceNode}>>({});
//   const [entityArrayBuffers, setEntityArrayBuffers] = useState<Partial<{[key: string]: ArrayBuffer}>>({});

//   const upsertSourceNode = (id: string, sourceNode: AudioBufferSourceNode) => setEntitySourceNodes({
//     ...entitySourceNodes,
//     [id]: sourceNode
//   })

//   const upsertArrayBuffer = (id: string, arrayBuffer: ArrayBuffer) => setEntityArrayBuffers({
//     ...entityArrayBuffers,
//     [id]: arrayBuffer
//   })

//   useEffect(() => {
//     if (window && !context.audioCtx) {
//       setContext(new AudioContext({}))
//     }
//   })

//   return {
//     audioCtx: audioCtx,
//     entitySourceNodes,
//     entityArrayBuffers
//   }

// }
