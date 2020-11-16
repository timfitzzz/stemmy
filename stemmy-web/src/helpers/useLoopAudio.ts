import { useState, useEffect, useContext } from 'react'
import { useSourceNode } from './useSourceNode'
import Axios from 'axios'

let REST_URI = process.env.GATSBY_REST_URI

interface IUseLoopAudio {
  id?: string | undefined
}

export const useLoopAudio = ({ id }: IUseLoopAudio) => {
  let [loadingAudio, setLoadingAudio] = useState<boolean>(false)
  let [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null)

  let { sourceNode } = useSourceNode(arrayBuffer, [id], id || undefined)

  useEffect(() => {
    if (id && !sourceNode && !arrayBuffer && !loadingAudio) {
      setLoadingAudio(true)
      Axios.get<ArrayBuffer>(`${REST_URI}/loops/audio/${id}`, {
        responseType: 'arraybuffer',
      }).then(res => {
        console.log(res)
        setArrayBuffer(res.data)
        console.log('setting array buffer: ', res.data)
        setLoadingAudio(false)
      })
    }
  }, [sourceNode])

  return {
    sourceNode,
  }
}
