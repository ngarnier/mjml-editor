import React from 'react'
import thunk from 'redux-thunk'
import {
  renderToStaticMarkup,
  renderToString,
} from 'react-dom/server'

import {
  createStore,
  applyMiddleware,
} from 'redux'
import {
  Provider,
} from 'react-redux'
import {
  createServerRenderContext,
  ServerRouter,
} from 'react-router'

import reducers from 'reducers'

import Application from 'components/Application'
import Html from 'components/Html'

const stats = process.env.NODE_ENV === 'production'
  ? require(`${process.cwd()}/dist/stats.json`)
  : {}

export default async function render (req, res) {
  try {
    const context = createServerRenderContext()
    const result = context.getResult()

    if (result.redirect) {
      return res
        .status(301)
        .redirect(result.redirect.pathname)
    }

    if (result.missed) {
      res.status(404)
    }

    const middlewares = applyMiddleware(thunk)
    const store = createStore(reducers, {}, middlewares)

    store.dispatch({
      type: 'SET_USER',
      payload: req.user
        ? req.user.profile._json
        : null,
    })

    if (req.session.editor) {
      const {
        editor,
      } = req.session

      store.dispatch({
        type: 'SET_ACTIVE_TAB',
        payload: editor.activeTab,
      })

      store.dispatch({
        type: 'SET_TABS',
        payload: editor.tabs,
      })
    }

    const content = renderToString(
      <Provider
        store={store}
      >
        <ServerRouter
          context={context}
          location={req.url}
        >
          <Application />
        </ServerRouter>
      </Provider>
    )

    const markup = renderToStaticMarkup(
      <Html
        content={content}
        state={store.getState()}
        stats={stats}
      />
    )

    res.end(markup)
  } catch (err) {
    res
      .status(500)
      .send(err.stack)
  }
}
