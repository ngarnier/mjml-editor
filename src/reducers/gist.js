import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  id: null,
  files: [],
})

export default handleActions({

  LOAD_GIST_SUCCESS: (state, { payload: gist }) => fromJS(gist),

  REMOVE_FILE_FROM_GIST_SUCCESS: (state, { payload }) => {

    const {
      name,
    } = payload.extra

    return state
      .update(
        'files',
        files => files.filter(el => el.get('filename') !== name)
      )

  },

}, initialState)
