import io from 'socket.io-client'

let socket = null

if (__BROWSER__) {
  socket = io.connect()

  socket.emit('JOIN_ROOM', {
    socketRoom: window.__SOCKET_ROOM__,
  })
}

export default socket
