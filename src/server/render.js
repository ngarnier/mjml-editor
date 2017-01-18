import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'

import { createServerRenderContext, ServerRouter } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { matchRoutesToLocation } from 'react-router-addons-routes'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import shortid from 'shortid'
import path from 'path'

import { setProfile, setAccessToken } from 'actions/user'
import apiMiddleware from 'middlewares/api'
import reducers from 'reducers'
import routes from 'routes'

import Application from 'components/Application'
import Html from 'components/Html'

const stats = __PROD__
  ? require(path.resolve(__dirname, '../../dist/stats.json'))
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

    const middlewares = applyMiddleware(thunk, apiMiddleware)
    const store = createStore(reducers, {}, middlewares)

    if (req.user) {
      store.dispatch(setProfile(req.user.profile))
      store.dispatch(setAccessToken(req.user.accessToken))
    }

    // pre-fetch data
    const location = { pathname: req.url }
    const { matchedRoutes, params } = matchRoutesToLocation(routes, location)

    const dataParams = {
      dispatch: store.dispatch,
      params,
    }

    const socketRoom = params.socketRoom || shortid.generate()

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
        socketRoom={socketRoom}
        state={store.getState()}
        stats={stats}
      />
    )

    res.end(markup)
  } catch (err) {
    res.status(500).send(err.stack)
  }
}
