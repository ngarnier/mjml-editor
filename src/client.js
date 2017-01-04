import React from 'react'
import ReactDOM from 'react-dom'

import {
  applyMiddleware,
  createStore,
} from 'redux'
import {
  Provider,
} from 'react-redux'
import {
  BrowserRouter,
} from 'react-router'

import reducers from 'reducers'

const store = createStore(reducers, window.__INITIAL_STATE__)

const roolEl = document.getElementById('root')

function render (Component) {
  ReactDOM.render(
    <Provider
      store={store}
    >
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </Provider>,
    roolEl
  )
}

render(require('components/Application'))

if (module.hot) {
  module.hot.accept('components/Application', () => render(require('components/Application')))
}
