import React from 'react'
import {
  Stage,
  Layer,
  Line,
  Text,
  Circle,
  Arrow,
  Rect,
  Image,
} from 'react-konva'
import { useProject, useTracks } from '../../helpers'
import styled from 'styled-components'

interface IPlayButtonDeluxe {
  projectId: string
}

const PlayButtonDeluxe = ({ projectId }: IPlayButtonDeluxe) => {
  let { project } = useProject({ id: projectId })

  // here's what i need:
  // * all of the track audiobuffers
  //    -- draw the longest
  //    -- draw each one repeatedly
}
