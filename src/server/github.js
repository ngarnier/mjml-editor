import express from 'express'
import GitHubApi from 'github'

const router = express.Router()

const github = new GitHubApi()

router.get('/gists/:id', (req, res) => {
  const {
    id,
  } = req.params

  github.authenticate({
    type: 'token',
    token: req.user.accessToken,
  })

  github.gists.get({
    id,
  }, (err, data) => {
    res.send(data)
  })
})

export default router
