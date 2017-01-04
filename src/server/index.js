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
import github from 'server/github'
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
  callbackURL: `${process.env.HOST}/login/callback`,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  done(null, {
    accessToken,
    profile,
  })
}))

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res
    .status(403)
    .end('Not authorized')
}

server.use(auth)
server.use('/api', api)
server.use('/api/github', ensureAuthenticated, github)
server.use(render)

server.listen(port, err => {
  console.log(`[APP] listening`)
})
