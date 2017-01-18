import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'

const initialState = fromJS({})

export default handleActions({
  SET_PROFILE: (state, { payload: profile }) => state.set('profile', fromJS(profile)),

  SET_ACCESS_TOKEN: (state, { payload: accessToken }) => state.set('accessToken', accessToken),

  LOGOUT: () => fromJS({}),
}, initialState)
