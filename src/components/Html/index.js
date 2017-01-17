import React from 'react'

const Html = ({ content, socketRoom, state, stats: { styles, main = 'bundle.js' } }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <title>
        MJML Editor
      </title>
      { styles &&
        <link
          href={`/dist/${styles}`}
          rel="stylesheet"
        /> }
    </head>
    <body>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        id="root"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__SOCKET_ROOM__ = '${socketRoom}'`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__INITIAL_STATE__ = ${JSON.stringify(state)}`,
        }}
      />
      <script
        src={`/dist/${main}`}
      />
    </body>
  </html>
)

export default Html
