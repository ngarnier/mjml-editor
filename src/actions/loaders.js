export function startLoader (name) {
  return { type: 'LOADING_START', payload: name }
}

export function stopLoader (name) {
  return { type: 'LOADING_STOP', payload: name }
}
