import React, { Component, MouseEvent } from 'react'
import styled from 'styled-components'

interface IButtonProps {
  text: string
  handler: (event: MouseEvent<HTMLButtonElement>) => void
}

const BigButton = styled.button`
  border: 5px solid ${p => p.theme.palette.lightPrimary};
  border-radius: 10px;
  padding: 10px;
`

const TextContainer = styled.span`
  font-weight: 600;
`

export default ({ text, handler }: IButtonProps) => {
  return (
    <BigButton onClick={handler}>
      <TextContainer>{text}</TextContainer>
    </BigButton>
  )
}
