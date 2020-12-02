import { Transport } from 'tone'
import { useContext, useEffect, useState } from 'react'
import { ProjectClockSettings } from '../types'
import ContextForAudio, { IContextForAudio } from './audioContext';
import { Transport as ToneTransport } from 'tone';

interface useTransportI {
  projectId?: string
  projectClock?: ProjectClockSettings

}

interface useTransportO {
  transportSet: boolean
  Transport: typeof ToneTransport | null
  unsetTransport: () => void
}

export default ({projectId, projectClock}: useTransportI): useTransportO => {

  const [transportSet, setTransportSet] = useState<boolean>(false)
  const [bpm, setBpm] = useState<number | null>(projectClock ? (projectClock.BPM ? projectClock.BPM : null) : null)

  const {
    Transport,
    transportState,
    isCurrentProject
  }: Partial<IContextForAudio> = useContext(ContextForAudio)

  const clockMatchesTransport = (): boolean | null => {
    if (projectId && projectClock) {
      return (Transport ? Transport.bpm.value === projectClock.BPM : null) && 
           (Transport ? Transport.timeSignature === projectClock.beatsPerBar : null)
    } else {
      return null
    }
  }

  const isCurrent = projectId && isCurrentProject ? isCurrentProject(projectId) : false

  const unsetTransport = () => setTransportSet(false);

  // if this project is the current project, set the transport state to match its clock
  useEffect(() => {
    if (Transport && transportState && !transportSet) {
      if (!transportSet && isCurrent && projectClock && !clockMatchesTransport) { 
        Transport.bpm.value = projectClock.BPM || 60
        Transport.timeSignature = projectClock.beatsPerBar || 4
        setTransportSet(true)
      } else {
        setTransportSet(true)
      }
    }
  }, [Transport, transportState])

  // if the projectclock has changed
  useEffect(() => {
    if (projectClock && projectClock.BPM) {
      setBpm(projectClock.BPM)
    }
  }, [projectClock])

  return {
    transportSet,
    unsetTransport,
    Transport: Transport || null
  }
}