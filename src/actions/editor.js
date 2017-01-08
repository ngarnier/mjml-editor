export function addTab (file = null) {
  return {
    type: 'ADD_TAB',
    payload: file,
  }
}
