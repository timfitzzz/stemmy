import * as Tone from 'tone'
import { useContext, Context, useEffect, useState } from 'react'
import { ProjectClockSettings } from '../types'
import ContextForAudio, { OAudioEngine } from './audioContext';
import { useContextSelector } from 'react-use-context-selector';

interface useTransportI {
  projectId?: string
  projectClock?: ProjectClockSettings

}

interface useTransportO {
  transportSet: boolean
  unsetTransport: () => void
  isPlaying: () => boolean
  start: () => void
  stop: () => void
}

export default ({projectId, projectClock}: useTransportI): useTransportO => {

  // const [transport, setTransport] = useState<typeof ToneTransport | null>(null)
  const [transportSet, setTransportSet] = useState<boolean>(false)
  const [bpm, setBpm] = useState<number | null>(projectClock ? (projectClock.BPM ? projectClock.BPM : null) : null)

  const transportState = useContextSelector(ContextForAudio as Context<OAudioEngine>, value => value.transportState)
  const isCurrentProject = useContextSelector(ContextForAudio as Context<OAudioEngine>, value => value.isCurrentProject)
  const transport = useContextSelector(ContextForAudio as Context<OAudioEngine>, value => value.transport)

  const isCurrent = projectId && isCurrentProject ? isCurrentProject(projectId) : false

  const unsetTransport = () => setTransportSet(false);


  console.log('transport vars:', Tone.Transport, transportState, transportSet)

  // // if Transport isn't available in this object yet, make it so
  // useEffect(() => {
  //   if (!transport) {
  //     setTransport(getTransport())
  //   }
  // }, [])

  // if this project is the current project, set the transport state to match its clock
  useEffect(() => {
    if (transportState && !transportSet) {
      if (transport && !transportSet && isCurrent && projectClock && !clockMatchesTransport()) { 
        transport.bpm.value = projectClock.BPM || 60
        transport.timeSignature = projectClock.beatsPerBar || 4
        debugger;
        setTransportSet(true)
      } else {
        setTransportSet(true)
      }
    }

    return () => {
      console.log('running useTransport unmount, stopping transport and cancelling future events')
      transport?.stop()
      // transport?.cancel(0)
    }

  }, [transportState, transportSet, transport])

  // if the projectclock has changed
  useEffect(() => {
    if (projectClock && projectClock.BPM) {
      setBpm(projectClock.BPM)
    }
  }, [projectClock])


  const clockMatchesTransport = (): boolean | null => {
    if (projectId && projectClock) {
      return (transport ? transport.bpm.value === projectClock.BPM : null) && 
           (transport ? transport.timeSignature === projectClock.beatsPerBar : null)
    } else {
      return null
    }
  }

  const isPlaying = (): boolean => (transport && transport.state === 'started' ? true : false)

  const start = (): void => { transport?.start() }

  const stop = (): void => { transport?.stop() }

  return {
    start,
    stop,
    isPlaying,
    transportSet,
    unsetTransport
  }
}