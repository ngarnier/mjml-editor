import express from 'express'
import GitHubApi from 'github'

import values from 'lodash/values'

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

function getRateLimit (data) {
  const {
    meta,
  } = data

  if (meta) {
    return {
      rateLimit: {
        limit: meta['x-ratelimit-limit'],
        remaining: meta['x-ratelimit-remaining'],
        reset: meta['x-ratelimit-reset'],
      },
    }
  }

  return {}
}

router.get('/rate_limit', (req, res) => {
  const github = githubFactory(req)

  github.misc.getRateLimit({}, (err, { rate }) => {
    if (err) { return res.status(500).send(err) }
    res.json(rate)
  })
})

router.get('/gists/:id', (req, res) => {
  const {
    id,
  } = req.params

  const github = githubFactory(req)

  github.gists.get({
    id,
  }, (err, gist) => {
    if (err) { return res.status(500).send(err) }
    const files = values(gist.files)
    res.json({
      id,
      files,
    })
  })
})

router.post('/gists', (req, res) => {

  const {
    gistID,
    tab,
  } = req.body

  const github = githubFactory(req)

  let promise

  if (gistID) {

    const payload = {
      id: gistID,
      files: {
        [tab.name]: {
          content: tab.value,
        },
      },
    }

    promise = github.gists.edit(payload)

  } else {

    const payload = {
      files: {
        [tab.name]: {
          content: tab.value,
        },
      },
      public: true,
    }

    promise = github.gists.create(payload)

  }

  promise
    .then(data => {
      res.json({
        gistID: data.id,
        ...getRateLimit(data),
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })

})

router.delete('/gists', (req, res) => {

  const {
    gistID,
    name,
  } = req.body

  if (!gistID) {
    return res.status(400).send({ message: 'No gistID specified' })
  }

  const github = githubFactory(req)

  github.gists
    .edit({
      id: gistID,
      files: {
        [name]: null,
      },
    })
    .then(() => {
      res.status(200).end()
    })
    .catch(err => {
      res.status(500).send(err)
    })

})

export default router
