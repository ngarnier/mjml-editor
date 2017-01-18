export function addTab (file = null) {
  return {
    type: 'ADD_TAB',
    payload: file,
  }
}

export function removeTab (id) {
  return {
    type: 'REMOVE_TAB',
    payload: id,
  }
}

export function removeActiveTab () {
  return {
    type: 'REMOVE_ACTIVE_TAB',
  }
}
