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
    if (err) { return }

    const {
      socketRoom,
    } = socket.handshake.session

    if (socketRoom) {
      socket.join(socketRoom)

      socket.on('event', data => {
        socket.broadcast.to(socketRoom).emit(data)
      })

      socket.on('logout', () => {
        delete socket.handshake.session.passport
        delete socket.handshake.session.user

        socket.handshake.session.save()
      })

      socket.on('mjml-to-html', ({ mjml }) => {
        const preview = renderMJML(mjml)

        socket.broadcast.to(socketRoom).emit('preview-html', {
          preview,
        })
      })

      socket.on('editor-set-active-tab', ({ activeTab }) => {
        socket.handshake.session.editor.activeTab = activeTab

        socket.handshake.session.save()
      })

      socket.on('editor-set-tabs', ({ tabs }) => {
        socket.handshake.session.editor.tabs = tabs

        socket.handshake.session.save()
      })

      socket.on('gist-open', ({ gistID }) => {
        console.log('gist-open', gistID)
        socket.broadcast.to(socketRoom).emit('url-change', {
          type: 'replace',
          url: `/gists/${gistID}`,
        })
      })
    }
  })
}
