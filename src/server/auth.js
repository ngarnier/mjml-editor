import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/signin', passport.authenticate('github', {
  scope: [
    'user',
    'gist',
  ],
}))

router.get('/signin/callback', passport.authenticate('github', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

export default router
