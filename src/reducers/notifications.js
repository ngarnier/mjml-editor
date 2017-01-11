import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS([])

export default handleActions({

  ADD_NOTIF: (state, { payload: al }) => state.unshift(al),

  REMOVE_NOTIF: (state, { payload: id }) => {
    const index = state.findIndex(a => a.get('id') === id)
    if (index === -1) { return state }
    return state.remove(index)
  },

}, initialState)
