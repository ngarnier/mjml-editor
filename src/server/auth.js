import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/login', passport.authenticate('github', {
  scope: [
    'user',
    'gist',
  ],
}))

router.get('/login/callback', passport.authenticate('github', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/')
})

export default router
