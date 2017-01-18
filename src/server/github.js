import express from 'express'
import GitHubApi from 'github'

import values from 'lodash/values'

const router = express.Router()

function githubFactory (req, res, next) {
  const github = new GitHubApi()

  const accessToken = req.headers['x-access-token']

  if (accessToken) {
    github.authenticate({
      type: 'token',
      token: accessToken,
    })
  }

  req.githubApi = github

  next()
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

router.get('/rate_limit', githubFactory, (req, res) => {
  req.githubApi.misc.getRateLimit({}, (err, { rate }) => {
    if (err) { return res.status(500).send(err) }
    res.json(rate)
  })
})

router.get('/gists/:id', githubFactory, (req, res) => {
  const {
    id,
  } = req.params

  req.githubApi.gists.get({
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

router.post('/gists', githubFactory, (req, res) => {

  const {
    gistID,
    tab,
  } = req.body

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

    promise = req.githubApi.gists.edit(payload)

  } else {

    const payload = {
      files: {
        [tab.name]: {
          content: tab.value,
        },
      },
      public: true,
    }

    promise = req.githubApi.gists.create(payload)

  }

  promise
    .then(data => {
      res.json({
        gistID: data.id,
        files: data.files,
        ...getRateLimit(data),
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })

})

router.delete('/gists', githubFactory, (req, res) => {

  const {
    gistID,
    name,
  } = req.body

  if (!gistID) {
    return res.status(400).send({ message: 'No gistID specified' })
  }

  req.githubApi.gists
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

// rename a file
router.put('/gists/:gistID/name', githubFactory, (req, res) => {

  const {
    gistID,
  } = req.params

  const {
    oldName,
    newName,
  } = req.body

  if (!gistID) {
    return res.status(400).send({ message: 'No gistID specified' })
  }

  req.githubApi.gists
    .edit({
      id: gistID,
      files: {
        [oldName]: {
          filename: newName,
        },
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
