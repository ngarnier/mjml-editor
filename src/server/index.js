import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import path from 'path'
import session from 'express-session'
import passport from 'passport'
import {
  Strategy,
} from 'passport-github2'

import api from 'server/api'
import auth from 'server/auth'
// import github from 'server/github'
import render from 'server/render'

const server = express()

const port = process.env.PORT || 3333

if (process.env.NODE_ENV === 'development') {
  require('server/webpack')(server)
}

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

if (process.env.NODE_ENV === 'production') {
  server.use(compression())
  server.use('/dist', express.static(path.join(__dirname, '../../dist')))
}

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: false,
}))
server.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}))
server.use(passport.initialize())
server.use(passport.session())

passport.use(new Strategy({
  callbackURL: 'http://127.0.0.1:3333/signin/callback',
  clientID: '2733cd74eaea1cdf5e53',
  clientSecret: '46bcc71c5337b1de377a6061b9e21aef983d0eef',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile)
}))

server.use('/api', api)
server.use(auth)
// server.use(github)
server.use(render)

server.listen(port, err => {
  console.log(`[APP] listening`)
})
