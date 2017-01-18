import { fromJS } from 'immutable'

import {
  addTab,
} from 'actions/editor'

export function loadGist (gistID) {
  return function (dispatch) {

    const action = {
      type: 'API:LOAD_GIST',
      payload: {
        url: `/github/gists/${gistID}`,
        socketOnSuccess: {
          gistID,
        },
      },
    }

    // load the gist
    return dispatch(action)

      // eventually open tab with first file
      .then(res => {

        const {
          files,
        } = res

        if (files.length) {
          dispatch(addTab(fromJS(files[0])))
        }

      })

  }
}

// save the current opened tab to gist
// if gist already exists for this session, use it
// else, create a new gist for it
export function saveCurrentTabToGist () {
  return {
    type: 'API:SAVE_CURRENT_TO_GIST',
    payload: {
      method: 'post',
      url: '/github/gists',
      data: state => {

        const gistID = state.gist.get('id')
        const tabs = state.editor.get('tabs')
        const activeTab = state.editor.get('activeTab')
        const tab = tabs.get(tabs.findIndex(t => t.get('id') === activeTab))

        return {
          gistID,
          tab,
        }

      },
    },
  }
}

// remove the given file from the current gist
export function removeFileFromGist (name) {
  return {
    type: 'API:REMOVE_FILE_FROM_GIST',
    payload: {
      method: 'delete',
      url: '/github/gists',
      loaderValue: name,
      data: state => {
        const gistID = state.gist.get('id')
        return {
          gistID,
          name,
        }
      },
      extra: {
        name,
      },
    },
  }
}

// rename the file from oldName to newName
export function renameFile (oldName, newName) {
  const payload = { oldName, newName }
  return {
    type: 'API:RENAME_FILE',
    payload: {
      method: 'put',
      url: state => `/github/gists/${state.gist.get('id')}/name`,
      loaderValue: oldName,
      data: payload,
      extra: payload,
    },
  }
}
