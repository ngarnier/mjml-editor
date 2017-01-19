import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({})

export default handleActions({
  MODAL_OPEN: (state, { payload: name }) => state.set(name, true),
  MODAL_CLOSE: (state, { payload: name }) => state.remove(name),
}, initialState)

export function isModalOpen (state, name) {
  return state.modals.get(name) === true
}
