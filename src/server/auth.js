import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/login', (req, res, next) => {
  req.session.redirect = new Buffer(req.get('Referrer'))

  passport.authenticate('github', {
    scope: [
      'user',
      'gist',
    ],
  })(req, res, next)
})

router.get('/login/callback', (req, res, next) => {
  const {
    redirect,
  } = req.session

  delete req.session.redirect

  passport.authenticate('github', {
    failureRedirect: '/',
    successRedirect: redirect
      ? new Buffer(redirect, 'base64').toString()
      : '/'
  })(req, res, next)
})

export default router
