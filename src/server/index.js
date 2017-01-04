import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import path from 'path'

import api from 'server/api'
import render from 'server/render'

const server = express()

const port = process.env.PORT || 3333

if (process.env.NODE_ENV === 'development') {
  require('server/webpack')(server)
}

if (process.env.NODE_ENV === 'production') {
  server.use(compression())
  server.use('/dist', express.static(path.join(__dirname, '../../dist')))
}

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: false,
}))

server.use('/api', api)
server.use(render)

server.listen(port, err => {
  console.log(`[APP] listening`)
})
