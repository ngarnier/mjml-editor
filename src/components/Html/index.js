import React from 'react'

const Html = ({ content, stats: { main = 'bundle.js' } }) => (
  <html>
    <head>
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
