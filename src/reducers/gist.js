import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  id: null,
  files: [],
})

export default handleActions({

  LOAD_GIST_SUCCESS: (state, { payload: gist }) => fromJS(gist),

}, initialState)
