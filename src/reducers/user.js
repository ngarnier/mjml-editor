import { handleActions } from 'redux-actions'

const state = null

export default handleActions({
  SET_USER: (state, { payload }) => payload,
  LOGOUT: () => null,
}, state)
