import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'

import api from 'server/api'
import render from 'server/render'

const server = express()

if (process.env.NODE_ENV === 'development') {
  require('server/webpack')(server)
}

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: false,
}))

server.use('/api', api)
server.use(render)

server.listen(3333, '127.0.0.1', err => {
  console.log(`[APP] listening`)
})
