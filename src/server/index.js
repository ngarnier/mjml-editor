import { Strategy as StrategyGithub } from 'passport-github2'
import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import expressSession from 'express-session'
import favicon from 'serve-favicon'
import passport from 'passport'
import path from 'path'

import auth from 'server/auth'
import github from 'server/github'
import render from 'server/render'

import socketEvents from 'server/socketEvents'

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 3333

if (__DEV__) {
  require('server/webpack')(app)
}

const session = expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
})

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use(new StrategyGithub({
  callbackURL: `${process.env.HOST}/login/callback`,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  done(null, {
    accessToken,
    profile,
  })
}))

app.use(favicon(path.resolve(__dirname, '../assets/favicon.ico')))

if (__PROD__) {
  app.use(compression())
  app.use('/dist', express.static(path.join(__dirname, '../../dist')))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false,
}))
app.use(session)
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  if (!req.session.editor) {
    req.session.editor = {}
  }

  if (req.user && !req.session.user) {
    req.session.user = req.user
  }

  next()
})

app.use(auth)
app.use('/api/github', github)
app.use(render)

io.on('connection', socket => socketEvents(io, socket, session))

server.listen(port, err => {
  if (err) {
    console.log(err) // eslint-disable-line no-console
    process.exit(1)
  }
  console.log(`[APP] listening on port ${port}`) // eslint-disable-line no-console
})
