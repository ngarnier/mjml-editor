import request from 'superagent'
import { fromJS } from 'immutable'

export function loadGist (gistID) {
  return function (dispatch) {
    return new Promise((resolve, reject) => {

      request
        // TODO: no hard code host / port
        .get(`http://localhost:3333/api/github/gists/${gistID}`)
        .end((err, res) => {

          if (err) { return reject(err) }

          dispatch(setGist(fromJS(res.body)))

          resolve()

        })

    })
  }
}

function setGist (gist) {
  return {
    type: 'SET_GIST',
    payload: gist,
  }
}
