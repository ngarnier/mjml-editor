import React from 'react'
import {
  renderToStaticMarkup,
  renderToString,
} from 'react-dom/server'

import {
  createServerRenderContext,
  ServerRouter,
} from 'react-router'

import Application from 'components/Application'
import Html from 'components/Html'

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

    const markup = renderToStaticMarkup(
      <Html
        content={renderToString(
          <ServerRouter
            context={context}
            location={req.url}
          >
            <Application />
          </ServerRouter>
        )}
        stats={{}}
      />
    )

    res.end(markup)
  } catch (err) {
    res
      .status(500)
      .send(err.stack)
  }
}
