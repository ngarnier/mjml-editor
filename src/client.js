import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { fromJS } from 'immutable'

import {
  applyMiddleware,
  createStore,
  compose,
} from 'redux'

import {
  Provider,
} from 'react-redux'

import {
  BrowserRouter,
} from 'react-router'

import reducers from 'reducers'

const initialState = window.__INITIAL_STATE__

// editor reducer is immutable
initialState.editor = fromJS(initialState.editor)
initialState.loaders = fromJS(initialState.loaders)
initialState.notifications = fromJS(initialState.notifications)

const devTools = window.devToolsExtension ? window.devToolsExtension() : f => f

const middlewares = compose(
  applyMiddleware(thunk),
  devTools,
)
const store = createStore(reducers, initialState, middlewares)

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
