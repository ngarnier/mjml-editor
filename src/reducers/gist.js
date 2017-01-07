import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  id: null,
  files: [],
})

export default handleActions({

  SET_GIST: (state, { payload: gist }) => gist,

}, initialState)
