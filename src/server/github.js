import express from 'express'
import GitHubApi from 'github'

const router = express.Router()

const github = new GitHubApi()

router.get('/test', (req, res) => {
  github.authenticate({
    type: 'token',
    token: req.user.accessToken,
  })

  github.gists.getAll({}, (err, data) => {
    console.log(err, data)
  })
})

export default router
