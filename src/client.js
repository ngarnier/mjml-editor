import React from 'react'
import ReactDOM from 'react-dom'

import thunk from 'redux-thunk'
import { fromJS } from 'immutable'

import {
  applyMiddleware,
  createStore,
  compose,
} from 'redux'

import Wrapper from 'containers/Wrapper'

import reducers from 'reducers'

import apiMiddleware from 'middlewares/api'

const initialState = window.__INITIAL_STATE__

// immutable reducers
initialState.editor = fromJS(initialState.editor)
initialState.gist = fromJS(initialState.gist)
initialState.loaders = fromJS(initialState.loaders)
initialState.notifications = fromJS(initialState.notifications)
initialState.ratelimit = fromJS(initialState.ratelimit)

const devTools = window.devToolsExtension
  ? window.devToolsExtension()
  : f => f

const middlewares = compose(
  applyMiddleware(thunk, apiMiddleware),
  devTools,
)

const store = createStore(reducers, initialState, middlewares)

const roolEl = document.getElementById('root')

function render (Component) {
  ReactDOM.render(
    <Wrapper store={store}>
      <Component />
    </Wrapper>,
    roolEl
  )
}

render(require('components/Application'))

if (module.hot) {
  module.hot.accept('components/Application', () => render(require('components/Application')))
}
