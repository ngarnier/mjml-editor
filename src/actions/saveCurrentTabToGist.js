import request from 'superagent'
import get from 'lodash/get'

import { addNotif } from 'actions/notifications'

export default function saveCurrentTabToGist () {
  return function (dispatch, getState) {

    const state = getState()
    const tabs = state.editor.get('tabs')
    const activeTab = state.editor.get('activeTab')
    const tab = tabs.get(tabs.findIndex(t => t.get('id') === activeTab))

    dispatch({ type: 'LOADING_START', payload: 'save-gist' })

    request
      .post('/api/github/gists')
      .send({ tab })
      .end((err, res) => {

        dispatch({ type: 'LOADING_STOP', payload: 'save-gist' })

        if (err) {
          let errMsg = get(res, 'body.message', null)
          try {
            errMsg = JSON.parse(errMsg).message
          } catch (e) {}
          dispatch(addNotif(errMsg || 'Oops.. something bad happened.', 'error'))
          return
        }

        const {
          gistID,
        } = res.body

        dispatch({
          type: 'SET_GIST_ID',
          payload: {
            id: tab.get('id'),
            gistID,
          },
        })

      })

  }
}
