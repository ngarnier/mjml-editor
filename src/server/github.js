import express from 'express'
import GitHubApi from 'github'

const router = express.Router()

const github = new GitHubApi()

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res
    .status(403)
    .end('Not authorized')
}

router.get('/gists/:id', (req, res) => {
  const {
    id,
  } = req.params

  if (req.isAuthenticated()) {
    github.authenticate({
      type: 'token',
      token: req.user.accessToken,
    })
  }

  github.gists.get({
    id,
  }, (err, data) => {
    res.json(data)
  })
})

export default router
