import express from 'express'
import GitHubApi from 'github'

const router = express.Router()

function githubFactory (req) {
  const github = new GitHubApi()
  if (req.isAuthenticated()) {
    github.authenticate({
      type: 'token',
      token: req.user.accessToken,
    })
  }
  return github
}

export const ensureAuthenticated = (req, res, next) => {
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

  const github = githubFactory(req)

  github.gists.get({
    id,
  }, (err, data) => {
    if (err) { return res.status(500).send(err) }
    res.json(data)
  })
})

router.post('/gists', (req, res) => {

  const {
    tab,
  } = req.body

  const github = githubFactory(req)
  github.gists.create({
    files: {
      toto: {
        content: tab.value,
      },
    },
    public: true,
  }, (err, data) => {
    if (err) { return res.status(500).send(err) }
    res.json({
      gistID: data.id,
    })
  })
})

export default router
