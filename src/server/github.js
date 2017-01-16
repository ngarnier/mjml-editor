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

// rename a file
router.put('/gists/:gistID/name', (req, res) => {

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

  const github = githubFactory(req)

  github.gists
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
