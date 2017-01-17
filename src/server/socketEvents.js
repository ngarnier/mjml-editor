import filesize from 'filesize'
import { mjml2html } from 'mjml'

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

export default (io, socket, session) => session(socket.handshake, {}, err => {
  if (err) { return }

  const {
    editor,
  } = socket.handshake.session

  if (!editor) {
    socket.handshake.session.editor = {}
  }

  let currentRoom = socket.id

  socket.on('JOIN_ROOM', ({ socketRoom }) => {
    socket.leave(currentRoom)
    socket.join(socketRoom)

    currentRoom = socketRoom
  })

  socket.on('event', data => io.to(currentRoom).emit(data))

  socket.on('logout', () => {
    delete socket.handshake.session.passport
    delete socket.handshake.session.user

    socket.handshake.session.save()
  })

  socket.on('mjml-to-html', ({ mjml }) => {
    const preview = renderMJML(mjml)

    io.to(currentRoom).emit('preview-html', {
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

  socket.on('LOAD_GIST_SUCCESS', ({ gistID }) => {
    io.to(currentRoom).emit('URL_CHANGE', {
      type: 'replace',
      url: `/gists/${gistID}`,
    })
  })
})
