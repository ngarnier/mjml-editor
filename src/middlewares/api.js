import axios from 'axios'

import { startLoader, stopLoader } from 'actions/loaders'

export default store => next => async action => {

  // ignore all non-API actions
  if (!action.type.startsWith('API:')) {
    return next(action)
  }

  // dispatch: to dispatch custom actions
  // getState: to eventually pass state to handlers
  const { dispatch, getState } = store

  // extract prefix from action type
  // e.g 'API:FETCH_GIST => FETCH_GIST'
  const prefix = action.type.split(':')[1]

  // extract data from action payload
  // to build request
  const {
    url,
    method = 'get',
    query,
    data,
    extra,
  } = action.payload

  // start loader which name is prefix
  dispatch(startLoader(prefix))

  try {

    // build request params

    const r = {
      url: `${__API_URL__}${url}`,
      method,
    }

    if (data) {
      r.data = typeof data === 'function'
        ? data(getState())
        : data
    }

    if (query) { r.query = query }

    // execute request
    const res = await axios.request(r)

    // ability to pass data to reducers from actions
    const successPayload = extra
      ? { extra, data: res.data }
      : res.data

    // dispatch request result as success
    dispatch({
      type: `${prefix}_SUCCESS`,
      payload: successPayload,
    })

    // stop loader
    dispatch(stopLoader(prefix))

  } catch (err) {

    // dispatch error
    dispatch({
      type: `${prefix}_ERROR`,
    })

    // stop loader
    dispatch(stopLoader(prefix))

    // reject promise
    throw err
  }

}
