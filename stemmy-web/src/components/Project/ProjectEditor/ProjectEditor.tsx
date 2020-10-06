import { useState } from 'react'
import { ProjectActionTypes } from '../../../store/projects'
import { ProjectProps } from '../../../types'

interface ProjectEditorProps {
  project: ProjectProps
  saveProject: (project: ProjectProps) => ProjectActionTypes
}

export default ({ project, saveProject }: ProjectEditorProps) => {
  const [name, setName] = useState(project.name)
  const [tracks, setTracks] = useState(project.tracks)
}
