import React from 'react'
import ReactDOM from 'react-dom'

import {
  applyMiddleware,
  createStore,
} from 'redux'
import {
  Provider,
} from 'react-redux'
import thunk from 'redux-thunk'

import {
  BrowserRouter,
} from 'react-router'

const store = createStore(applyMiddleware(thunk))

const roolEl = document.getElementById('root')

function render (Component) {
  ReactDOM.render(
    <Provider store={store}>
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
