import socket from 'getClientSocket'

export default function saveCurrentTabToGist () {
  return function (dispatch, getState) {

    const state = getState()

    socket.emit('yolo')

  }
}
