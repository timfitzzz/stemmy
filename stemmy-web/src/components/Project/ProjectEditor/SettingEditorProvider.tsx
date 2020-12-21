import React, { ReactNode } from 'react'
import styled from 'styled-components'

type setter = ((changeProps: any) => void) | null

interface SettingEditorProvider {
  setter: setter
  children: (setter: setter) => ReactNode | ReactNode[]
}

const SettingEditorProvider = ({ setter, children }: SettingEditorProvider) => {
  return <>{setter ? children(setter) : children(null)}</>
}

SettingEditorProvider.whyDidYouRender = true

export default SettingEditorProvider
