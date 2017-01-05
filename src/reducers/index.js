import {
  combineReducers,
} from 'redux'

import editor from 'reducers/editor'
import user from 'reducers/user'

export default combineReducers({
  editor,
  user,
})
