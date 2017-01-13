import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({})

export default handleActions({
  LOADING_START: (state, { payload: { name, value = true } }) => state.set(name, value),
  LOADING_STOP: (state, { payload: name }) => state.remove(name),
}, initialState)

export function isLoading (state, id, value = true) {
  return state.loaders.get(id, false) === value
}
