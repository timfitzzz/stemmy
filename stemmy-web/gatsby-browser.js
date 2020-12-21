import React from 'react'
import { Provider } from 'react-redux'
import { store } from './src/store'

import './src/styles/global.css'

export const onClientEntry = () => {
  if (process.env.NODE_ENV !== 'production') {
    const whyDidYouRender = require('@welldone-software/why-did-you-render')
    const ReactRedux = require('react-redux/lib')
    const Helpers = require('./src/helpers')
    const UseContextSelector = require('react-use-context-selector')
    whyDidYouRender(React, {
      trackAllPureComponents: true,
      trackHooks: true,
      trackExtraHooks: [
        [ReactRedux, 'useSelector'],
        // [UseContextSelector, 'useContextSelector'],
        // [Helpers, 'useProject'],
        // [Helpers, 'useProjects'],
        // [Helpers, 'useEntityPlayer'],
        // [Helpers, 'useTrack'],
        // [Helpers, 'useTransport']
      ]
    })
  }
}

export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}
