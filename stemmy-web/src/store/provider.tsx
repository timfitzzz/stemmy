import React, { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { store } from './index'

export const ReduxProvider = ({ element }: { element: ReactElement }) => (
  <Provider store={store}>{element}</Provider>
)
