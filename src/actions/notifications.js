import shortid from 'shortid'
import { fromJS } from 'immutable'

export function addNotif (message, type = 'info', options = {}) {
  return function (dispatch) {

    const notif = fromJS({
      id: shortid.generate(),
      message,
      type,
    })

    dispatch({
      type: 'ADD_NOTIF',
      payload: notif,
    })

    if (options.autoHide) {
      setTimeout(() => {
        dispatch(removeNotif(notif.get('id')))
      }, 10e3)
    }

  }
}

export function removeNotif (id) {
  return function (dispatch) {
    dispatch({
      type: 'REMOVE_NOTIF',
      payload: id,
    })
  }
}
