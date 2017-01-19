import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

const initialState = fromJS({
  id: null,
  files: [],
})

export default handleActions({

  NEW_GIST: () => fromJS(initialState),

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

  RENAME_FILE_SUCCESS: (state, { payload }) => {

    const {
      newName,
      oldName,
    } = payload.extra

    return state
      .update(
        'files',
        files => files.map(f => {
          if (f.get('filename') === oldName) {
            return f.set('filename', newName)
          }
          return f
        })
      )

  },

  SET_GIST_FILES: (state, { payload: files }) => state.set('files', fromJS(files)),

}, initialState)
