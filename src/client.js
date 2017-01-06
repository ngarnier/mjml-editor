import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'

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

const middlewares = applyMiddleware(thunk)
const store = createStore(reducers, window.__INITIAL_STATE__, middlewares)

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
