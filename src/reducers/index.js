import { combineReducers } from 'redux'

import editor from 'reducers/editor'
import loaders from 'reducers/loaders'
import user from 'reducers/user'
import notifications from 'reducers/notifications'
import gist from 'reducers/gist'
import ratelimit from 'reducers/ratelimit'

export default combineReducers({
  editor,
  gist,
  loaders,
  notifications,
  ratelimit,
  user,
})
