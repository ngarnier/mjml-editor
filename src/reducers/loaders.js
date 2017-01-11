import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({})

export default handleActions({
  LOADING_START: (state, { payload: id }) => state.set(id, true),
  LOADING_STOP: (state, { payload: id }) => state.remove(id),
}, initialState)

export function isLoading (state, id) {
  return state.loaders.get(id, false)
}
