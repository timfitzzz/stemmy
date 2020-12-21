import React, { useState, ReactElement, Ref, useRef } from 'react'
import styled from 'styled-components'

interface IEditableLabel {
  fieldName: string
  textLabel?: string
  type: string
  value: string | number | undefined
  setValue: ((value: any) => void) | null
  children?: ReactElement[]
  valueContainer: React.ElementType
  inputContainer: React.ElementType
  saveHandler: () => void
}

interface ILabelContainer {
  ref: Ref<HTMLDivElement>
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const LabelContainer = styled.div<ILabelContainer>`
  margin-left: 8px;
`

const TextLabel = styled.span``

export default ({
  fieldName,
  textLabel,
  type,
  value,
  setValue,
  children,
  valueContainer: ValueContainer,
  inputContainer: InputContainer,
  saveHandler,
}: IEditableLabel) => {
  const [editing, setEditing] = useState(false)
  const [refSet, setRefSet] = useState(false)
  const inputNode = useRef<HTMLDivElement>(null)

  function handleInClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): any {
    if (setValue) {
      setEditing(true)
      const listener = document.addEventListener('mousedown', handleOutClick)
    }
  }

  function handleOutClick(this: any, e: MouseEvent): any {
    if (
      null !== inputNode.current &&
      !inputNode.current.contains(e.target as HTMLElement)
    ) {
      // console.log(
      //   'current: ',
      //   inputNode.current,
      //   ' contains: ',
      //   e.currentTarget
      // )
      exitEditor()
    }
  }

  function exitEditor(): any {
    document.removeEventListener('mousedown', handleOutClick)
    setEditing(false)
    saveHandler()
  }

  function handleInputChange(e: KeyboardEvent): void {
    let target = e.target as HTMLInputElement
    if (setValue) { 
      setValue(target?.value) 
    }
  }

  function handleEnterKey(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault()
      exitEditor()
    }
  }

  return (
    <LabelContainer ref={inputNode} onClick={handleInClick}>
      {textLabel && <TextLabel>{textLabel}</TextLabel>}
      {!editing ? (
        <ValueContainer onClick={handleInClick}>{value}</ValueContainer>
      ) : (
        <InputContainer
          value={value}
          onKeyDown={handleEnterKey}
          onChange={handleInputChange}
          length={
            typeof value === 'string' && (value.length ? value.length : 10)
          }
        />
      )}
      {children && { ...children }}
    </LabelContainer>
  )
}
