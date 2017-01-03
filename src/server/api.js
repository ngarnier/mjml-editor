import express from 'express'
import filesize from 'filesize'
import {
  mjml2html,
} from 'mjml'

const router = express.Router()

router.post('/mjml2html', (req, res) => {
  const {
    mjml,
  } = req.body

  const hStart = process.hrtime()

  const {
    html,
  } = mjml2html(mjml)

  const hEnd = process.hrtime(hStart)

  res.send({
    executionTime: hEnd[1] / 1e6,
    html,
    lastRender: Date.now(),
    size: filesize(Buffer.byteLength(html)),
  })
})

export default router
