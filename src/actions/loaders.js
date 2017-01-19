export function startLoader (name, value = true) {
  return { type: 'LOADING_START', payload: { name, value } }
}

export function stopLoader (name) {
  return { type: 'LOADING_STOP', payload: name }
}
