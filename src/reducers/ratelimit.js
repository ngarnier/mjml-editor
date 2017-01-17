import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  // default ratelimit set by Github
  limit: 60,
  remaining: 60,
  reset: Math.floor(Date.now() / 1000),
})

export default handleActions({
  SET_RATE_LIMIT: (state, { payload }) => fromJS(payload),
  GET_RATE_LIMIT_SUCCESS: (state, { payload }) => fromJS(payload),
}, initialState)
