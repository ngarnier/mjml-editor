import { combineReducers } from 'redux'

import editor from 'reducers/editor'
import gist from 'reducers/gist'
import loaders from 'reducers/loaders'
import modals from 'reducers/modals'
import notifications from 'reducers/notifications'
import ratelimit from 'reducers/ratelimit'
import user from 'reducers/user'

export default combineReducers({
  editor,
  gist,
  loaders,
  modals,
  notifications,
  ratelimit,
  user,
})
