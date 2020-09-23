import React from 'react'
import styled from 'styled-components'
import BigButton from './Buttons/BigButton'
import { navigate } from 'gatsby'

const Wrapper = styled.div`
  background: ${p => p.theme.palette.darkPrimary};
  padding-left: 35px;
  padding-top: 10px;
`

export default () => {
  return (
    <Wrapper>
      <BigButton
        text={'+ Add Project'}
        handler={e => {
          e.preventDefault()
          navigate('/add')
        }}
      ></BigButton>
    </Wrapper>
  )
}
