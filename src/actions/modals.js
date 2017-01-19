export function openModal (name) {
  return {
    type: 'MODAL_OPEN',
    payload: name,
  }
}

export function closeModal (name) {
  return {
    type: 'MODAL_CLOSE',
    payload: name,
  }
}
