import axios from 'axios'
import { LoopProps, ProjectProps, TrackProps } from '../types'

const REST_PREFIX = process.env.GATSBY_REST_URI

export interface AxiosProjectsResponse {
  data: ProjectProps[]
}

export interface AxiosProjectResponse {
  data: ProjectProps
}

export interface AxiosTracksResponse {
  data: TrackProps[]
}

export interface AxiosTrackResponse {
  data: TrackProps
}

export interface AxiosLoopsResponse {
  data: LoopProps[]
}

export interface AxiosLoopResponse {
  data: LoopProps
}

export type AudioFileData = [File, string]

const acceptedAudioFileTypes: string[] = [
  'audio/wav',
  'audio/aif',
  'audio/aiff',
]

export const isValidAudioFileType = (fileType: string): boolean =>
  acceptedAudioFileTypes.includes(fileType)

export function getProjectsPage(
  page?: number,
  perPage?: number
): Promise<AxiosProjectsResponse> {
  return axios.post(`${REST_PREFIX}/projects`, { page, perPage })
}

export function getProjectById(id: string): Promise<AxiosProjectResponse> {
  return axios.get(`${REST_PREFIX}/projects/${id}`)
}

export function getNewProject(
  project: ProjectProps = {}
): Promise<AxiosProjectResponse> {
  return axios.post(`${REST_PREFIX}/projects/create`, { params: project })
}

export function getNewTrack(track: TrackProps): Promise<AxiosTrackResponse> {
  return axios.post(`${REST_PREFIX}/tracks/create`, track)
}

export function updateRemoteTrack(
  track: TrackProps
): Promise<AxiosTrackResponse> {
  return axios.post(`${REST_PREFIX}/tracks/${track.id}`)
}

export function saveTrackToDb(track: TrackProps): Promise<AxiosTrackResponse> {
  if (track.id) {
    return updateRemoteTrack(track)
  } else {
    return getNewTrack(track)
  }
}

export function getLoopById(id: string): Promise<AxiosTrackResponse> {
  return axios.get(`${REST_PREFIX}/loops/${id}`)
}

function generateLoopFormData(
  loopData: LoopProps[],
  audioFileData?: AudioFileData[]
): FormData {
  const formData: FormData = new FormData()
  formData.append('loopData', JSON.stringify(loopData))
  if (audioFileData) {
    audioFileData.forEach(audioFileDatum =>
      formData.append('files', audioFileDatum[0], audioFileDatum[1])
    )
  }

  return formData
}

export function getNewLoopFromAudioFile(
  audioFileProps: LoopProps,
  audioFileData: AudioFileData,
  uploadProgressCb?: (e: ProgressEvent) => void
): Promise<AxiosLoopsResponse> {
  if (!isValidAudioFileType(audioFileData[0].type)) {
    return new Promise((res, rej) => rej('File type invalid'))
  } else {
    const formData: FormData = generateLoopFormData(
      [audioFileProps],
      [audioFileData]
    )

    return axios.post(`${REST_PREFIX}/loops/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: uploadProgressCb || undefined,
    })
  }
}

export function updateLoopInDb(
  audioFileProps: LoopProps,
  audioFileData?: AudioFileData,
  uploadProgressCb?: (e: ProgressEvent) => void
): Promise<AxiosLoopsResponse> {
  if (audioFileData) {
    if (!isValidAudioFileType(audioFileData[0].type)) {
      return new Promise((res, rej) => rej('File type invalid'))
    }
  }

  if (!audioFileProps.id) {
    return new Promise((res, rej) => rej('Loop not yet saved (no id)'))
  } else {
    const formData: FormData = generateLoopFormData(
      [audioFileProps],
      audioFileData && [audioFileData]
    )
    return axios.post(`${REST_PREFIX}/loops/${audioFileProps.id})`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: uploadProgressCb || undefined,
    })
  }
}

export function updateProjectInDb(
  project: ProjectProps
): Promise<AxiosProjectResponse> {
  if (!project.id) {
    return new Promise((res, rej) => rej('Project not yet saved (no id'))
  } else {
    return axios.post(`${REST_PREFIX}/projects/${project.id}`, project)
  }
}
