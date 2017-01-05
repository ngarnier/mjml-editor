import filesize from 'filesize'
import {
  mjml2html,
} from 'mjml'

function renderMJML (mjml) {
  let html = ''

  const hStart = process.hrtime()

  try {
    html = mjml2html(mjml).html
  } catch (e) {}

  const hEnd = process.hrtime(hStart)

  return {
    executionTime: hEnd[1] / 1e6,
    html,
    lastRender: Date.now(),
    size: filesize(Buffer.byteLength(html)),
  }
}

export default (socket, session) => {
  session(socket.handshake, {}, err => {
    const {
      socketRoom,
    } = socket.handshake.session

    if (socketRoom) {
      socket.join(socketRoom)

      socket.on('mjml-to-html', ({ mjml }) => {
        const preview = renderMJML(mjml)

        socket.broadcast.to(socketRoom).emit('preview-html', {
          preview,
        })
      })

      socket.on('event', data => {
        socket.broadcast.to(socketRoom).emit(data)
      })
    }
  })
}
