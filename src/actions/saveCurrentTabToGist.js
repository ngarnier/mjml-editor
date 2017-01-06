import socket from 'getClientSocket'

export default function saveCurrentTabToGist () {
  return function (dispatch, getState) {

    const state = getState()

    socket.emit('github/save-gist', state.editor.get('currentTab'))

  }
}
