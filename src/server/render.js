import React from 'react'
import thunk from 'redux-thunk'

import {
  fromJS,
} from 'immutable'

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

import { matchRoutesToLocation } from 'react-router-addons-routes'

import reducers from 'reducers'

import apiMiddleware from 'middlewares/api'

import routes from 'routes'

import { setUser } from 'actions/user'

import Application from 'components/Application'
import Html from 'components/Html'

const stats = process.env.NODE_ENV === 'production'
  ? require(`${process.cwd()}/dist/stats.json`)
  : {}

export default async function render (req, res) {
  try {

    // TODO: handle favicon
    if (req.url === '/favicon.ico') {
      return res.status(404).end()
    }

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

    const middlewares = applyMiddleware(thunk, apiMiddleware)
    const store = createStore(reducers, {}, middlewares)

    if (req.user) {
      store.dispatch(setUser(req.user.profile._json))
    }

    const {
      editor,
    } = req.session

    if (editor.activeTab) {
      store.dispatch({
        type: 'SET_ACTIVE_TAB',
        payload: editor.activeTab,
      })
    }

    if (editor.tabs) {
      store.dispatch({
        type: 'SET_TABS',
        payload: fromJS(editor.tabs),
      })
    }

    // pre-fetch data
    const location = { pathname: req.url }
    const { matchedRoutes, params } = matchRoutesToLocation(routes, location)

    const dataParams = {
      dispatch: store.dispatch,
      params,
    }

    const dataPromises = matchedRoutes
      .filter(route => route.component.load)
      .map(route => route.component.load(dataParams))

    await Promise.all(dataPromises)

    const content = renderToString(
      <Provider store={store}>
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
