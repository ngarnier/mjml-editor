import io from 'socket.io-client'

let socket = null

if (__BROWSER__) {
  socket = io.connect()
}

export default socket
