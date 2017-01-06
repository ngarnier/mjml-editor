import {
  combineReducers,
} from 'redux'

import editor from 'reducers/editor'
import loaders from 'reducers/loaders'
import user from 'reducers/user'
import notifications from 'reducers/notifications'

export default combineReducers({
  editor,
  user,
  loaders,
  notifications,
})
