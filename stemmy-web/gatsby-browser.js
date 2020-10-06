import React from 'react'
import { Provider } from 'react-redux'
import { store } from './src/store'

import './src/styles/global.css'

export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}
