import React from 'react'

const Html = ({ content, stats: { styles, main = 'bundle.js' } }) => (
  <html>
    <head>
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
      <script src={`/dist/${main}`} />
    </body>
  </html>
)

export default Html
