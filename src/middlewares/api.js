import axios from 'axios'

import socket from 'helpers/getClientSocket'

import { addNotif } from 'actions/notifications'
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
    loaderValue = true,
    data,
    extra,
    headers = {},
    method = 'get',
    query,
    socketOnSuccess,
    url,
  } = action.payload

  // start loader which name is prefix
  dispatch(startLoader(prefix, loaderValue))

  try {

    const state = getState()

    // build request params

    const accessToken = state.user.get('accessToken')

    if (accessToken) {
      headers['x-access-token'] = accessToken
    }

    // build request params
    const r = {
      url: `${__API_URL__}${typeof url === 'function' ? url(state) : url}`,
      method,
      headers,
    }

    if (data) {
      r.data = typeof data === 'function'
        ? data(state)
        : data
    }

    if (query) { r.query = query }

    // execute request
    const res = await axios.request(r)

    // set ratelimit if available
    const {
      rateLimit,
    } = res.data

    if (rateLimit) {
      dispatch({
        type: 'SET_RATE_LIMIT',
        payload: rateLimit,
      })
    }

    // ability to pass data to reducers from actions
    const successPayload = extra
      ? { extra, data: res.data }
      : res.data

    const typeSuccess = `${prefix}_SUCCESS`

    if (__BROWSER__ && socketOnSuccess) {
      const dataSocket = typeof socketOnSuccess === 'function'
        ? socketOnSuccess(successPayload)
        : typeof socketOnSuccess === 'boolean'
          ? null
          : socketOnSuccess

      socket.emit(typeSuccess, dataSocket)
    }

    // dispatch request result as success
    dispatch({
      type: typeSuccess,
      payload: successPayload,
    })

    // stop loader
    dispatch(stopLoader(prefix))

    // return promise
    return successPayload

  } catch (err) {

    // dispatch error
    dispatch({
      type: `${prefix}_ERROR`,
    })

    dispatch(addNotif(err.message || err, 'error'))

    // stop loader
    dispatch(stopLoader(prefix))

    // reject promise
    throw err
  }

}
