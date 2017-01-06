import request from 'superagent'

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

        if (err) { return }

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
